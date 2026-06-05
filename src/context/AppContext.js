// context/AppContext.js
// Estado global da aplicação usando Context API + useReducer.
//
// GERENCIA:
// - authState: 'loading' | 'authenticated' | 'unauthenticated' (controla navegação)
// - authUser: objeto do Firebase Auth (uid, email, displayName)
// - user: dados do perfil (nome, preferências, XP, streak, rotina)
// - sessions: histórico de treinos realizados
// - achievements: conquistas desbloqueadas
// - todayWorkout: cálculo do treino do dia baseado na rotina
//
// FLUXO DE AUTENTICAÇÃO:
// 1. App monta → onAuthStateChanged é registrado → authState = 'loading'
// 2. Firebase verifica sessão:
//    a. Usuário logado → carrega AsyncStorage + Firestore → merge/migração → 'authenticated'
//    b. Não logado → 'unauthenticated'
// 3. AppNavigator reage ao authState e mostra a tela correta
//
// SINCORNIZAÇÃO (efeito único unificado):
// - Monitora mudanças em user/sessions/achievements
// - Salva no AsyncStorage (leitura instantânea, offline-first)
// - Salva no Firestore em background (catch silencioso)
// - prevState ref evita ciclos e disparos duplicados

import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { loadData, saveData } from '../services/storage';
import { getRoutineById } from '../data/routines';
import { todayDayIndex } from '../utils/dateUtils';
import ACHIEVEMENTS from '../data/achievements';
import {
  getUserData,
  saveUserData,
  getSessions,
  addSession,
  saveAchievements,
  getAchievements,
} from '../services/firestoreService';

const AppContext = createContext(null);

// Estado inicial: aguardando verificação de autenticação
const initialState = {
  authState: 'loading',
  authUser: null,
  user: null,
  sessions: [],
  achievements: [],
};

