// screens/RegisterScreen.js
// Tela de criação de conta com email, senha e nome.
//
// FLUXO:
// 1. Usuário preenche nome, email, senha e confirmação
// 2. Validações locais (nome ≥ 2 chars, senha ≥ 6 chars, confirmação igual)
// 3. Chama authService.register() → createUserWithEmailAndPassword + updateProfile
// 4. onAuthStateChanged dispara no AppContext
// 5. AppContext cria dados padrão (preferências vazias → vai para PreferencesScreen)
// 6. AppNavigator troca de AuthStack para AppStack (mostra PreferencesScreen)
//
// DIFERENÇA IMPORTANTE:
// O register() NÃO cria documento no Firestore — o AppContext faz isso
// durante o merge de dados. Isso elimina race conditions entre a criação
// do documento e o listener de autenticação.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { register } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Valida todos os campos e tenta criar conta no Firebase Auth
  async function handleRegister() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setError('Nome deve ter ao menos 2 caracteres');
      return;
    }
    if (!trimmedEmail) {
      setError('Informe um email');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter ao menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Senhas não conferem');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(trimmedEmail, password, trimmedName);
      // Navegação é gerenciada automaticamente pelo AppNavigator via authState
    } catch (e) {
      // Mapeia códigos de erro do Firebase para mensagens em português
      const msg =
        e.code === 'auth/email-already-in-use' ? 'Email já cadastrado' :
        e.code === 'auth/invalid-email' ? 'Email inválido' :
        e.code === 'auth/weak-password' ? 'Senha muito fraca' :
        'Erro ao criar conta';
      setError(msg);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🏋️</Text>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Comece a registrar seus treinos</Text>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#6b7280"
              value={name}
              onChangeText={(t) => { setName(t); setError(''); }}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#6b7280"
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setError(''); }}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { color: '#22c55e', fontSize: 28, fontWeight: '800', letterSpacing: 2 },
  subtitle: { color: '#6b7280', fontSize: 14, marginBottom: 32 },
  inputBox: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: { color: '#f8fafc', fontSize: 16, paddingVertical: 14 },
  error: { color: '#ef4444', fontSize: 13, marginBottom: 8, textAlign: 'center' },
  button: {
    width: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
  linkBtn: { marginTop: 20 },
  linkText: { color: '#22c55e', fontSize: 14, fontWeight: '600' },
});
