// context/AppContext.js
// Estado global da aplicação usando Context API + useReducer
// Gerencia: usuário, sessões de treino, achievements, e treino do dia
// Persiste automaticamente no AsyncStorage a cada alteração

import React, { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react';
import { loadData, saveData } from '../services/storage';
import { getRoutineById } from '../data/routines';
import { todayDayIndex } from '../utils/dateUtils';
import ACHIEVEMENTS from '../data/achievements';

const AppContext = createContext(null);

const initialState = {
  user: null,
  sessions: [],
  achievements: [],
};

// Reducer com ações para modificar o estado global
function reducer(state, action) {
  switch (action.type) {
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

  // Hidrata: carrega dados do AsyncStorage na inicialização
  useEffect(() => {
    async function hydrate() {
      const [user, sessions, achievements] = await Promise.all([
        loadData('user'),
        loadData('sessions'),
        loadData('achievements'),
      ]);

      if (user) dispatch({ type: 'SET_USER', payload: user });
      if (sessions) dispatch({ type: 'SET_SESSIONS', payload: sessions });
      if (achievements) {
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
      } else {
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: ACHIEVEMENTS.map((a) => ({ ...a })) });
      }

      setHydrated(true);
    }
    hydrate();
  }, []);

  // Persiste automaticamente quando user, sessions ou achievements mudam
  useEffect(() => {
    if (!hydrated) return;
    const prev = prevState.current;
    if (prev.user !== state.user) saveData('user', state.user);
    if (prev.sessions !== state.sessions) saveData('sessions', state.sessions);
    if (prev.achievements !== state.achievements) saveData('achievements', state.achievements);
    prevState.current = state;
  }, [state, hydrated]);

  // Calcula o treino do dia baseado na rotina do usuário e dia da semana atual
  const todayWorkout = (() => {
    if (!state.user) return null;
    const routine = getRoutineById(state.user.routine);
    if (!routine) return null;
    const dayIndex = todayDayIndex();
    // Ajusta: array começa em Segunda (idx 0), mas getDay() retorna 0=Dom
    const day = routine.weekSchedule[dayIndex === 0 ? 6 : dayIndex - 1];
    return day || null;
  })();

  const value = { state, dispatch, todayWorkout };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook customizado para acessar o contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
