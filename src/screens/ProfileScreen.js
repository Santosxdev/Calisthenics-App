// screens/ProfileScreen.js
// Tela de perfil e configurações do usuário autenticado.
//
// FUNCIONALIDADES:
// - Exibir nome, email (do Firebase Auth) e nível
// - Alterar nome (dispatch UPDATE_USER → sync automático)
// - Ver preferências atuais (objetivo + nível) — somente leitura
// - Trocar de rotina (modal com RoutineSelector)
// - Ver agenda semanal (WeekCalendar)
// - Reconfigurar preferências (volta para PreferencesScreen)
// - Sair (limpa AsyncStorage + Firebase Auth signOut)
// - Resetar dados (limpa AsyncStorage + Firestore + signOut)
//
// NOTA SOBRE "SAIR" vs "RESETAR":
// - Sair: mantém os dados no Firestore, apenas desloga
// - Resetar: deleta o documento do Firestore e desloga
// Ambos limpam o AsyncStorage local.

import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { logout } from '../services/authService';
import { deleteUserData } from '../services/firestoreService';
import RoutineSelector from '../components/RoutineSelector';
import WeekCalendar from '../components/WeekCalendar';
import { getRoutineById } from '../data/routines';
import { calculateLevel } from '../utils/xpCalculator';
import { resetAll } from '../services/storage';

const GOAL_MAP = {
  strength: 'Força',
  hypertrophy: 'Hipertrofia',
  endurance: 'Resistência',
  general: 'Geral',
};

const LEVEL_MAP = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

export default function ProfileScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { user, sessions, authUser } = state;

  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showNameModal, setNameModal] = useState(false);
  const [newName, setNewName] = useState('');

  if (!user) return null;

  const { level } = calculateLevel(user.xp);
  const routine = getRoutineById(user.routine);

  // Memoiza lista de rotinas para evitar recálculo no render
  const routines = useMemo(() => (
    ['ppl', 'ul', 'ppl_up', 'arnold']
      .map(getRoutineById)
      .filter(Boolean)
  ), []);

  function handleChangeRoutine(newId) {
    dispatch({ type: 'UPDATE_USER', payload: { routine: newId } });
    setShowRoutineModal(false);
  }

  // Sair: limpa apenas o AsyncStorage e desloga.
  // Dados no Firestore permanecem para próximo login.
  async function handleLogout() {
    await resetAll();
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_SESSIONS', payload: [] });
    dispatch({ type: 'SET_ACHIEVEMENTS', payload: [] });
    await logout();
  }

  // Resetar: apaga AsyncStorage + Firestore + desloga.
  // Equivalente a "deletar conta".
  async function handleReset() {
    await resetAll();
    if (authUser?.uid) {
      await deleteUserData(authUser.uid).catch(() => {});
    }
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_SESSIONS', payload: [] });
    dispatch({ type: 'SET_ACHIEVEMENTS', payload: [] });
    await logout();
  }

  function handleChangeName() {
    if (newName.trim().length < 2) return;
    dispatch({ type: 'UPDATE_USER', payload: { name: newName.trim() } });
    setNameModal(false);
  }

  // Volta para PreferencesScreen (dentro do AppStack)
  function handleRedoPreferences() {
    navigation.navigate('Preferences');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>⚙️ Perfil</Text>

      {/* Card do usuário com nome, email e nível */}
      <View style={styles.userCard}>
        <TouchableOpacity onPress={() => { setNewName(user.name); setNameModal(true); }}>
          <Text style={styles.userEmoji}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.userName}>{user.name}</Text>
        {authUser?.email ? (
          <Text style={styles.emailText}>{authUser.email}</Text>
        ) : null}
        <Text style={styles.userMeta}>
          Lv.{level} · {sessions.length} treinos
        </Text>
      </View>

      {/* Preferências atuais (somente leitura) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.prefCard}>
          <Text style={styles.prefText}>
            Objetivo: {GOAL_MAP[user.preferences?.goal] || 'Não definido'}
          </Text>
          <Text style={styles.prefText}>
            Nível: {LEVEL_MAP[user.preferences?.level] || 'Não definido'}
          </Text>
          <TouchableOpacity style={styles.actionBtnSmall} onPress={handleRedoPreferences}>
            <Text style={styles.actionBtnSmallText}>Redefinir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rotina atual */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rotina Atual</Text>
        <View style={styles.routineCard}>
          {routine && (
            <>
              <Text style={styles.routineName}>{routine.name}</Text>
              <Text style={styles.routineFreq}>{routine.frequency}</Text>
            </>
          )}
          <TouchableOpacity
            style={styles.actionBtnSmall}
            onPress={() => setShowRoutineModal(true)}
          >
            <Text style={styles.actionBtnSmallText}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Agenda semanal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agenda Semanal</Text>
        {routine && <WeekCalendar routine={routine} />}
      </View>

      {/* Ações: trocar rotina, redefinir preferências, sair, resetar dados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowRoutineModal(true)}
        >
          <Text style={styles.actionBtnText}>Trocar Rotina</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleRedoPreferences}>
          <Text style={styles.actionBtnText}>Redefinir Preferências</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleLogout}
        >
          <Text style={styles.actionBtnText}>Sair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.dangerBtn]}
          onPress={() => setShowResetModal(true)}
        >
          <Text style={[styles.actionBtnText, styles.dangerText]}>Resetar Dados</Text>
        </TouchableOpacity>
      </View>

      {/* Modal: trocar rotina */}
      <Modal visible={showRoutineModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Trocar Rotina</Text>
            <RoutineSelector
              routines={routines}
              selectedId={user.routine}
              onSelect={handleChangeRoutine}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowRoutineModal(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: confirmar reset */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalEmoji}>⚠️</Text>
            <Text style={styles.modalTitle}>Tem certeza?</Text>
            <Text style={styles.modalDesc}>Todo progresso será perdido.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleReset}>
                <Text style={styles.modalConfirmText}>Resetar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: alterar nome */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Alterar Nome</Text>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Seu nome"
              placeholderTextColor="#6b7280"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setNameModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleChangeName}>
                <Text style={styles.modalConfirmText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingBottom: 40 },
  header: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  userCard: { alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, padding: 24, marginBottom: 20 },
  userEmoji: { fontSize: 48, marginBottom: 8 },
  userName: { color: '#f8fafc', fontSize: 22, fontWeight: '700' },
  emailText: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  userMeta: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  prefCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16 },
  prefText: { color: '#f8fafc', fontSize: 14, marginBottom: 4 },
  routineCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routineName: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
  routineFreq: { color: '#6b7280', fontSize: 13 },
  actionBtnSmall: { backgroundColor: '#374151', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, marginTop: 8, alignSelf: 'flex-start' },
  actionBtnSmallText: { color: '#f8fafc', fontSize: 13, fontWeight: '600' },
  actionBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  actionBtnText: { color: '#f8fafc', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  dangerBtn: { borderColor: '#ef444440' },
  dangerText: { color: '#ef4444' },
  modalOverlay: { flex: 1, backgroundColor: '#00000080', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#1e293b', borderRadius: 20, padding: 24 },
  modalTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  modalEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 12 },
  modalDesc: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, backgroundColor: '#374151', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalCancelText: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
  modalConfirm: { flex: 1, backgroundColor: '#ef4444', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalConfirmText: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  modalClose: { backgroundColor: '#374151', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  modalCloseText: { color: '#f8fafc', fontSize: 14, fontWeight: '600' },
  nameInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    color: '#f8fafc',
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});
