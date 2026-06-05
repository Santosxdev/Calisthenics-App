// utils/achievementChecker.js
// Verifica quais achievements foram desbloqueados baseado nas sessões e streak do usuário

// Agrega total de reps por exercício em todas as sessões
function aggregateExerciseCounts(sessions) {
  const counts = {};
  sessions.forEach((session) => {
    (session.exercises || []).forEach((ex) => {
      (ex.sets || []).forEach((set) => {
        const id = ex.exerciseId;
        counts[id] = (counts[id] || 0) + (set.reps || 0);
      });
    });
  });
  return counts;
}

// Verifica a lista de achievements contra os dados atuais, retornando os que foram desbloqueados
export function checkAchievements(achievements, sessions, user) {
  const totalWorkouts = sessions.length;
  const streak = user.streak || 0;
  const exerciseCounts = aggregateExerciseCounts(sessions);

  return achievements.map((ach) => {
    if (ach.unlocked) return ach;
    const c = ach.condition;
    let earned = false;

    switch (c.type) {
      case 'total_workouts':
        earned = totalWorkouts >= c.value;
        break;
      case 'streak':
        earned = streak >= c.value;
        break;
      case 'total_exercise':
        earned = (exerciseCounts[c.exerciseId] || 0) >= c.value;
        break;
      default:
        break;
    }

    if (earned) {
      return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
    }
    return ach;
  });
}
