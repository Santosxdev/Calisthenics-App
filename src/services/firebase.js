const API_KEY = 'AIzaSyB-ITkEecVL8BKjUAf4lIqg8A3-M85_lPM';
const PROJECT_ID = 'workout-log-5c16d';
const AUTH_BASE = 'https://identitytoolkit.googleapis.com/v1';
const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let currentUser = null;
let idToken = null;
let refreshToken = null;
const listeners = [];

function notifyListeners(user) {
  listeners.forEach((cb) => {
    try { cb(user); } catch (_) {}
  });
}

function mapUser(data) {
  if (!data) return null;
  return {
    uid: data.localId,
    email: data.email,
    displayName: data.displayName || '',
  };
}

async function requestAuth(endpoint, body) {
  const res = await fetch(`${AUTH_BASE}${endpoint}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    const msg = json.error?.message || '';
    const code =
      msg === 'EMAIL_EXISTS' ? 'auth/email-already-in-use'
      : msg === 'INVALID_LOGIN_CREDENTIALS' ? 'auth/invalid-credential'
      : msg === 'EMAIL_NOT_FOUND' ? 'auth/user-not-found'
      : msg === 'INVALID_PASSWORD' ? 'auth/wrong-password'
      : msg === 'WEAK_PASSWORD' ? 'auth/weak-password'
      : msg === 'USER_DISABLED' ? 'auth/user-disabled'
      : 'auth/unknown';
    const err = new Error(msg);
    err.code = code;
    throw err;
  }
  idToken = json.idToken;
  refreshToken = json.refreshToken || refreshToken;
  return json;
}

class Timestamp {
  constructor(date) { this.date = date; }
  static now() { return new Timestamp(new Date().toISOString()); }
  toJSON() { return this.date; }
}

function randomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 20; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

function docData(d) {
  if (!d || !d.fields) return null;
  const obj = {};
  Object.entries(d.fields).forEach(([key, val]) => {
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined) obj[key] = parseInt(val.integerValue, 10);
    else if (val.booleanValue !== undefined) obj[key] = val.booleanValue;
    else if (val.doubleValue !== undefined) obj[key] = val.doubleValue;
    else if (val.timestampValue) obj[key] = val.timestampValue;
    else if (val.nullValue !== undefined) obj[key] = null;
    else if (val.arrayValue?.values) {
      obj[key] = val.arrayValue.values.map((v) => {
        const inner = docData({ fields: v.mapValue?.fields || {} });
        return inner || v;
      });
    } else if (val.mapValue?.fields) {
      obj[key] = docData({ fields: val.mapValue.fields });
    } else {
      obj[key] = val;
    }
  });
  return obj;
}

function toFields(obj) {
  const fields = {};
  Object.entries(obj || {}).forEach(([key, val]) => {
    if (val instanceof Timestamp) fields[key] = { timestampValue: val.date };
    else if (typeof val === 'string') fields[key] = { stringValue: val };
    else if (typeof val === 'number') fields[key] = Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
    else if (typeof val === 'boolean') fields[key] = { booleanValue: val };
    else if (val === null || val === undefined) fields[key] = { nullValue: null };
    else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map((v) => {
            if (typeof v !== 'object' || v === null) return { stringValue: String(v) };
            return { mapValue: { fields: toFields(v) } };
          }),
        },
      };
    } else if (typeof val === 'object') {
      fields[key] = { mapValue: { fields: toFields(val) } };
    } else {
      fields[key] = { stringValue: String(val) };
    }
  });
  return fields;
}

async function requestFirestore(method, path, body) {
  if (!idToken) throw new Error('Não autenticado');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${FIRESTORE_BASE}/${path}`, opts);
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || 'Erro no Firestore');
    throw err;
  }
  return json;
}

// ---- AUTH ----

const authObj = {
  createUserWithEmailAndPassword(email, password) {
    return requestAuth('/accounts:signUp', { email, password, returnSecureToken: true }).then((json) => {
      currentUser = mapUser(json);
      notifyListeners(currentUser);
      return { user: currentUser };
    });
  },

  signInWithEmailAndPassword(email, password) {
    return requestAuth('/accounts:signInWithPassword', { email, password, returnSecureToken: true }).then((json) => {
      currentUser = mapUser(json);
      notifyListeners(currentUser);
      return { user: currentUser };
    });
  },

  signOut() {
    currentUser = null;
    idToken = null;
    refreshToken = null;
    notifyListeners(null);
    return Promise.resolve();
  },

  onAuthStateChanged(callback) {
    listeners.push(callback);
    if (currentUser) callback(currentUser);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  updateProfile(displayName) {
    if (!currentUser) return Promise.reject(new Error('Não autenticado'));
    return requestAuth('/accounts:update', {
      idToken,
      displayName,
      returnSecureToken: true,
      deleteAttribute: [],
    }).then((json) => {
      currentUser.displayName = displayName;
      currentUser.email = json.email || currentUser.email;
      notifyListeners(currentUser);
    });
  },
};

// ---- FIRESTORE ----

function makeDocRef(path) {
  return {
    path,
    get() {
      return requestFirestore('GET', path).then((d) => ({
        exists: !!d,
        data: () => docData(d),
        id: path.split('/').pop(),
      }));
    },
    set(data, opts = {}) {
      const fields = toFields(data);
      let url = path;
      if (opts.merge) {
        const masks = Object.keys(data).map((k) => `updateMask.fieldPaths=${k}`).join('&');
        url += `?${masks}`;
      }
      return requestFirestore('PATCH', url, { fields }).then(() => {});
    },
    delete() {
      return requestFirestore('DELETE', path).then(() => {});
    },
  };
}

function makeColRef(path) {
  return {
    add(data) {
      return requestFirestore('POST', path, { fields: toFields(data) }).then((d) => ({
        id: d.name.split('/').pop(),
      }));
    },
    doc(id) {
      return makeDocRef(`${path}/${id || randomId()}`);
    },
    orderBy(field, dir) {
      return {
        get: () => runQuery(path, field, dir || 'ASCENDING'),
      };
    },
  };
}

async function runQuery(path, orderField, orderDir) {
  const body = {
    structuredQuery: {
      from: [{ collectionId: path.split('/').pop() }],
      orderBy: [{ field: { fieldPath: orderField }, direction: orderDir }],
    },
  };
  const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Erro na query');
  const results = Array.isArray(json) ? json : [];
  return {
    docs: results
      .filter((r) => r.document)
      .map((r) => ({
        id: r.document.name.split('/').pop(),
        data: () => docData(r.document),
      })),
  };
}

function parseDocPath(ref) {
  if (typeof ref === 'string') return ref;
  if (ref.path) return ref.path;
  return null;
}

const dbObj = {
  doc(p) { return makeDocRef(p); },
  collection(p) { return makeColRef(p); },
  batch() {
    const writes = [];
    return {
      set(ref, data) {
        writes.push(() => makeDocRef(parseDocPath(ref)).set(data));
      },
      commit() {
        return Promise.all(writes.map((fn) => fn()));
      },
    };
  },
};

export const auth = authObj;
export const db = dbObj;
export { Timestamp };
export default { auth, db, Timestamp };
