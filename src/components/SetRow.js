// components/RoutineSelector.js
// Seletor de rotinas com cards verticais mostrando nome, descrição e frequência
// Usado no onboarding e no perfil (trocar rotina)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RoutineSelector({ routines, selectedId, onSelect }) {
  return (
    <View style={styles.container}>
      {routines.map((r) => {
        const selected = r.id === selectedId;
        return (
          <TouchableOpacity
            key={r.id}
            style={[styles.card, selected && styles.selected]}
            onPress={() => onSelect(r.id)}
            activeOpacity={0.7}
          >
            <View style={styles.row}>
              <Text style={[styles.name, selected && styles.nameSelected]}>{r.name}</Text>
              <Text style={styles.freq}>{r.frequency}</Text>
            </View>
            <Text style={styles.desc}>{r.description}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: '#22c55e', backgroundColor: '#22c55e10' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  nameSelected: { color: '#22c55e' },
  freq: { color: '#22c55e', fontSize: 13, fontWeight: '500' },
  desc: { color: '#6b7280', fontSize: 13, marginTop: 4 },
});
