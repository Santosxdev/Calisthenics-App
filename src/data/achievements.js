// data/achievements.js
// Definição dos 8 achievements do sistema com suas condições de desbloqueio
// Cada achievement tem: id, nome, ícone, descrição, condição, e status unlocked

const ACHIEVEMENTS = [
  {
    id: 'first_workout',
    name: 'Primeiro Passo',
    icon: '🏆',
    description: 'Completar 1 treino',
    condition: { type: 'total_workouts', value: 1 },
    unlocked: false,
  },
  {
    id: 'week_streak',
    name: 'Semana Focada',
    icon: '🔥',
    description: '7 dias consecutivos de treino',
    condition: { type: 'streak', value: 7 },
    unlocked: false,
  },
  {
    id: 'month_streak',
    name: 'Mês Disciplinado',
    icon: '📅',
    description: '30 dias consecutivos de treino',
    condition: { type: 'streak', value: 30 },
    unlocked: false,
  },
  {
    id: 'total_50',
    name: 'Meio Centenário',
    icon: '💪',
    description: '50 treinos no total',
    condition: { type: 'total_workouts', value: 50 },
    unlocked: false,
  },
  {
    id: 'total_100',
    name: 'Centenário',
    icon: '🎯',
    description: '100 treinos no total',
    condition: { type: 'total_workouts', value: 100 },
    unlocked: false,
  },
  {
    id: 'push_500',
    name: '500 Flexões',
    icon: '🏋️',
    description: 'Acumular 500 flexões',
    condition: { type: 'total_exercise', exerciseId: 'push_std', value: 500 },
    unlocked: false,
  },
  {
    id: 'pull_100',
    name: '100 Barras',
    icon: '💪',
    description: 'Acumular 100 barras fixas',
    condition: { type: 'total_exercise', exerciseId: 'pull_bar', value: 100 },
    unlocked: false,
  },
  {
    id: 'squat_500',
    name: '500 Agachamentos',
    icon: '🦵',
    description: 'Acumular 500 agachamentos',
    condition: { type: 'total_exercise', exerciseId: 'legs_squat', value: 500 },
    unlocked: false,
  },
];

export default ACHIEVEMENTS;
