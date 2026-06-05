// screens/ProgressScreen.js
// Tela de progresso e conquistas. Exibe:
// - Nível atual com barra de XP
// - Grade de achievements (conquistados e bloqueados)
// - Calendário de streak dos últimos 30 dias
// - Estatísticas acumuladas (treinos, flexões, barras, agachamentos)

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import AchievementCard from '../components/AchievementCard';
import XpBar from '../components/XpBar';
import { calculateLevel } from '../utils/xpCalculator';

export default function ProgressScreen() {
  const { state } = useApp();
  const { user, sessions, achievements } = state;

  if (!user) return null;

  const { level, currentXp, maxXp } = calculateLevel(user.xp);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const totalWorkouts = sessions.length;

  // Agrega total de reps por exercício
  const totals = {};
  sessions.forEach((session) => {
    (session.exercises || []).forEach((ex) => {
      (ex.sets || []).forEach((set) => {
        const id = ex.exerciseId;
        totals[id] = (totals[id] || 0) + (set.reps || 0);
      });
    });
  });

  const totalPushUps = (totals['push_std'] || 0) + (totals['push_wide'] || 0);
  const totalPullUps = totals['pull_bar'] || 0;
  const totalSquats = (totals['legs_squat'] || 0) + (totals['legs_squat_jump'] || 0);

  // Gera array com os últimos 30 dias para o calendário de streak
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const sessionDates = new Set(sessions.map((s) => s.date));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>🏆 Progresso</Text>

      <View style={styles.levelCard}>
        <Text style={styles.levelEmoji}>⭐</Text>
        <Text style={styles.levelValue}>Lv.{level}</Text>
        <XpBar currentXp={currentXp} maxXp={maxXp} level={level} />
      </View>

      <Text style={styles.sectionTitle}>
        Conquistas ({unlockedCount}/{totalCount})
      </Text>
      <View style={styles.achievementGrid}>
        {achievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>🔥 Streak</Text>
      <Text style={styles.streakText}>{user.streak || 0} dias consecutivos</Text>
      <View style={styles.calendar}>
        {last30Days.map((date, idx) => (
          <View
            key={idx}
            style={[
              styles.calendarDay,
              sessionDates.has(date) && styles.calendarActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
      <View style={styles.statsCard}>
        <StatRow label="Total de treinos" value={totalWorkouts} />
        <StatRow label="Total flexões" value={totalPushUps} />
        <StatRow label="Total barras" value={totalPullUps} />
        <StatRow label="Total agachamentos" value={totalSquats} />
        <StatRow
          label="Média reps/semana"
          value={totalWorkouts > 0
            ? Math.round((totalPushUps + totalPullUps + totalSquats) / Math.max(Math.ceil(totalWorkouts / 7), 1))
            : 0}
        />
      </View>
    </ScrollView>
  );
}

// Subcomponente para linha de estatística (label + valor)
function StatRow({ label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingBottom: 40 },
  header: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  levelCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  levelEmoji: { fontSize: 36, marginBottom: 8 },
  levelValue: { color: '#22c55e', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  streakText: { color: '#f8fafc', fontSize: 14, marginBottom: 10 },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 16 },
  calendarDay: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#374151' },
  calendarActive: { backgroundColor: '#22c55e' },
  statsCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  statLabel: { color: '#6b7280', fontSize: 14 },
  statValue: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
});
