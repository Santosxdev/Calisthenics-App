// services/firestoreService.js
// Operações CRUD no Firestore.
// Gerencia documentos de usuário, treinos semanais, sessões e achievements.
// Todas as funções são chamadas pelo AppContext (sync automático) ou diretamente
// por telas específicas (ex: ActiveWorkoutScreen).

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ---- USUÁRIO ----

// Retorna os dados do documento do usuário, ou null se não existir.
export function getUserData(uid) {
  return getDoc(doc(db, 'users', uid)).then((snap) => (snap.exists() ? snap.data() : null));
}

// Salva (ou mescla) dados no documento do usuário.
// Usa merge: true para não sobrescrever campos existentes.
export function saveUserData(uid, data) {
  return setDoc(doc(db, 'users', uid), data, { merge: true });
}

// ---- TREINOS SEMANAIS (workouts) ----

// Carrega os exercícios de uma semana específica (formato "YYYY-WNN").
export function getWeekWorkout(uid, weekId) {
  return getDoc(doc(db, 'users', uid, 'workouts', weekId)).then((snap) =>
    snap.exists() ? snap.data() : null
  );
}

// Inicializa uma semana com os exercícios padrão da rotina.
// Cria 7 dias (segunda a domingo) com os exercícios correspondentes.
export function initWeekWorkout(uid, weekId, routineExercises) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekData = {};
  days.forEach((day, i) => {
    weekData[day] = {
      exercises: routineExercises[i] || [],
      completed: false,
    };
  });
  return setDoc(doc(db, 'users', uid, 'workouts', weekId), { days: weekData });
}

// Atualiza os exercícios de um dia específico na semana.
export function saveDayExercises(uid, weekId, dayName, exercises) {
  return setDoc(
    doc(db, 'users', uid, 'workouts', weekId),
    { [`days.${dayName}.exercises`]: exercises },
    { merge: true }
  );
}

// Marca um dia como completo na semana.
export function completeDay(uid, weekId, dayName) {
  return setDoc(
    doc(db, 'users', uid, 'workouts', weekId),
    { [`days.${dayName}.completed`]: true },
    { merge: true }
  );
}

// ---- SESSÕES DE TREINO ----

// Adiciona uma nova sessão de treino à subcoleção do usuário.
// O date e createdAt são Timestamps do Firestore.
export function addSession(uid, session) {
  return addDoc(collection(db, 'users', uid, 'sessions'), {
    ...session,
    date: session.date || Timestamp.now(),
    createdAt: Timestamp.now(),
  });
}

// Substitui todas as sessões do usuário em lote (usado na migração inicial).
// Cria um batch write para atomicidade.
export function replaceSessions(uid, sessions) {
  if (sessions.length === 0) return Promise.resolve();
  const batch = writeBatch(db);
  sessions.forEach((s) => {
    const ref = doc(collection(db, 'users', uid, 'sessions'));
    batch.set(ref, {
      ...s,
      date: s.date || Timestamp.now(),
      createdAt: Timestamp.now(),
    });
  });
  return batch.commit();
}

// Retorna todas as sessões do usuário ordenadas por data (mais recente primeiro).
export function getSessions(uid) {
  const q = query(collection(db, 'users', uid, 'sessions'), orderBy('date', 'desc'));
  return getDocs(q).then((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// ---- ACHIEVEMENTS ----

// Salva o array de achievements no documento do usuário (campo "achievements").
// Usa merge para preservar outros campos do documento.
export function saveAchievements(uid, achievements) {
  return setDoc(doc(db, 'users', uid), { achievements }, { merge: true });
}

// Carrega o array de achievements do documento do usuário.
// Retorna null se o campo não existir.
export function getAchievements(uid) {
  return getDoc(doc(db, 'users', uid)).then((snap) => {
    if (!snap.exists()) return null;
    const data = snap.data();
    return data.achievements || null;
  });
}

// ---- RESET ----

// Remove o documento do usuário (usado no reset de dados).
export function deleteUserData(uid) {
  const userRef = doc(db, 'users', uid);
  return deleteDoc(userRef);
}
