// screens/LoginScreen.js
// Tela de login com email e senha via Firebase Auth.
// Ao logar com sucesso, o AppContext reage ao onAuthStateChanged e
// o AppNavigator troca automaticamente para AppStack.
//
// FLUXO:
// 1. Usuário digita email + senha
// 2. Chama authService.login()
// 3. Firebase Auth valida as credenciais
// 4. onAuthStateChanged dispara no AppContext
// 5. AppContext carrega dados e marca authState = 'authenticated'
// 6. AppNavigator troca de AuthStack para AppStack

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { login } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Valida campos e tenta login no Firebase Auth
  async function handleLogin() {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Preencha email e senha');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(trimmedEmail, password);
      // Navegação é gerenciada automaticamente pelo AppNavigator via authState
    } catch (e) {
      // Mapeia códigos de erro do Firebase para mensagens em português
      const msg =
        e.code === 'auth/user-not-found' ? 'Usuário não encontrado' :
        e.code === 'auth/wrong-password' ? 'Senha incorreta' :
        e.code === 'auth/invalid-email' ? 'Email inválido' :
        e.code === 'auth/invalid-credential' ? 'Email ou senha inválidos' :
        e.code === 'auth/too-many-requests' ? 'Muitas tentativas. Tente novamente mais tarde' :
        'Erro ao fazer login';
      setError(msg);
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
            autoComplete="password"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Criar conta</Text>
        </TouchableOpacity>
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
