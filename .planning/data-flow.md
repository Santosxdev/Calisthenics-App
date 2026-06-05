# Fluxo de Dados

## AsyncStorage Keys
```
@kcal_user        → { name, preferences, level, xp, streak, lastWorkoutDate, routine }
@kcal_sessions    → [WorkoutSession, ...]
@kcal_achievements → [Achievement, ...]
```

## Fluxo Principal

```
Login
  ├── input nome
  ├── busca @kcal_user no AsyncStorage
  ├── se existe → vai para Home
  └── se não existe
       │
       ▼
Preferences
  ├── seleciona objetivo (Força/Hipertrofia/Resistência/Geral)
  ├── seleciona nível (Iniciante/Intermediário/Avançado)
  ├── rotina sugerida pré-selecionada
  └── salva @kcal_user com preferências → Home
       │
       ▼
Home/Dashboard
  ├── lê @kcal_user → mostra streak, nível, XP
  ├── calcula treino de hoje baseado na rotina
  └── "Hoje: PUSH DAY" ou "🟢 Descanso"
       │
       ▼ (se for dia de treino)
Treino Ativo
  ├── carrega exercícios do dia (da routine)
  ├── timer de descanso baseado no objetivo (Força=2-5min, Hipertrofia=60-90s, etc.)
  ├── usuário loga sets (reps)
  ├── marca exercícios como concluídos
  ├── "Finalizar Treino"
  │   ├── salva WorkoutSession em @kcal_sessions
  │   ├── atualiza XP (+50 base + bônus streak)
  │   ├── atualiza streak em @kcal_user
  │   └── verifica achievements
  │
  ├── modal pós-treino (XP ganho, próximo treino, achievements)
  │
  ▼
Progresso / Conquistas
  ├── lê @kcal_sessions → estatísticas
  ├── lê @kcal_achievements → grade
  └── lê @kcal_user → nível
```

## Modelos

```js
User: {
  name: string,
  preferences: {
    goal: 'strength' | 'hypertrophy' | 'endurance' | 'general',
    level: 'beginner' | 'intermediate' | 'advanced'
  },
  level: number,        // 1-50
  xp: number,           // total acumulado
  streak: number,       // dias consecutivos
  lastWorkoutDate: string, // YYYY-MM-DD
  routine: 'ppl' | 'ul' | 'ppl_up' | 'arnold'
}

Routine: {
  id: string,
  name: string,           // "PPL", "Upper/Lower", etc.
  description: string,
  goal: string,           // objetivo recomendado
  level: string,          // nível recomendado
  weekSchedule: Day[]     // 7 dias
}

Day: {
  name: string,           // "Segunda", "Terça", etc.
  isRestDay: boolean,
  workoutName?: string,   // "Push Day", "Upper", etc.
  exercises?: Exercise[]
}

Exercise: {
  id: string,
  name: string,           // "Flexão", "Barra", "Agachamento"
  muscleGroup: string,    // "Peito", "Costas", "Pernas"
  description?: string,
  repTarget?: number,     // meta de reps sugerida (baseada no objetivo)
  sets?: number           // número de séries padrão (baseada no objetivo)
}

WorkoutSession: {
  id: string,
  date: string,
  routine: string,
  dayIndex: number,
  duration: number,       // minutos
  exercises: [{
    exerciseId: string,
    sets: [{ reps: number, restTime?: number }]
  }],
  totalXp: number
}

Achievement: {
  id: string,
  name: string,
  icon: string,           // emoji
  description: string,
  condition: string,      // chave para verificar
  unlocked: boolean,
  unlockedAt?: string
}
```

## Modelo de Preferências (Científico)

```js
GoalConfig: {
  restTime: number,       // segundos entre séries
  repRange: [number, number], // mínimo e máximo de reps
  defaultSets: number,
  name: string,
  description: string
}

// Mapeamento:
// strength   → rest: 120-300s, reps: 5-8,   sets: 4
// hypertrophy → rest: 60-90s,  reps: 8-15,  sets: 3
// endurance  → rest: 30-60s,  reps: 15-20+, sets: 3
// general    → rest: 60-90s,  reps: 10-12,  sets: 3
```
