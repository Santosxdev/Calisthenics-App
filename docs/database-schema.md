# Database Schema — Workout Log (Firebase Firestore)

## 1. Firebase Auth

**Provider:** Email/Senha (apenas este)

**Registro:** `createUserWithEmailAndPassword(email, password)` + cria doc em `users/{uid}`

**Campos do Auth:** email, uid (gerado pelo Firebase)

---

## 2. Firestore Collections

### 2.1 `users/{uid}`

Documento principal do usuário, criado no primeiro registro.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | `string` | Sim | Nome de exibição |
| `email` | `string` | Sim | Email usado no Auth |
| `goal` | `string` | Sim | `"strength" \| "hypertrophy" \| "endurance" \| "general"` |
| `level` | `string` | Sim | `"beginner" \| "intermediate" \| "advanced"` |
| `routine` | `string` | Sim | `"ppl" \| "ul" \| "ppl_up" \| "arnold"` |
| `xp` | `number` | Sim | XP total acumulado (default: 0) |
| `streak` | `number` | Sim | Dias consecutivos de treino (default: 0) |
| `lastWorkoutDate` | `Timestamp` | Não | Data do último treino (null se nunca treinou) |
| `createdAt` | `Timestamp` | Sim | Data de criação da conta |

**Exemplo:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "goal": "hypertrophy",
  "level": "intermediate",
  "routine": "ppl_up",
  "xp": 1250,
  "streak": 5,
  "lastWorkoutDate": "2026-06-04T18:30:00Z",
  "createdAt": "2026-05-20T14:00:00Z"
}
```

---

### 2.2 `users/{uid}/workouts/{weekId}`

Semana de treinos. O `weekId` segue o padrão ISO `"YYYY-WNN"` (ex: `"2026-W23"`).

**Regra:** 1 documento por semana. Criado sob demanda quando o usuário acessa a Home.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `days` | `Map` | Sim | Objeto com 7 chaves (monday a sunday) |

#### Estrutura de `days.{dayName}`

| Subcampo | Tipo | Descrição |
|----------|------|-----------|
| `exercises` | `Array<Exercise>` | Lista de exercícios do dia |
| `completed` | `boolean` | Se o treino do dia foi finalizado |

#### Type `Exercise`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `string` | ID único dentro do dia (ex: `"ex_abc123"`) |
| `name` | `string` | Nome do exercício (ex: `"Flexão"`) |
| `muscleGroup` | `string` | Grupo muscular (ex: `"Peito"`) |
| `sets` | `number` | Número de séries |
| `reps` | `number` | Repetições por série |
| `completed` | `boolean` | Todas as séries concluídas |
| `isCustom` | `boolean` | `true` se criado pelo usuário |

**Dias da semana:** `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`

**Exemplo:**
```json
{
  "days": {
    "monday": {
      "exercises": [
        { "id": "push_std", "name": "Flexão", "muscleGroup": "Peito", "sets": 3, "reps": 10, "completed": false, "isCustom": false },
        { "id": "push_diamond", "name": "Flexão Diamante", "muscleGroup": "Tríceps", "sets": 3, "reps": 8, "completed": false, "isCustom": false }
      ],
      "completed": false
    },
    "tuesday": {
      "exercises": [
        { "id": "pull_bar", "name": "Barra Fixa", "muscleGroup": "Costas", "sets": 3, "reps": 6, "completed": false, "isCustom": false }
      ],
      "completed": false
    },
    "wednesday": { "exercises": [], "completed": false },
    "thursday": { "exercises": [], "completed": true },
    "friday": { "exercises": [], "completed": false },
    "saturday": { "exercises": [], "completed": false },
    "sunday": { "exercises": [], "completed": false }
  }
}
```

---

### 2.3 `users/{uid}/sessions/{sessionId}`

Sessão de treino finalizada. Criada ao clicar "Finalizar Treino".

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `date` | `Timestamp` | Sim | Data em que o treino foi realizado |
| `routine` | `string` | Sim | ID da rotina usada |
| `dayName` | `string` | Sim | Nome do dia (ex: `"monday"`) |
| `duration` | `number` | Sim | Duração em minutos |
| `exercises` | `array` | Sim | Lista de exercícios com reps |
| `totalXp` | `number` | Sim | XP ganho no treino |
| `createdAt` | `Timestamp` | Sim | Timestamp de criação |

#### Estrutura de `exercises[]`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `exerciseId` | `string` | ID do exercício |
| `name` | `string` | Nome do exercício |
| `sets` | `array` | Séries executadas |

#### Estrutura de `exercises[].sets[]`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `reps` | `number` | Repetições realizadas |
| `completed` | `boolean` | Se a série foi concluída |

**Exemplo:**
```json
{
  "date": "2026-06-04T18:30:00Z",
  "routine": "ppl_up",
  "dayName": "monday",
  "duration": 45,
  "exercises": [
    {
      "exerciseId": "push_std",
      "name": "Flexão",
      "sets": [
        { "reps": 12, "completed": true },
        { "reps": 10, "completed": true },
        { "reps": 8, "completed": true }
      ]
    }
  ],
  "totalXp": 50,
  "createdAt": "2026-06-04T19:15:00Z"
}
```

---

## 3. Security Rules (firestore.rules)

```text
Regras necessárias:
- Só usuários autenticados (request.auth != null)
- Cada uid só acessa o próprio documento: request.auth.uid == uid
- Subcoleções (workouts, sessions) herdam a mesma regra do uid pai
- Validação de tipos nos campos principais
- Leitura liberada para documento próprio
- Escrita: só o próprio dono
```

## 4. Índices (firestore.indexes.json)

| Coleção | Campos | Ordem |
|---------|--------|-------|
| `users/{uid}/sessions` | `date` | Descendente |

Query: listar sessões da mais recente para a mais antiga.

## 5. Resumo das Operações

| Operação | Collection | Tipo |
|----------|-----------|------|
| Criar usuário | `users/{uid}` | `setDoc` (após registro) |
| Ler perfil | `users/{uid}` | `getDoc` |
| Atualizar perfil | `users/{uid}` | `setDoc` (merge) |
| Ler semana | `users/{uid}/workouts/{weekId}` | `getDoc` |
| Criar semana | `users/{uid}/workouts/{weekId}` | `setDoc` |
| Atualizar dia | `users/{uid}/workouts/{weekId}` | `setDoc` com campo `days.{dayName}` |
| Criar sessão | `users/{uid}/sessions/{autoId}` | `addDoc` |
| Listar sessões | `users/{uid}/sessions` | `query` orderBy date DESC |
| Resetar dados | `users/{uid}` + subcoleções | `deleteDoc` em todos documentos |

## 6. Regras de Negócio (validadas no app)

- XP por treino: 50 base + bônus streak (+5/dia, máximo +50)
- Níveis: 1 a 50, 500 XP por nível
- Streak: incrementa a cada treino completo, zera se pular 1+ dias
- Achievements: 8 no total, verificados no cliente após cada treino, salvos inline no user doc ou em campo próprio
- Exercício customizado: `isCustom: true`, não persiste entre semanas (cópia a cada nova semana)
