# Prompt para Gemini — Criar Banco Firestore do Workout Log

Copie e cole o prompt abaixo no Gemini (gemini.google.com) para gerar o Firebase Setup completo do projeto.

---

```
Você é um especialista em Firebase. Preciso que você gere TODOS os arquivos e configurações necessários para configurar o Firebase (Auth + Firestore) de um aplicativo React Native (Expo) chamado Workout Log — um tracker de treinos de calistenia com gamificação.

## Estrutura do Firestore

### Coleção `users/{uid}`
```
{
  name: string,
  email: string,
  goal: "strength" | "hypertrophy" | "endurance" | "general",
  level: "beginner" | "intermediate" | "advanced",
  routine: "ppl" | "ul" | "ppl_up" | "arnold",
  xp: number,
  streak: number,
  lastWorkoutDate: Timestamp | null,
  createdAt: Timestamp
}
```

### Coleção `users/{uid}/workouts/{weekId}`
O weekId segue o padrão ISO "YYYY-WNN" (ex: "2026-W23").
```
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

### Type `Exercise`
```
{
  id: string,
  name: string,
  muscleGroup: string,
  sets: number,
  reps: number,
  completed: boolean,
  isCustom: boolean
}
```

### Coleção `users/{uid}/sessions/{sessionId}`
```
{
  date: Timestamp,
  routine: string,
  dayName: string,
  duration: number,
  exercises: {
    exerciseId: string,
    name: string,
    sets: { reps: number, completed: boolean }[]
  }[],
  totalXp: number,
  createdAt: Timestamp
}
```

## Gere os seguintes arquivos:

### 1. firestore.rules
Regras de segurança do Firestore que garantem que:
- Apenas usuários autenticados podem ler/escrever nos próprios dados
- Usuário só acessa `users/{uid}` onde uid == request.auth.uid
- As subcoleções `workouts` e `sessions` seguem a mesma regra
- Validação básica de tipos nos campos (xp é número, name é string, etc)
- Impedir que um usuário crie documento em outro uid

### 2. firestore.indexes.json
Índices necessários:
- sessions ordenadas por data descendente (para exibir histórico)
- Qualquer outro índice que faça sentido para as queries do app

### 3. firebase.json
Arquivo de configuração do Firebase apontando para firestore.rules.

### 4. Código de inicialização dos serviços (JavaScript para React Native/Expo)
Gere o código dos seguintes arquivos:

#### src/services/firebase.js
Inicialização do Firebase Web SDK (v10+) usando as variáveis de ambiente:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

#### src/services/authService.js
Funções:
- register(email, password, name) → cria Auth user + cria documento em users/{uid}
- login(email, password) → signInWithEmailAndPassword
- logout() → signOut
- onAuthChanged(callback) → onAuthStateChanged

#### src/services/firestoreService.js
Funções:
- getUserData(uid) → busca doc em users/{uid}
- saveUserData(uid, data) → setDoc em users/{uid}
- getWeekWorkout(uid, weekId) → busca doc em users/{uid}/workouts/{weekId}
- initWeekWorkout(uid, weekId, routineExercises) → cria doc com os 7 dias populados com os exercícios da rotina
- saveDayExercises(uid, weekId, dayName, exercises) → atualiza os exercícios de um dia específico
- addSession(uid, session) → addDoc em users/{uid}/sessions/
- getSessions(uid) → query ordenada por date DESC
- deleteUserData(uid) → deleta todos os documentos do usuário (reset)

### 5. Breve instrução de setup (txt)
Passos para ativar Authentication (Email/Senha) e criar o banco Firestore no console do Firebase.

---

Observações importantes:
- O projeto usa Expo (~52.0.0) e React Native
- O SDK Firebase é o compatível com Expo (firebase v10+ via npm)
- Código JS deve usar sintaxe ES Modules (import/export)
- Trate erros com try/catch
- Use Timestamp do Firebase para datas
- O authService deve retornar o usuário recém-criado após o registro para que a UI possa redirecionar
```
