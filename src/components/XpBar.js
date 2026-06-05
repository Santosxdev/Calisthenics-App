// components/XpBar.js
// Barra de progresso de XP com nível atual e progresso para o próximo nível

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function XpBar({ currentXp, maxXp, level }) {
  const pct = Math.min((currentXp / maxXp) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>Nível {level}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.xpText}>
        {currentXp}/{maxXp} XP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 4 },
  levelText: { color: '#f8fafc', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  barBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: 8, backgroundColor: '#22c55e', borderRadius: 4 },
  xpText: { color: '#6b7280', fontSize: 11, marginTop: 3 },
});
