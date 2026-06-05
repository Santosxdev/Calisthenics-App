// services/authService.js
// Camada de autenticação via Firebase Auth.
// Oferece cadastro, login, logout e listener de mudança de estado.
// O register() não cria documento no Firestore — isso é feito pelo AppContext
// durante o merge de dados, evitando race conditions.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

// Cria conta com email/senha e define o nome de exibição no perfil do Firebase Auth.
// O nome é armazenado como displayName para ser lido pelo AppContext durante o merge.
export function register(email, password, name) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(async (cred) => {
      await updateProfile(cred.user, { displayName: name });
      return cred;
    });
}

// Login com email e senha.
// Retorna a credencial do Firebase Auth; o AppContext reage via onAuthStateChanged.
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Desloga o usuário atual.
// Dispara onAuthStateChanged(null), que faz o AppNavigator trocar para AuthStack.
export function logout() {
  return signOut(auth);
}

// Registra callback para mudanças no estado de autenticação.
// Usado internamente pelo AppContext para gerenciar o fluxo de navegação.
export function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}
