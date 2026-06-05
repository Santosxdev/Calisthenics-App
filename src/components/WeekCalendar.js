// components/WeekCalendar.js
// Calendário semanal da rotina. Exibe os 7 dias da semana com:
// - Indicador de treino (✅) ou descanso (🟢)
// - Dia atual destacado com borda verde

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WeekCalendar({ routine, currentDayIndex }) {
  if (!routine) return null;
  const todayIdx = currentDayIndex !== undefined ? currentDayIndex : new Date().getDay();

  return (
    <View style={styles.container}>
      {routine.weekSchedule.map((day, idx) => {
        const isToday = idx === todayIdx;
        return (
          <View
            key={idx}
            style={[styles.day, isToday && styles.today, day.isRestDay && styles.rest]}
          >
            <Text style={[styles.dayName, isToday && styles.todayText]}>
              {day.name.slice(0, 3)}
            </Text>
            <Text style={styles.indicator}>
              {day.isRestDay ? '🟢' : '✅'}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  day: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 8,
    width: '13%',
  },
  today: { borderWidth: 2, borderColor: '#22c55e' },
  rest: { opacity: 0.6 },
  dayName: { color: '#6b7280', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  todayText: { color: '#22c55e' },
  indicator: { fontSize: 16 },
});
