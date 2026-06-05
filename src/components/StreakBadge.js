// components/StreakBadge.js
// Exibe o streak de dias consecutivos de treino com ícone de fogo

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StreakBadge({ streak }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>🔥</Text>
      <Text style={styles.count}>{streak}</Text>
      <Text style={styles.label}>dias</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon: { fontSize: 18 },
  count: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  label: { color: '#6b7280', fontSize: 13 },
});
