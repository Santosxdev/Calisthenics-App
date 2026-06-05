# Spec — Workout Log: Calistenia Gamificada

## Visão Geral
App mobile em React Native (Expo) para registro de treinos de calistenia com rotinas pré-definidas (PPL, UL, PPL+UP, Arnold Split), gamificação (XP, níveis, achievements), parâmetros científicos (objetivo → descanso) e persistência local.

## Público-Alvo
Praticantes de calistenia que querem seguir uma rotina estruturada e acompanhar evolução.

## Telas (6)

### 1. LoginScreen
**Função**: Entrada do usuário — reconhecer ou cadastrar.
- Input de nome (placeholder "Seu nome")
- Botão "Entrar"
- Se `@kcal_user` já existe → navega direto para Home
- Se não existe → cria usuário com nome e navega para PreferencesScreen

### 2. PreferencesScreen
**Função**: Configurar objetivo e nível para personalizar experiência.
- **Seção Objetivo**: 4 cards (Força, Hipertrofia, Resistência, Geral) com descrição
- **Seção Nível**: 3 cards (Iniciante, Intermediário, Avançado)
- **Rotina sugerida**: baseada na combinação objetivo + nível (pré-selecionada)
- Botão "Começar Treinos" → salva preferências + rotina e vai para Home

### 3. HomeScreen
**Função**: Dashboard principal — treino de hoje, progresso, stats.
- **Header**: nome + nível + XP
- **StreakBadge**: 🔥 N dias consecutivos
- **TodayCard**:
  - Se dia de treino: "Hoje: Push Day" + botão "Iniciar Treino"
  - Se descanso: "🟢 Dia de Descanso" + sugestão (alongamento, mobilidade)
- **WeekCalendar**: grid dos 7 dias, marcando treino (verde) e descanso (cinza)
- **Resumo**: treinos essa semana, total de séries, etc.

### 4. ActiveWorkoutScreen
**Função**: Execução do treino do dia com parâmetros científicos.
- **Header**: nome do treino + timer total
- **Lista de exercícios** (ExerciseCard):
  - Cada card mostra nome, grupo muscular, sets concluídos / total
  - Tap no card → expande para mostrar as séries
- **SetRow**: para cada série, input de reps + checkbox de conclusão
- **RestTimer**: aparece automaticamente após marcar série — duração baseada no objetivo do usuário

| Objetivo | Descanso entre séries | Faixa de reps | Séries padrão |
|----------|----------------------|:-------------:|:-------------:|
| Força | 2-5 min | 5-8 | 3-5 |
| Hipertrofia | 60-90s | 8-15 | 3-4 |
| Resistência | 30-60s | 15-20+ | 2-3 |
| Geral | 60-90s | 10-12 | 3 |

- **Progresso**: barra mostrando % do treino concluído
- **Botão "Finalizar Treino"** (aparece quando 100%)
  - Calcula XP, atualiza streak, salva sessão
  - Modal pós-treino com XP ganho, próximo treino, achievements

### 5. ProgressScreen
**Função**: Acompanhamento de evolução e conquistas.
- **Seção Nível**: XPBar + level atual + progresso
- **Seção Achievements**: grade de cards (AchievementCard)
  - Conquistados: coloridos, com nome, ícone e data
  - Bloqueados: cinza, mostra descrição do requisito
- **Seção Streak**: calendário minimalista dos últimos 30 dias
- **Seção Estatísticas**:
  - Total de treinos
  - Total de flexões, barras, agachamentos acumulados
  - Média de reps por semana

### 6. ProfileScreen
**Função**: Gerenciar rotina, perfil e dados do usuário.
- **Card do usuário**: nome, nível, total de treinos
- **Preferências Atuais**: objetivo + nível (somente leitura)
- **Rotina Atual**: nome + frequência + botão "Trocar" → abre RoutineSelector
- **Agenda Semanal**: WeekCalendar detalhado
- **Ações**:
  - "Trocar Rotina" → seleciona nova, mantém dados de progresso
  - "Redefinir Preferências" → volta para PreferencesScreen
  - "Resetar Dados" → confirmação → limpa AsyncStorage → volta ao Login

