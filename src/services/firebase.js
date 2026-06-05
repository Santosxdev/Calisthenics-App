import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

const hasConfig = missing.length === 0;

if (!hasConfig) {
  console.warn(
    `[firebase] Variáveis de ambiente ausentes: ${missing.join(', ')}.\n` +
    'Defina EXPO_PUBLIC_FIREBASE_* no .env ou nos Secrets do Snack.'
  );
}

let auth = null;
let db = null;

if (hasConfig && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
}

export { auth, db };
export default firebase;
