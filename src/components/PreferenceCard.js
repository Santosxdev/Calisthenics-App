// components/PreferenceCard.js
// Card selecionável usado nas telas de preferências (objetivo e nível).
// Quando selecionado: borda verde + destaque no título + ícone de check.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PreferenceCard({ icon, title, description, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.info}>
        <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
      {selected && <Text style={styles.check}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: '#22c55e', backgroundColor: '#22c55e10' },
  icon: { fontSize: 24, marginRight: 12 },
  info: { flex: 1 },
  title: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },
  titleSelected: { color: '#22c55e' },
  desc: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  check: { color: '#22c55e', fontSize: 18, fontWeight: '700' },
});