## Gamificação

### XP
- Treino completo: 50 XP
- Bônus streak: +5 XP por dia consecutivo (máx +50)
- Bônus por completar todos exercícios com meta de reps: +10 XP
- Level UP a cada 500 XP

### Níveis (1–50)
```
Level 1: 0-499 XP
Level 2: 500-999 XP
Level 3: 1000-1499 XP
... (500 XP por nível)
```

### Achievements
| ID | Nome | Condição |
|----|------|----------|
| first_workout | "Primeiro Passo" | Completar 1 treino |
| week_streak | "Semana Focada" | 7 dias de streak |
| month_streak | "Mês Disciplinado" | 30 dias de streak |
| total_50 | "Meio Centenário" | 50 treinos no total |
| total_100 | "Centenário" | 100 treinos no total |
| push_500 | "500 Flexões" | 500 flexões acumuladas |
| pull_100 | "100 Barras" | 100 barras acumuladas |
| squat_500 | "500 Agachamentos" | 500 agachamentos acumulados |

## Rotinas

### PPL (Push/Pull/Legs) — 6x/semana
| Dia | Treino |
|-----|--------|
| Seg | Push (flexões, mergulho, pike) |
| Ter | Pull (barra, remada) |
| Qua | Legs (agachamento, afundo) |
| Qui | Descanso |
| Sex | Push |
| Sáb | Pull |
| Dom | Legs |

### UL (Upper/Lower) — 4x/semana
| Dia | Treino |
|-----|--------|
| Seg | Upper (flexões + barra) |
| Ter | Lower (agachamento + panturrilha) |
| Qua | Descanso |
| Qui | Upper |
| Sex | Lower |
| Sáb | Descanso |
| Dom | Descanso |

### PPL+UP — 5x/semana
| Dia | Treino |
|-----|--------|
| Seg | Push |
| Ter | Pull |
| Qua | Legs |
| Qui | Descanso |
| Sex | Upper Push (peito + ombros intenso) |
| Sáb | Pull |
| Dom | Descanso |

### Arnold Split — 6x/semana
| Dia | Treino |
|-----|--------|
| Seg | Peito + Costas |
| Ter | Ombros + Braços |
| Qua | Pernas |
| Qui | Peito + Costas |
| Sex | Ombros + Braços |
| Sáb | Pernas |
| Dom | Descanso |

## Dados de Exercícios (Pré-carregados)
```
Flexão — Peito
Flexão Diamante — Tríceps
Flexão Pike — Ombros
Mergulho (Dips) — Tríceps
Barra Fixa — Costas
Remada Invertida — Costas
Rosca Invertida — Bíceps
Agachamento — Pernas
Afundo — Pernas
Elevação Pélvica — Glúteos
Panturrilha — Panturrilhas
Prancha — Core
Elevação de Pernas — Core
```

## Persistência
- **AsyncStorage** com 4 chaves: `@kcal_user`, `@kcal_sessions`, `@kcal_achievements`, `@kcal_routines`
- Operações: `loadData(key)`, `saveData(key, value)`, `resetAll()`
- Dados carregados no `AppContext` na inicialização

## Estado Global (Context)
```js
{
  user: User | null,
  sessions: WorkoutSession[],
  achievements: Achievement[],
  todayWorkout: Day | null,    // calculado
  dispatch: function
}
```

## Sugestão de Rotina (Objetivo + Nível)
| Objetivo | Iniciante | Intermediário | Avançado |
|----------|-----------|---------------|----------|
| Força | PPL (ênfase força) | PPL+UP | Arnold Split |
| Hipertrofia | PPL | PPL+UP | Arnold Split |
| Resistência | UL | PPL | PPL+UP |
| Geral | PPL | PPL | PPL+UP |

## Tema (Cores)
- **Primária**: `#22c55e` (verde — saúde/fitness)
- **Fundo**: `#0f172a` (slate 900 — escuro)
- **Card**: `#1e293b` (slate 800)
- **Texto**: `#f8fafc` (slate 50)
- **Descanso**: `#6b7280` (gray 500)
- **Achievement bloqueado**: `#374151` (gray 700)
