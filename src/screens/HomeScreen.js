// screens/HomeScreen.js
// Dashboard principal. Exibe:
// - Saudação + nível + streak
// - Barra de XP
// - Card do treino de hoje (ou descanso)
// - Calendário semanal
// - Resumo de treinos da semana

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import StreakBadge from '../components/StreakBadge';
import XpBar from '../components/XpBar';
import WeekCalendar from '../components/WeekCalendar';
import { calculateLevel } from '../utils/xpCalculator';
import { getRoutineById } from '../data/routines';

export default function HomeScreen({ navigation }) {
  const { state, todayWorkout } = useApp();
  const { user, sessions } = state;

  if (!user) return null;

  const { level, currentXp, maxXp } = calculateLevel(user.xp);
  const routine = getRoutineById(user.routine);

  // Filtra sessões da semana atual (de segunda até hoje)
  const weekSessions = sessions.filter((s) => {
    const sDate = new Date(s.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    return sDate >= startOfWeek;
  });

  const workoutCount = weekSessions.length;
  const totalWeekDays = routine ? routine.weekSchedule.filter((d) => !d.isRestDay).length : 0;
  const exerciseCount = todayWorkout?.exercises?.length || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user.name}</Text>
          <Text style={styles.level}>Lv.{level}</Text>
        </View>
        <StreakBadge streak={user.streak || 0} />
      </View>

      <XpBar currentXp={currentXp} maxXp={maxXp} level={level} />

      <View style={styles.todayCard}>
        <Text style={styles.todayLabel}>📅 HOJE</Text>
        {todayWorkout && !todayWorkout.isRestDay ? (
          <>
            <Text style={styles.workoutName}>{todayWorkout.workoutName}</Text>
            <Text style={styles.exerciseCount}>{exerciseCount} exercícios</Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Treino')}
            >
              <Text style={styles.startButtonText}>Iniciar Treino</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.restText}>🟢 Dia de Descanso</Text>
            <Text style={styles.restSuggestion}>
              Aproveite para alongar ou fazer mobilidade
            </Text>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>📊 SEMANA</Text>
      {routine && <WeekCalendar routine={routine} />}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>📈 Resumo</Text>
        <Text style={styles.summaryText}>
          Treinos: {workoutCount}/{totalWeekDays} essa semana
        </Text>
        <Text style={styles.summaryText}>
          Total de treinos: {sessions.length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  greeting: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
  level: { color: '#22c55e', fontSize: 14, fontWeight: '600', marginTop: 2 },
  todayCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  todayLabel: { color: '#6b7280', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  workoutName: { color: '#f8fafc', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  exerciseCount: { color: '#6b7280', fontSize: 14, marginBottom: 16 },
  startButton: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startButtonText: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  restText: { color: '#22c55e', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  restSuggestion: { color: '#6b7280', fontSize: 13 },
  sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  summary: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  summaryTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '600', marginBottom: 8 },
  summaryText: { color: '#6b7280', fontSize: 13, marginBottom: 4 },
});
