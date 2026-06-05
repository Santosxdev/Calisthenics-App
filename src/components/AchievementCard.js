// components/AchievementCard.js
// Card de achievement na tela de progresso.
// Se desbloqueado: colorido com ícone e data; se bloqueado: cinza com cadeado

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AchievementCard({ achievement }) {
  const locked = !achievement.unlocked;

  return (
    <View style={[styles.card, locked && styles.locked]}>
      <Text style={styles.icon}>{achievement.icon}</Text>
      <Text style={[styles.name, locked && styles.lockedText]} numberOfLines={2}>
        {achievement.name}
      </Text>
      {locked && <Text style={styles.lockIcon}>🔒</Text>}
      {achievement.unlocked && achievement.unlockedAt && (
        <Text style={styles.date}>
          {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#22c55e40',
  },
  locked: { borderColor: '#374151', opacity: 0.6 },
  icon: { fontSize: 28, marginBottom: 6 },
  name: { color: '#f8fafc', fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },
  lockedText: { color: '#6b7280' },
  lockIcon: { fontSize: 14, marginTop: 4 },
  date: { color: '#6b7280', fontSize: 10, marginTop: 4 },
});
