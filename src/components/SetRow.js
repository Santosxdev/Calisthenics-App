import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SetRow({ setIndex, reps, completed, onRepsChange, onToggle }) {
  return (
    <View style={[styles.row, completed && styles.completed]}>
      <Text style={styles.setLabel}>Série {setIndex + 1}</Text>
      <TextInput
        style={styles.input}
        value={String(reps || '')}
        onChangeText={onRepsChange}
        keyboardType="number-pad"
        placeholder="reps"
        placeholderTextColor="#6b7280"
        editable={!completed}
      />
      <TouchableOpacity
        style={[styles.checkBtn, completed && styles.checkBtnDone]}
        onPress={onToggle}
      >
        <Text style={styles.checkText}>{completed ? '✓' : '☐'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    gap: 8,
  },
  completed: { opacity: 0.6 },
  setLabel: { color: '#6b7280', fontSize: 13, fontWeight: '600', width: 50 },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtnDone: { backgroundColor: '#22c55e' },
  checkText: { color: '#f8fafc', fontSize: 18, fontWeight: '700' },
});
