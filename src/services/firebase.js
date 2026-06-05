// services/firebase.js
// Inicialização do Firebase com persistência de autenticação para React Native.
// Usa initializeAuth (em vez de getAuth) para configurar persistência via AsyncStorage,
// garantindo que o usuário permaneça logado mesmo após fechar o app.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração carregada das variáveis de ambiente (EXPO_PUBLIC_*)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Evita inicializar múltiplas instâncias (segurança para hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Tenta inicializar auth com persistência React Native (AsyncStorage).
// O catch cobre o caso de já ter sido inicializado (ex: hot-reload no Expo).
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
export default app;
