// data/routines.js
// Definições das 4 rotinas de treino: PPL, UL, PPL+UP, Arnold Split
// Cada rotina tem schedule semanal com exercícios referenciados por ID
// Inclui tabela de sugestão baseada em objetivo + nível do usuário

const ROUTINES = [
  {
    id: 'ppl',
    name: 'PPL',
    description: 'Push/Pull/Legs — 6x/semana',
    frequency: '6x/semana',
    weekSchedule: [
      {
        name: 'Segunda', isRestDay: false, workoutName: 'Push Day',
        exercises: ['push_std', 'push_diamond', 'push_dips', 'push_pike', 'core_plank'],
      },
      {
        name: 'Terça', isRestDay: false, workoutName: 'Pull Day',
        exercises: ['pull_bar', 'pull_row', 'pull_curl', 'pull_chin', 'core_leg_raise'],
      },
      {
        name: 'Quarta', isRestDay: false, workoutName: 'Legs Day',
        exercises: ['legs_squat', 'legs_lunge', 'legs_bridge', 'legs_calf'],
      },
      { name: 'Quinta', isRestDay: true },
      {
        name: 'Sexta', isRestDay: false, workoutName: 'Push Day',
        exercises: ['push_wide', 'push_std', 'push_diamond', 'push_decline', 'core_plank'],
      },
      {
        name: 'Sábado', isRestDay: false, workoutName: 'Pull Day',
        exercises: ['pull_bar', 'pull_archer', 'pull_row', 'pull_curl'],
      },
      {
        name: 'Domingo', isRestDay: false, workoutName: 'Legs Day',
        exercises: ['legs_squat', 'legs_lunge', 'legs_squat_jump', 'legs_calf'],
      },
    ],
  },
  {
    id: 'ul',
    name: 'UL',
    description: 'Upper/Lower — 4x/semana',
    frequency: '4x/semana',
    weekSchedule: [
      {
        name: 'Segunda', isRestDay: false, workoutName: 'Upper Day',
        exercises: ['upper_push', 'upper_pull', 'upper_diamond', 'upper_row', 'core_plank'],
      },
      {
        name: 'Terça', isRestDay: false, workoutName: 'Lower Day',
        exercises: ['lower_squat', 'lower_lunge', 'lower_bridge', 'lower_calf'],
      },
      { name: 'Quarta', isRestDay: true },
      {
        name: 'Quinta', isRestDay: false, workoutName: 'Upper Day',
        exercises: ['upper_push', 'upper_pull', 'upper_pike', 'upper_curl', 'core_leg_raise'],
      },
      {
        name: 'Sexta', isRestDay: false, workoutName: 'Lower Day',
        exercises: ['lower_squat', 'lower_lunge', 'lower_squat_jump', 'lower_calf'],
      },
      { name: 'Sábado', isRestDay: true },
      { name: 'Domingo', isRestDay: true },
    ],
  },
  {
    id: 'ppl_up',
    name: 'PPL+UP',
    description: 'Push/Pull/Legs + Upper Push — 5x/semana',
    frequency: '5x/semana',
    weekSchedule: [
      {
        name: 'Segunda', isRestDay: false, workoutName: 'Push Day',
        exercises: ['push_std', 'push_diamond', 'push_dips', 'push_pike', 'core_plank'],
      },
      {
        name: 'Terça', isRestDay: false, workoutName: 'Pull Day',
        exercises: ['pull_bar', 'pull_row', 'pull_curl', 'pull_chin'],
      },
      {
        name: 'Quarta', isRestDay: false, workoutName: 'Legs Day',
        exercises: ['legs_squat', 'legs_lunge', 'legs_bridge', 'legs_calf'],
      },
      { name: 'Quinta', isRestDay: true },
      {
        name: 'Sexta', isRestDay: false, workoutName: 'Upper Push',
        exercises: ['fup_push', 'fup_pike', 'fup_diamond', 'fup_dips', 'fup_leg_raise'],
      },
      {
        name: 'Sábado', isRestDay: false, workoutName: 'Pull Day',
        exercises: ['pull_bar', 'pull_archer', 'pull_row', 'pull_curl', 'core_leg_raise'],
      },
      { name: 'Domingo', isRestDay: true },
    ],
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    description: 'Peito+Costas / Ombros+Braços / Pernas — 6x/semana',
    frequency: '6x/semana',
    weekSchedule: [
      {
        name: 'Segunda', isRestDay: false, workoutName: 'Peito + Costas',
        exercises: ['cb_push', 'cb_pull', 'cb_wide', 'cb_row', 'cb_diamond'],
      },
      {
        name: 'Terça', isRestDay: false, workoutName: 'Ombros + Braços',
        exercises: ['sa_pike', 'sa_dips', 'sa_curl', 'sa_plank'],
      },
      {
        name: 'Quarta', isRestDay: false, workoutName: 'Pernas',
        exercises: ['legs_squat', 'legs_lunge', 'legs_bridge', 'legs_calf', 'legs_squat_jump'],
      },
      {
        name: 'Quinta', isRestDay: false, workoutName: 'Peito + Costas',
        exercises: ['cb_push', 'cb_pull', 'cb_wide', 'cb_row', 'cb_diamond'],
      },
      {
        name: 'Sexta', isRestDay: false, workoutName: 'Ombros + Braços',
        exercises: ['sa_pike', 'sa_dips', 'sa_curl', 'sa_plank'],
      },
      {
        name: 'Sábado', isRestDay: false, workoutName: 'Pernas',
        exercises: ['legs_squat', 'legs_lunge', 'legs_bridge', 'legs_calf', 'legs_squat_jump'],
      },
      { name: 'Domingo', isRestDay: true },
    ],
  },
];

// Tabela de sugestão de rotina: objetivo (Força/Hipertrofia/Resistência/Geral) x nível (Iniciante/Intermediário/Avançado)
export const ROUTINE_SUGGESTIONS = {
  strength: { beginner: 'ppl', intermediate: 'ppl_up', advanced: 'arnold' },
  hypertrophy: { beginner: 'ppl', intermediate: 'ppl_up', advanced: 'arnold' },
  endurance: { beginner: 'ul', intermediate: 'ppl', advanced: 'ppl_up' },
  general: { beginner: 'ppl', intermediate: 'ppl', advanced: 'ppl_up' },
};

// Retorna rotina pelo ID
export function getRoutineById(id) {
  return ROUTINES.find((r) => r.id === id);
}

// Sugere rotina baseada no objetivo e nível do usuário
export function suggestRoutine(goal, level) {
  const map = ROUTINE_SUGGESTIONS[goal];
  if (!map) return 'ppl';
  return map[level] || 'ppl';
}

export default ROUTINES;
