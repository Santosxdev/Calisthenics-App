// utils/xpCalculator.js
// Cálculo de XP por treino e progressão de nível
// Base: treino = 50 XP + bônus de streak (máx +50)
// Level up a cada 500 XP acumulados

const XP_PER_LEVEL = 500;
const BASE_XP = 50;
const STREAK_BONUS_PER_DAY = 5;
const MAX_STREAK_BONUS = 50;

// Calcula XP ganho ao finalizar um treino, considerando streak atual
export function calculateWorkoutXp(streak) {
  const streakBonus = Math.min(streak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
  return { base: BASE_XP, streakBonus, metaBonus: 0, total: BASE_XP + streakBonus };
}

// Calcula nível atual e progresso baseado no XP total acumulado (max nível 50)
export function calculateLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  return { level: Math.min(level, 50), currentXp: currentLevelXp, maxXp: XP_PER_LEVEL };
}