// Reducer com ações para modificar o estado global
function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH_STATE':
      return { ...state, authState: action.payload };
    case 'SET_AUTH_USER':
      return { ...state, authUser: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'ADD_SESSION': {
      const sessions = [...state.sessions, action.payload];
      return { ...state, sessions };
    }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const prevState = useRef(state);

  // ---- LISTENER DE AUTENTICAÇÃO ----
  // Registra onAuthStateChanged na montagem.
  // Quando o Firebase Auth detecta mudança:
  //   - Se logado: carrega dados locais e da nuvem, faz merge, migra se necessário
  //   - Se deslogado: limpa estado, mostra tela de login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário logado: inicia carregamento dos dados
        dispatch({ type: 'SET_AUTH_USER', payload: firebaseUser });

        try {
          // Carrega dados locais (AsyncStorage) em paralelo
          const [localUser, localSessions, localAchievements] = await Promise.all([
            loadData('user'),
            loadData('sessions'),
            loadData('achievements'),
          ]);

          // Carrega dados da nuvem (Firestore) em paralelo
          // .catch(() => null) → se falhar (offline), usa apenas dados locais
          const [cloudUser, cloudSessions, cloudAchievements] = await Promise.all([
            getUserData(firebaseUser.uid).catch(() => null),
            getSessions(firebaseUser.uid).catch(() => null),
            getAchievements(firebaseUser.uid).catch(() => null),
          ]);

          // MERGE: prioridade Firestore > AsyncStorage > defaults
          // Firestore vence se existir (é a fonte da verdade após o primeiro sync)
          // Se não há dados em lugar nenhum, cria objeto padrão
          const user = cloudUser || localUser || {
            name: firebaseUser.displayName || 'Usuário',
            email: firebaseUser.email,
            preferences: { goal: '', level: '' },
            level: 1,
            xp: 0,
            streak: 0,
            lastWorkoutDate: null,
            routine: 'ppl',
          };

          // MIGRAÇÃO: se existem dados locais mas não na nuvem, sobe para o Firestore
          // Isso garante que usuários existentes não percam progresso ao criar conta
          if (localUser && !cloudUser) {
            await saveUserData(firebaseUser.uid, { ...localUser, email: firebaseUser.email });
          }

          const sessions = cloudSessions || localSessions || [];

          // Migra sessões locais para a nuvem se necessário
          // Adiciona _migrated: true como flag opcional
          if (localSessions && !cloudSessions && localSessions.length > 0) {
            await Promise.all(localSessions.map((s) => addSession(firebaseUser.uid, { ...s, _migrated: true })));
          }

          const achievements = cloudAchievements || localAchievements ||
            ACHIEVEMENTS.map((a) => ({ ...a }));

          if (localAchievements && !cloudAchievements) {
            await saveAchievements(firebaseUser.uid, achievements);
          }

          // Dispatch final com todos os dados carregados
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_SESSIONS', payload: sessions });
          dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
        } catch {
          // FALHA DE REDE: tenta carregar apenas do AsyncStorage
          // Se nem local existe (primeiro acesso), cria dados padrão
          const fallbackUser = await loadData('user');
          if (fallbackUser) {
            dispatch({ type: 'SET_USER', payload: fallbackUser });
            const s = await loadData('sessions');
            if (s) dispatch({ type: 'SET_SESSIONS', payload: s });
            const a = await loadData('achievements');
            if (a) dispatch({ type: 'SET_ACHIEVEMENTS', payload: a });
            else dispatch({ type: 'SET_ACHIEVEMENTS', payload: ACHIEVEMENTS.map((a) => ({ ...a })) });
          } else {
            // Primeiro acesso sem internet: cria objeto mínimo
            dispatch({ type: 'SET_USER', payload: {
              name: firebaseUser?.displayName || 'Usuário',
              email: firebaseUser?.email,
              preferences: { goal: '', level: '' },
              level: 1, xp: 0, streak: 0, lastWorkoutDate: null, routine: 'ppl',
            }});
            dispatch({ type: 'SET_ACHIEVEMENTS', payload: ACHIEVEMENTS.map((a) => ({ ...a })) });
          }
        }

        // Finaliza hidratação e marca como autenticado
        dispatch({ type: 'SET_AUTH_STATE', payload: 'authenticated' });
        setHydrated(true);
      } else {
        // USUÁRIO DESLOGADO: limpa todo o estado
        dispatch({ type: 'SET_AUTH_USER', payload: null });
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_SESSIONS', payload: [] });
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: [] });
        dispatch({ type: 'SET_AUTH_STATE', payload: 'unauthenticated' });
        setHydrated(true);
      }
    });

    // Cleanup: remove o listener ao desmontar
    return unsubscribe;
  }, []);

  // ---- SINCORNIZAÇÃO ÚNICA (AsyncStorage + Firestore) ----
  // Roda sempre que state ou hydrated mudam.
  // Usa prevState ref para detectar O QUE mudou e salvar apenas diferenças.
  // AsyncStorage: síncrono (salva instantaneamente)
  // Firestore: em background com catch (falhas silenciosas)
  useEffect(() => {
    if (!hydrated || state.authState !== 'authenticated') return;
    const prev = prevState.current;
    const uid = state.authUser?.uid;

    // Persistência LOCAL (AsyncStorage)
    if (prev.user !== state.user) saveData('user', state.user);
    if (prev.sessions !== state.sessions) saveData('sessions', state.sessions);
    if (prev.achievements !== state.achievements) saveData('achievements', state.achievements);

    // Persistência na NUVEM (Firestore) — apenas se uid existe
    if (uid) {
      // Sincroniza dados do usuário (nome, preferências, XP, streak, etc.)
      if (prev.user !== state.user && state.user) {
        saveUserData(uid, state.user).catch(() => {});
      }
      // Sincroniza achievements
      if (prev.achievements !== state.achievements && state.achievements) {
        saveAchievements(uid, state.achievements).catch(() => {});
      }
      // Sincroniza nova sessão (apenas a última, incremental)
      if (prev.sessions !== state.sessions && state.sessions) {
        const last = state.sessions[state.sessions.length - 1];
        if (last && !prev.sessions?.find((ps) => ps.id === last.id)) {
          addSession(uid, last).catch(() => {});
        }
      }
    }

    // Atualiza referência para o próximo ciclo
    prevState.current = state;
  }, [state, hydrated]);

  // ---- TREINO DO DIA (derivado) ----
  // Calcula qual treino o usuário deve fazer hoje baseado na rotina e dia da semana.
  const todayWorkout = (() => {
    if (!state.user) return null;
    const routine = getRoutineById(state.user.routine);
    if (!routine) return null;
    const dayIndex = todayDayIndex();
    // Ajusta: getDay() retorna 0=domingo, mas weekSchedule começa em segunda (idx 0)
    const day = routine.weekSchedule[dayIndex === 0 ? 6 : dayIndex - 1];
    return day || null;
  })();

  const value = { state, dispatch, todayWorkout };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook customizado para acessar o contexto de qualquer componente
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
