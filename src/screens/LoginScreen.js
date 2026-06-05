// screens/LoginScreen.js
// Primeira tela do app. Usuário insere o nome para entrar.
// Se já existir no AsyncStorage, vai direto para Home.
// Se for novo usuário, redireciona para as preferências.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { loadData } from '../services/storage';

export default function LoginScreen({ navigation }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Nome deve ter ao menos 2 caracteres');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const existing = await loadData('user');

      if (existing) {
        // Usuário existente: vai direto para Home
        dispatch({ type: 'SET_USER', payload: existing });
        navigation.replace('MainTabs');
      } else {
        // Novo usuário: cria registro básico e vai para preferências
        const newUser = {
          name: trimmed,
          preferences: { goal: '', level: '' },
          level: 1,
          xp: 0,
          streak: 0,
          lastWorkoutDate: null,
          routine: 'ppl',
        };
        dispatch({ type: 'SET_USER', payload: newUser });
        navigation.replace('Preferences');
      }
    } catch {
      setError('Erro ao acessar dados');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🏋️</Text>
        <Text style={styles.title}>WORKOUT LOG</Text>
        <Text style={styles.subtitle}>Calistenia Gamificada</Text>

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={(t) => { setName(t); setError(''); }}
            autoCapitalize="words"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (!name.trim() || loading) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!name.trim() || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Digite seu nome para continuar</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { color: '#22c55e', fontSize: 28, fontWeight: '800', letterSpacing: 2 },
  subtitle: { color: '#6b7280', fontSize: 14, marginBottom: 40 },
  inputBox: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: { color: '#f8fafc', fontSize: 18, paddingVertical: 14, textAlign: 'center' },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 8 },
  button: {
    width: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  hint: { color: '#6b7280', fontSize: 12, marginTop: 20 },
});
