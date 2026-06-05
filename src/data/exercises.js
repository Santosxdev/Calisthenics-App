// data/exercises.js
// Banco de exercícios de calistenia organizados por grupo muscular
// Cada exercício tem: id único, nome, e grupo muscular alvo

const EXERCISES = {
  push: [
    { id: 'push_std', name: 'Flexão', muscleGroup: 'Peito' },
    { id: 'push_diamond', name: 'Flexão Diamante', muscleGroup: 'Tríceps' },
    { id: 'push_pike', name: 'Flexão Pike', muscleGroup: 'Ombros' },
    { id: 'push_dips', name: 'Mergulho (Dips)', muscleGroup: 'Tríceps' },
    { id: 'push_wide', name: 'Flexão Aberta', muscleGroup: 'Peito' },
    { id: 'push_decline', name: 'Flexão Declinada', muscleGroup: 'Peito' },
  ],
  pull: [
    { id: 'pull_bar', name: 'Barra Fixa', muscleGroup: 'Costas' },
    { id: 'pull_row', name: 'Remada Invertida', muscleGroup: 'Costas' },
    { id: 'pull_curl', name: 'Rosca Invertida', muscleGroup: 'Bíceps' },
    { id: 'pull_chin', name: 'Chin Up', muscleGroup: 'Costas' },
    { id: 'pull_archer', name: 'Flexão Arqueiro', muscleGroup: 'Costas' },
  ],
  legs: [
    { id: 'legs_squat', name: 'Agachamento', muscleGroup: 'Pernas' },
    { id: 'legs_lunge', name: 'Afundo', muscleGroup: 'Pernas' },
    { id: 'legs_bridge', name: 'Elevação Pélvica', muscleGroup: 'Glúteos' },
    { id: 'legs_calf', name: 'Panturrilha', muscleGroup: 'Panturrilhas' },
    { id: 'legs_squat_jump', name: 'Agachamento com Salto', muscleGroup: 'Pernas' },
  ],
  core: [
    { id: 'core_plank', name: 'Prancha', muscleGroup: 'Core' },
    { id: 'core_leg_raise', name: 'Elevação de Pernas', muscleGroup: 'Core' },
  ],
  upper: [
    { id: 'upper_push', name: 'Flexão', muscleGroup: 'Peito' },
    { id: 'upper_pull', name: 'Barra Fixa', muscleGroup: 'Costas' },
    { id: 'upper_diamond', name: 'Flexão Diamante', muscleGroup: 'Tríceps' },
    { id: 'upper_row', name: 'Remada Invertida', muscleGroup: 'Costas' },
    { id: 'upper_pike', name: 'Flexão Pike', muscleGroup: 'Ombros' },
    { id: 'upper_curl', name: 'Rosca Invertida', muscleGroup: 'Bíceps' },
  ],
  lower: [
    { id: 'lower_squat', name: 'Agachamento', muscleGroup: 'Pernas' },
    { id: 'lower_lunge', name: 'Afundo', muscleGroup: 'Pernas' },
    { id: 'lower_bridge', name: 'Elevação Pélvica', muscleGroup: 'Glúteos' },
    { id: 'lower_calf', name: 'Panturrilha', muscleGroup: 'Panturrilhas' },
  ],
  chest_back: [
    { id: 'cb_push', name: 'Flexão', muscleGroup: 'Peito' },
    { id: 'cb_pull', name: 'Barra Fixa', muscleGroup: 'Costas' },
    { id: 'cb_wide', name: 'Flexão Aberta', muscleGroup: 'Peito' },
    { id: 'cb_row', name: 'Remada Invertida', muscleGroup: 'Costas' },
    { id: 'cb_diamond', name: 'Flexão Diamante', muscleGroup: 'Tríceps' },
  ],
  shoulders_arms: [
    { id: 'sa_pike', name: 'Flexão Pike', muscleGroup: 'Ombros' },
    { id: 'sa_dips', name: 'Mergulho (Dips)', muscleGroup: 'Tríceps' },
    { id: 'sa_curl', name: 'Rosca Invertida', muscleGroup: 'Bíceps' },
    { id: 'sa_plank', name: 'Prancha', muscleGroup: 'Core' },
  ],
  full_upper_push: [
    { id: 'fup_push', name: 'Flexão', muscleGroup: 'Peito' },
    { id: 'fup_pike', name: 'Flexão Pike', muscleGroup: 'Ombros' },
    { id: 'fup_diamond', name: 'Flexão Diamante', muscleGroup: 'Tríceps' },
    { id: 'fup_dips', name: 'Mergulho (Dips)', muscleGroup: 'Tríceps' },
    { id: 'fup_leg_raise', name: 'Elevação de Pernas', muscleGroup: 'Core' },
  ],
};

// Busca um exercício pelo ID, percorrendo todos os grupos
export function getExerciseById(id) {
  for (const group of Object.values(EXERCISES)) {
    const found = group.find((e) => e.id === id);
    if (found) return found;
  }
  return null;
}
