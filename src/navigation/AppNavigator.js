// navigation/AppNavigator.js
// Configuração de navegação do app:
// - NativeStack para Login → Preferences → MainTabs
// - BottomTab para Home, Treino, Progresso, Perfil
// Ícones emoji para as abas (sem dependências de icon library)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import PreferencesScreen from '../screens/PreferencesScreen';
import HomeScreen from '../screens/HomeScreen';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ícones das abas: versão ativa e inativa (mesmo emoji, sem dependência extra)
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
    <Text style={{ fontSize: 22 }}>
      {focused ? icons.active : icons.inactive}
    </Text>
  );
}

// Bottom Tab Navigator com as 4 abas principais
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

// Stack Navigator principal: Login → Preferences → MainTabs
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
