// services/storage.js
// Wrapper para AsyncStorage com chaves padronizadas
// Garante persistência local dos dados do usuário, sessões e achievements

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  user: '@kcal_user',
  sessions: '@kcal_sessions',
  achievements: '@kcal_achievements',
};

// Carrega dados do AsyncStorage pela chave. Retorna null se não existir.
export async function loadData(key) {
  try {
    const raw = await AsyncStorage.getItem(KEYS[key] || key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Salva dados no AsyncStorage pela chave
export async function saveData(key, value) {
  try {
    await AsyncStorage.setItem(KEYS[key] || key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Remove todas as chaves do app (reset completo)
export async function resetAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return true;
  } catch {
    return false;
  }
}
