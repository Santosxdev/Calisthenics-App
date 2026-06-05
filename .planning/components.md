# Componentes Compartilhados

## ExerciseCard
- Props: `exercise: Exercise, onPress, isCompleted`
- Exibe nome, grupo muscular, status (✅ ou pendente)
- Botão de "Iniciar" → navega para log de séries

## SetRow
- Props: `setIndex, initialReps?, onComplete, onRepsChange`
- Input numérico para reps
- Checkbox para concluir
- Exibe número da série (1/3, 2/3, etc.)

## RestTimer
- Props: `duration (30|60|90|120|180|300), onComplete`
- Timer regressivo com display grande
- Botão "Pular Descanso"
- Presets: 30s, 60s, 90s, 120s, 180s, 300s (baseado no objetivo)
- Auto-start ao marcar série como concluída
- Valor padrão definido pelo goal do usuário

## StreakBadge
- Props: `streak: number`
- Exibe 🔥 N dias

## XpBar
- Props: `currentXp, maxXp, level`
- Barra de progresso horizontal
- Texto: "Nível 3 — 250/500 XP"

## AchievementCard
- Props: `achievement: Achievement`
- Bloqueado: cinza com cadeado
- Desbloqueado: colorido com nome e data

## PreferenceCard
- Props: `title, description, icon, selected, onPress`
- Card selecionável com borda destacada quando ativo
- Usado em PreferencesScreen (objetivo e nível)
- Ícone + título + descrição curta

## RoutineSelector
- Props: `routines: Routine[], selectedId, onSelect`
- Cards verticais com nome + descrição + dias por semana

## WeekCalendar
- Props: `routine: Routine, currentDayIndex`
- Grid 7 dias (Seg-Dom)
- Dia atual destacado
- Dias de treino em verde, descanso em cinza
