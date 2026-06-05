// screens/PreferencesScreen.js
// Tela de configuração inicial de objetivo e nível.
// Aparece apenas na primeira vez que o usuário acessa o app logado.
//
// FLUXO COM AUTENTICAÇÃO:
// 1. AppContext carrega dados do usuário (local + nuvem)
// 2. Se goal e level já estiverem definidos → redireciona direto para MainTabs
// 3. Se vazios → exibe esta tela para o usuário configurar
// 4. Ao salvar → dispatch SET_USER + AsyncStorage + Firestore (via AppContext sync)
//
// O dispatch dispara o efeito de sincronização no AppContext, que salva
// automaticamente no AsyncStorage e no Firestore em background.

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import PreferenceCard from '../components/PreferenceCard';
import { suggestRoutine } from '../data/routines';
import { saveData } from '../services/storage';

// Cards de objetivo com seus parâmetros científicos (ACSM, NSCA, Schoenfeld)
const GOALS = [
  { id: 'strength', icon: '💪', title: 'Força', desc: '5-8 reps · Descanso 2-5min' },
  { id: 'hypertrophy', icon: '🔱', title: 'Hipertrofia', desc: '8-15 reps · Descanso 60-90s' },
  { id: 'endurance', icon: '💨', title: 'Resistência', desc: '15+ reps · Descanso 30-60s' },
  { id: 'general', icon: '⚖️', title: 'Geral', desc: '10-12 reps · Descanso 60-90s' },
];

// Cards de nível de experiência
const LEVELS = [
  { id: 'beginner', icon: '🌱', title: 'Iniciante', desc: 'Movimentos básicos, menos séries' },
  { id: 'intermediate', icon: '🌿', title: 'Intermediário', desc: 'Variedade moderada, progressão' },
  { id: 'advanced', icon: '🌳', title: 'Avançado', desc: 'Exercícios avançados, periodização' },
];

const ROUTINE_NAMES = {
  ppl: 'PPL · 6x/semana',
  ul: 'UL · 4x/semana',
  ppl_up: 'PPL+UP · 5x/semana',
  arnold: 'Arnold Split · 6x/semana',
};

export default function PreferencesScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { user } = state;
  // Inicializa com as preferências já salvas (se existirem)
  const [goal, setGoal] = useState(user?.preferences?.goal || '');
  const [level, setLevel] = useState(user?.preferences?.level || '');

  // Se o usuário já tem preferências definidas, pula esta tela
  // Isso acontece quando um usuário existente faz login em outro dispositivo
  useEffect(() => {
    if (user?.preferences?.goal && user?.preferences?.level) {
      navigation.replace('MainTabs');
    }
  }, []);

  const suggestedRoutine = goal && level ? suggestRoutine(goal, level) : null;

  // Salva preferências e navega para as abas principais
  async function handleStart() {
    if (!goal || !level) return;

    const routine = suggestRoutine(goal, level);
    const updatedUser = {
      ...user,
      name: user?.name || 'Usuário',
      preferences: { goal, level },
      routine,
      level: 1,
      xp: 0,
      streak: 0,
      lastWorkoutDate: null,
    };

    dispatch({ type: 'SET_USER', payload: updatedUser });
    await saveData('user', updatedUser);
    navigation.replace('MainTabs');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>⚙️ Suas Preferências</Text>

      <Text style={styles.sectionTitle}>Qual seu objetivo?</Text>
      {GOALS.map((g) => (
        <PreferenceCard
          key={g.id}
          icon={g.icon}
          title={g.title}
          description={g.desc}
          selected={goal === g.id}
          onPress={() => setGoal(g.id)}
        />
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Qual seu nível?</Text>
      <View style={styles.levelRow}>
        {LEVELS.map((l) => (
          <TouchableOpacity
            key={l.id}
            style={[styles.levelCard, level === l.id && styles.levelSelected]}
            onPress={() => setLevel(l.id)}
          >
            <Text style={styles.levelIcon}>{l.icon}</Text>
            <Text style={[styles.levelTitle, level === l.id && styles.levelTitleSelected]}>
              {l.title}
            </Text>
            <Text style={styles.levelDesc}>{l.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {suggestedRoutine && (
        <View style={styles.suggestion}>
          <Text style={styles.suggestionLabel}>Rotina sugerida:</Text>
          <Text style={styles.suggestionValue}>{ROUTINE_NAMES[suggestedRoutine]}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, (!goal || !level) && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!goal || !level}
      >
        <Text style={styles.buttonText}>Começar Treinos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, paddingBottom: 40 },
  header: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 24, textAlign: 'center' },
  sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  levelRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  levelCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelSelected: { borderColor: '#22c55e', backgroundColor: '#22c55e10' },
  levelIcon: { fontSize: 24, marginBottom: 6 },
  levelTitle: { color: '#f8fafc', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  levelTitleSelected: { color: '#22c55e' },
  levelDesc: { color: '#6b7280', fontSize: 10, textAlign: 'center', lineHeight: 13 },
  suggestion: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22c55e40',
  },
  suggestionLabel: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
  suggestionValue: { color: '#22c55e', fontSize: 18, fontWeight: '700' },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
});
