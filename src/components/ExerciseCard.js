// components/ExerciseCard.js
// Card de exercício na lista do treino ativo. Mostra nome, grupo muscular,
// e progresso de sets (concluídos / total). Tap expande para log de séries.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ExerciseCard({ exercise, sets, onPress }) {
  const totalSets = exercise.sets || 3;
  const doneSets = (sets || []).filter((s) => s.completed).length;
  const isComplete = doneSets >= totalSets;

  return (
    <TouchableOpacity style={[styles.card, isComplete && styles.completed]} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.icon}>{isComplete ? '✅' : '☐'}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.group}>{exercise.muscleGroup}</Text>
        </View>
        <Text style={styles.sets}>{doneSets}/{totalSets} sets</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  completed: { opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 20, marginRight: 12 },
  info: { flex: 1 },
  name: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  group: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  sets: { color: '#22c55e', fontSize: 14, fontWeight: '500' },
});
