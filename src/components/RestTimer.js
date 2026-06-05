// components/RestTimer.js
// Timer de descanso entre séries com base científica.
// Duração padrão definida pelo objetivo do usuário:
// Força=180s, Hipertrofia=90s, Resistência=60s, Geral=90s
// Presets ajustáveis: 30s, 60s, 90s, 120s, 180s, 300s

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PRESETS = [30, 60, 90, 120, 180, 300];

export default function RestTimer({ defaultDuration, onComplete }) {
  const [duration, setDuration] = useState(defaultDuration || 90);
  const [remaining, setRemaining] = useState(duration);
  const [active, setActive] = useState(false);
  const intervalRef = useRef(null);

  // Limpa o intervalo ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Inicia o timer regressivo
  function start() {
    setRemaining(duration);
    setActive(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setActive(false);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Pula o descanso
  function skip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(false);
    setRemaining(0);
    if (onComplete) onComplete();
  }

  // Altera o preset (só quando o timer não está rodando)
  function changePreset(sec) {
    setDuration(sec);
    if (!active) setRemaining(sec);
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <View style={styles.container}>
      <View style={styles.timerRow}>
        <Text style={styles.label}>⏱️ DESCANSO</Text>
        <Text style={styles.time}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
      </View>

      {/* Presets disponíveis — filtrados para mostrar apenas opções relevantes ao objetivo */}
      {!active && (
        <View style={styles.presets}>
          {PRESETS.filter((p) => p >= defaultDuration - 30).map((p) => {
            const label = p >= 120 ? `${p / 60}min` : `${p}s`;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.presetBtn, duration === p && styles.presetActive]}
                onPress={() => changePreset(p)}
              >
                <Text style={[styles.presetText, duration === p && styles.presetTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.actions}>
        {!active ? (
          <TouchableOpacity style={styles.startBtn} onPress={start}>
            <Text style={styles.btnText}>▶ Iniciar Descanso</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.skipBtn} onPress={skip}>
            <Text style={styles.btnText}>⏩ Pular</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  timerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { color: '#22c55e', fontSize: 14, fontWeight: '700' },
  time: { color: '#f8fafc', fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'] },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  presetBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  presetActive: { borderColor: '#22c55e', backgroundColor: '#22c55e20' },
  presetText: { color: '#6b7280', fontSize: 13, fontWeight: '600' },
  presetTextActive: { color: '#22c55e' },
  actions: { flexDirection: 'row', justifyContent: 'center' },
  startBtn: { backgroundColor: '#22c55e', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  skipBtn: { backgroundColor: '#374151', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  btnText: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
});
