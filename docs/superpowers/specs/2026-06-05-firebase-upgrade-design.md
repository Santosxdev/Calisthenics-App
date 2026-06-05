# Firebase Upgrade — Workout Log: Calistenia Gamificada

## Objetivo

Migrar o app de persistência local (AsyncStorage) para Firebase (Auth + Firestore), adicionar autenticação por email/senha, permitir CRUD de exercícios por dia de treino, e exibir a semana completa de treinos na tela inicial.

## Escopo

- Firebase Auth (email/senha)
- Firestore como banco de dados principal
- HomeScreen redesenhada: exibe os 7 dias da rotina como cards clicáveis
- Nova DayDetailScreen: exercícios do dia com criar, deletar, check, timer entre séries
- Demais telas adaptadas para ler/escrever no Firestore
- Gamificação (XP, streaks, achievements) preservada e sincronizada

## Stack

- React Native + Expo (~52.0.0)
- Firebase Web SDK v10+ (compatível com Expo)
- React Navigation (Stack + Bottom Tabs)

## Firestore Collections

### `users/{uid}`

```ts
{
  name: string,
  email: string,
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'general',
  level: 'beginner' | 'intermediate' | 'advanced',
  routine: 'ppl' | 'ul' | 'ppl_up' | 'arnold',
  xp: number,
  streak: number,
  lastWorkoutDate: Timestamp | null,
  createdAt: Timestamp
}
```

### `users/{uid}/workouts/{weekId}`

Semana identificada pelo ISO week string (ex: `"2026-W23"`).

```ts
{
  days: {
    monday: { exercises: Exercise[], completed: boolean },
    tuesday: { exercises: Exercise[], completed: boolean },
    wednesday: { exercises: Exercise[], completed: boolean },
    thursday: { exercises: Exercise[], completed: boolean },
    friday: { exercises: Exercise[], completed: boolean },
    saturday: { exercises: Exercise[], completed: boolean },
    sunday: { exercises: Exercise[], completed: boolean }
  }
}
```

Onde `Exercise`:

```ts
{
  id: string,            // unique per day (ex: 'ex_123abc')
  name: string,          // "Flexão Diamante"
  muscleGroup: string,   // "Tríceps"
  sets: number,          // 3
  reps: number,          // 10
  completed: boolean,    // se todas as séries foram feitas
  isCustom: boolean      // true se criado pelo usuário
}
```

### `users/{uid}/sessions/{sessionId}`

```ts
{
  date: Timestamp,
  routine: string,
  dayName: string,       // "segunda"
  duration: number,      // minutos
  exercises: {
    exerciseId: string,
    name: string,
    sets: { reps: number, completed: boolean }[]
  }[],
  totalXp: number,
  createdAt: Timestamp
}
```

## Telas

### LoginScreen (REF EITA)

- Dois modos: Login (email + senha) e Registrar (email + senha + nome)
- Firebase Auth `createUserWithEmailAndPassword` / `signInWithEmailAndPassword`
- Após registro, cria documento em `users/{uid}`
- `onAuthStateChanged` redireciona para Home se já logado

### PreferencesScreen (ADAPTADA)

- Mesma UI de seleção de objetivo + nível
- Salva no Firestore `users/{uid}` em vez de AsyncStorage
- Rotina sugerida mantida (mesma lógica)

### HomeScreen (NOVA)

- Exibe os 7 dias da semana como cards
- Cada card mostra: nome do dia (ex: "Segunda"), nome do treino (ex: "Push Day"), status (descanso/completo/pendente)
- Ao clicar em um dia de treino → navega para DayDetailScreen
- Se o dia não tem documento no Firestore, inicializa com os exercícios da rotina

### DayDetailScreen (NOVA)

- Header com nome do dia e timer de duração do treino
- Lista de exercícios:
  - Input de repetições por série
  - Checkbox ao lado de cada série
  - Botão "Deletar" (com confirmação) para remover exercício
  - Timer de descanso científico entre séries (por objetivo)
- Botão "Adicionar Exercício": modal com nome, grupo muscular, séries, repetições
- Botão "Finalizar Treino": calcula XP, atualiza streak, salva sessão no Firestore
- Progresso salvo no Firestore em tempo real (cada check)

### ProgressScreen (ADAPTADA)

- Lê dados do Firestore em vez de AsyncStorage
- Mesma UI: nível, XP, achievements, estatísticas

### ProfileScreen (ADAPTADA)

- Adiciona botão "Sair" (Firebase Auth signOut)
- Redefinir preferências e resetar dados agora opera no Firestore
- Mantém troca de rotina e edição de nome

## Serviços

### `src/services/firebase.js`

Inicializa Firebase Web SDK com as credenciais do projeto.

### `src/services/authService.js`

```ts
register(email, password, name): Promise<UserCredential>
login(email, password): Promise<UserCredential>
logout(): Promise<void>
onAuthChanged(callback): unsubscribe
```

### `src/services/firestoreService.js`

```ts
getUserData(uid): Promise<UserData>
saveUserData(uid, data): Promise<void>

getWeekWorkout(uid, weekId): Promise<WeekWorkout | null>
initWeekWorkout(uid, weekId, routine): Promise<WeekWorkout>
saveDayExercises(uid, weekId, dayName, exercises): Promise<void>

addSession(uid, session): Promise<void>
getSessions(uid): Promise<Session[]>

deleteUserData(uid): Promise<void>  // reset completo
```

## Gamificação

Mantida: XP base 50 + bônus streak (+5/dia, máx +50), 50 níveis (500 XP cada), 8 achievements.

A verificação de achievements agora roda no cliente e persiste no Firestore.

## O que NÃO muda

- `src/data/exercises.js` — mantido como base de exercícios padrão
- `src/data/routines.js` — mantido (PPL, UL, PPL+UP, Arnold)
- `src/utils/xpCalculator.js` — mantido
- `src/utils/achievementChecker.js` — mantido
- `src/utils/dateUtils.js` — mantido
- Componentes (ExerciseCard, SetRow, RestTimer, etc) — mantidos ou adaptados minimamente

## O que é removido

- `src/services/storage.js` — substituído por Firestore

## O que é alterado

- `AppContext.js` — simplificado, estado lido do Firestore, dispatch reduzido
- `AppNavigator.js` — adiciona rota DayDetail, verifica auth state
- `HomeScreen.js` — reescrita para mostrar semana
- `LoginScreen.js` — reescrita com Firebase Auth
- `PreferencesScreen.js` — salva no Firestore
- `ProgressScreen.js` — lê do Firestore
- `ProfileScreen.js` — adiciona logout

## Cronograma de Implementação

1. Firebase init + Auth service + LoginScreen
2. Firestore service + PreferencesScreen adaptada
3. HomeScreen (semana) + DayDetailScreen
4. ProgressScreen + ProfileScreen adaptadas
5. Gamificação integrada ao Firestore
6. Testes e ajustes finais
