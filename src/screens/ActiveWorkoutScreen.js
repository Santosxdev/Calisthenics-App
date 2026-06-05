  // screens/ActiveWorkoutScreen.js
  // Tela principal de execução do treino.
  // Funcionalidades:
  // - Lista de exercícios do dia (expansível para log de séries)
  // - Log de séries com input de reps + checkbox
  // - Timer de descanso científico baseado no objetivo do usuário
  // - Barra de progresso
  // - Finalização do treino com cálculo de XP, streak e achievements

  import React, { useState, useEffect, useRef, useCallback } from 'react';
  import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
  import { useApp } from '../context/AppContext';
  import ExerciseCard from '../components/ExerciseCard';
  import SetRow from '../components/SetRow';
  import RestTimer from '../components/RestTimer';
  import { getExerciseById } from '../data/exercises';
  import { calculateWorkoutXp } from '../utils/xpCalculator';
  import { checkAchievements } from '../utils/achievementChecker';
  import { today } from '../utils/dateUtils';

  // Tempo de descanso (em segundos) baseado no objetivo científico
  const GOAL_REST = {
    strength: 180,
    hypertrophy: 90,
    endurance: 60,
    general: 90,
  };

  export default function ActiveWorkoutScreen() {
    const { state, dispatch, todayWorkout } = useApp();
    const { user, sessions, achievements } = state;

    const [expandedId, setExpandedId] = useState(null);
    const [setsData, setSetsData] = useState({});
    const [completedExercises, setCompletedExercises] = useState({});
    const [showRest, setShowRest] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [postData, setPostData] = useState({ xp: 0, streak: 0, newAchievements: [] });
    const startTimeRef = useRef(Date.now());

    const defaultRest = GOAL_REST[user?.preferences?.goal] || 90;

    // Inicializa sets ao entrar no treino (ou quando o dia muda)
    useEffect(() => {
      if (!todayWorkout || todayWorkout.isRestDay) return;
      const initSets = {};
      (todayWorkout.exercises || []).forEach((exId) => {
        const ex = getExerciseById(exId);
        if (!ex) return;
        const targetSets = ex.sets || 3;
        initSets[exId] = Array.from({ length: targetSets }, () => ({ reps: 0, completed: false }));
      });
      setSetsData(initSets);
      setCompletedExercises({});
      startTimeRef.current = Date.now();
    }, [todayWorkout]);

    const getSetsForExercise = useCallback((exId) => setsData[exId] || [], [setsData]);

    // Verifica se todos os exercícios foram concluídos
    const allExercisesComplete = (() => {
      if (!todayWorkout || !todayWorkout.exercises) return false;
      return todayWorkout.exercises.every((exId) => completedExercises[exId]);
    })();

    // Calcula progresso geral
    const totalSets = Object.values(setsData).reduce((sum, sets) => sum + sets.length, 0);
    const completedSets = Object.values(setsData).reduce(
      (sum, sets) => sum + sets.filter((s) => s.completed).length, 0
    );
    const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

    // Alterna o estado de uma série (completa/incompleta)
    function handleToggleSet(exId, setIdx) {
      const updated = { ...setsData };
      const sets = [...updated[exId]];
      sets[setIdx] = { ...sets[setIdx], completed: !sets[setIdx].completed };
      updated[exId] = sets;
      setSetsData(updated);

      // Mostra timer de descanso quando a série é marcada como concluída
      if (sets[setIdx].completed) {
        setShowRest(true);
      }
    }

    // Atualiza o número de reps de uma série
    function handleRepsChange(exId, setIdx, val) {
      const updated = { ...setsData };
      const sets = [...updated[exId]];
      sets[setIdx] = { ...sets[setIdx], reps: parseInt(val) || 0 };
      updated[exId] = sets;
      setSetsData(updated);
    }

    // Marca um exercício como concluído
    function completeExercise(exId) {
      setCompletedExercises((prev) => ({ ...prev, [exId]: true }));
      setExpandedId(null);
    }

    // Finaliza o treino: calcula XP, atualiza streak, salva sessão, verifica achievements
    async function finishWorkout() {
      const duration = Math.round((Date.now() - startTimeRef.current) / 60000);
      const xpResult = calculateWorkoutXp(user.streak || 0);

      const session = {
        id: `${Date.now()}`,
        date: today(),
        routine: user.routine,
        dayIndex: new Date().getDay(),
        duration,
        exercises: Object.entries(setsData).map(([exId, sets]) => ({
          exerciseId: exId,
          sets: sets.map((s) => ({ reps: s.reps })),
        })),
        totalXp: xpResult.total,
      };

      // Atualiza streak (sempre incrementa — se o usuário treinou, streak aumenta)
      const newStreak = (user.streak || 0) + 1;
      const newXp = (user.xp || 0) + xpResult.total;

      const updatedUser = {
        ...user,
        xp: newXp,
        streak: newStreak,
        lastWorkoutDate: today(),
      };

      const newSessions = [...sessions, session];
      const updatedAchievements = checkAchievements(achievements, newSessions, updatedUser);
      const newAchs = updatedAchievements.filter(
        (a, i) => a.unlocked && !achievements[i]?.unlocked
      );

      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      dispatch({ type: 'ADD_SESSION', payload: session });
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: updatedAchievements });

      setPostData({ xp: xpResult.total, streak: newStreak, newAchievements: newAchs });
      setShowPostModal(true);
    }

    // Dia de descanso: não mostra o treino
    if (!todayWorkout || todayWorkout.isRestDay) {
      return (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.restBig}>🟢</Text>
          <Text style={styles.restTitle}>Hoje é dia de descanso!</Text>
          <Text style={styles.restDesc}>Aproveite para recuperar 🌱</Text>
        </View>
      );
    }

    const workoutName = todayWorkout.workoutName || 'Treino';

    return (
      <View style={styles.container}>
        {/* Header com nome do treino e timer */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{workoutName}</Text>
          <Text style={styles.headerTimer}>
            ⏱ {Math.round((Date.now() - startTimeRef.current) / 60000)}m
          </Text>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% concluído</Text>

        {/* Lista de exercícios */}
        <ScrollView style={styles.exerciseList}>
          {(todayWorkout.exercises || []).map((exId) => {
            const ex = getExerciseById(exId);
            if (!ex) return null;
            const sets = getSetsForExercise(exId);
            const isExpanded = expandedId === exId;

            return (
              <View key={exId}>
                <ExerciseCard
                  exercise={{ ...ex, sets: ex.sets || 3 }}
                  sets={sets}
                  onPress={() => setExpandedId(isExpanded ? null : exId)}
                />

                {/* Área expandida: log de séries + timer */}
                {isExpanded && (
                  <View style={styles.expanded}>
                    <TouchableOpacity
                      style={styles.backBtn}
                      onPress={() => setExpandedId(null)}
                    >
                      <Text style={styles.backBtnText}>← {ex.name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.muscleGroup}>{ex.muscleGroup}</Text>

                    {sets.map((set, idx) => (
                      <SetRow
                        key={idx}
                        setIndex={idx}
                        reps={set.reps}
                        completed={set.completed}
                        onRepsChange={(val) => handleRepsChange(exId, idx, val)}
                        onToggle={() => handleToggleSet(exId, idx)}
                      />
                    ))}

                    {showRest && (
                      <RestTimer
                        defaultDuration={defaultRest}
                        onComplete={() => setShowRest(false)}
                      />
                    )}

                    {sets.length > 0 && sets.every((s) => s.completed) && (
                      <TouchableOpacity
                        style={styles.completeExBtn}
                        onPress={() => completeExercise(exId)}
                      >
                        <Text style={styles.completeExText}>Concluir Exercício</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Botão de finalizar (só aparece quando tudo concluído) */}
        {allExercisesComplete && (
          <View style={styles.finishArea}>
            <TouchableOpacity style={styles.finishBtn} onPress={finishWorkout}>
              <Text style={styles.finishBtnText}>Finalizar Treino</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal pós-treino */}
        <Modal visible={showPostModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalEmoji}>🎉</Text>
              <Text style={styles.modalTitle}>Treino Completo!</Text>
              <Text style={styles.modalXp}>+{postData.xp} XP</Text>
              <Text style={styles.modalStreak}>🔥 Streak: {postData.streak} dias</Text>

              {postData.newAchievements.map((ach) => (
                <View key={ach.id} style={styles.newAch}>
                  <Text style={styles.newAchIcon}>{ach.icon}</Text>
                  <Text style={styles.newAchName}>🏆 {ach.name}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setShowPostModal(false);
                  setExpandedId(null);
                }}
              >
                <Text style={styles.modalBtnText}>Voltar ao Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    center: { justifyContent: 'center', alignItems: 'center', padding: 32 },
    restBig: { fontSize: 48, marginBottom: 16 },
    restTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '700', marginBottom: 8 },
    restDesc: { color: '#6b7280', fontSize: 14 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 8 },
    headerTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '700' },
    headerTimer: { color: '#22c55e', fontSize: 16, fontWeight: '600' },
    progressBar: { height: 6, backgroundColor: '#374151', marginHorizontal: 20, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: 6, backgroundColor: '#22c55e', borderRadius: 3 },
    progressText: { color: '#6b7280', fontSize: 12, textAlign: 'right', marginRight: 20, marginTop: 4 },
    exerciseList: { flex: 1, paddingHorizontal: 20, marginTop: 12 },
    expanded: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10, marginTop: -8 },
    backBtn: { marginBottom: 8 },
    backBtnText: { color: '#22c55e', fontSize: 16, fontWeight: '600' },
    muscleGroup: { color: '#6b7280', fontSize: 13, marginBottom: 12 },
    completeExBtn: {
      backgroundColor: '#22c55e',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 8,
    },
    completeExText: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
    finishArea: { padding: 20, borderTopWidth: 1, borderTopColor: '#1e293b' },
    finishBtn: { backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    finishBtnText: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: '#00000080', justifyContent: 'center', alignItems: 'center', padding: 32 },
    modal: {
      backgroundColor: '#1e293b',
      borderRadius: 20,
      padding: 32,
      alignItems: 'center',
      width: '100%',
    },
    modalEmoji: { fontSize: 64, marginBottom: 12 },
    modalTitle: { color: '#22c55e', fontSize: 22, fontWeight: '800', marginBottom: 16 },
    modalXp: { color: '#f8fafc', fontSize: 28, fontWeight: '700', marginBottom: 4 },
    modalStreak: { color: '#f8fafc', fontSize: 16, marginBottom: 16 },
    newAch: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    newAchIcon: { fontSize: 20, marginRight: 8 },
    newAchName: { color: '#fbbf24', fontSize: 14, fontWeight: '600' },
    modalBtn: {
      backgroundColor: '#22c55e',
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 32,
      marginTop: 16,
      width: '100%',
      alignItems: 'center',
    },
    modalBtnText: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  });
