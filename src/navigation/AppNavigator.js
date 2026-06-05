// navigation/AppNavigator.js
// Configuração de navegação com controle de autenticação.
//
// ESTRUTURA:
// - authState === 'loading' → SplashScreen (tela de carregamento)
// - authState === 'unauthenticated' → AuthStack (Login / Register)
// - authState === 'authenticated' → AppStack (Preferences → MainTabs)
//
// AuthStack e AppStack são grupos de telas mutuamente exclusivos:
// renderizados condicionalmente dentro do NavigationContainer.
// Quando o authState muda, o React Navigation troca automaticamente
// o conjunto de telas disponíveis.

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text as TabText } from 'react-native';
import { useApp } from '../context/AppContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import HomeScreen from '../screens/HomeScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Mapa de ícones para cada aba (emoji, sem dependência externa)
const TAB_ICONS = {
  Home: { active: '🏠', inactive: '🏡' },
  Treino: { active: '💪', inactive: '💪' },
  Progresso: { active: '🏆', inactive: '🏆' },
  Perfil: { active: '⚙️', inactive: '⚙️' },
};

function TabIcon({ routeName, focused }) {
  const icons = TAB_ICONS[routeName];
  if (!icons) return null;
  return (
    <TabText style={{ fontSize: 22 }}>
      {focused ? icons.active : icons.inactive}
    </TabText>
  );
}

// Bottom Tab Navigator com as 4 abas principais do app logado
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#0f172a',
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Treino" component={ActiveWorkoutScreen} options={{ tabBarLabel: 'Treino' }} />
      <Tab.Screen name="Progresso" component={ProgressScreen} options={{ tabBarLabel: 'Progresso' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

// Tela de splash exibida enquanto o Firebase Auth verifica a sessão
function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Text style={styles.splashEmoji}>🏋️</Text>
      <Text style={styles.splashTitle}>WORKOUT LOG</Text>
      <ActivityIndicator size="large" color="#22c55e" style={{ marginTop: 24 }} />
    </View>
  );
}

// Grupo de telas para usuários NÃO autenticados
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Grupo de telas para usuários autenticados
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

// Componente raiz de navegação.
// Lê authState do AppContext e renderiza o conjunto correto de telas.
// Se authState ainda é 'loading', mostra SplashScreen fora do NavigationContainer.
export default function AppNavigator() {
  const { state } = useApp();
  const { authState } = state;

  if (authState === 'loading') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {authState === 'unauthenticated' ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashEmoji: { fontSize: 64, marginBottom: 16 },
  splashTitle: { color: '#22c55e', fontSize: 28, fontWeight: '800', letterSpacing: 2 },
});
