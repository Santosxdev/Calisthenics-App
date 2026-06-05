# Arquitetura

## Estrutura de Diretórios (src/)

```
src/
├── App.js                       # Entry point (NavigationContainer)
├── navigation/
│   └── AppNavigator.js          # Stack + Bottom Tab config
├── screens/
│   ├── LoginScreen.js
│   ├── PreferencesScreen.js
│   ├── HomeScreen.js
│   ├── ActiveWorkoutScreen.js
│   ├── ProgressScreen.js
│   └── ProfileScreen.js
├── components/
│   ├── ExerciseCard.js           # Card de exercício no treino
│   ├── SetRow.js                 # Input de série (reps + concluir)
│   ├── RestTimer.js              # Timer de descanso entre séries
│   ├── StreakBadge.js            # 🔥 streak display
│   ├── XpBar.js                  # Barra de XP
│   ├── AchievementCard.js        # Card de conquista
│   ├── PreferenceCard.js         # Card selecionável (objetivo/nível)
│   ├── RoutineSelector.js        # Seletor de rotina
│   └── WeekCalendar.js           # Calendário semanal da rotina
├── context/
│   └── AppContext.js             # Context + reducer global
├── data/
│   ├── routines.js               # Definições das rotinas PPL, UL, etc.
│   ├── exercises.js              # Banco de exercícios de calistenia
│   └── achievements.js           # Definição dos achievements
├── services/
│   └── storage.js                # AsyncStorage wrapper (load, save, reset)
└── utils/
    ├── xpCalculator.js           # Cálculo de XP por treino
    ├── achievementChecker.js     # Verificação de achievements
    └── dateUtils.js              # Helpers de data (streak, etc.)
```

## Fluxo de Navegação

```
AppNavigator (NativeStack)
├── LoginScreen            # 1ª tela — sempre aparece
│   ├── se usuário existe → MainTabs
│   └── se novo → PreferencesScreen
├── PreferencesScreen      # Só na 1ª vez (novo usuário)
└── MainTabs (BottomTab)
    ├── HomeTab → HomeScreen
    ├── TreinoTab → ActiveWorkoutScreen
    ├── ProgressoTab → ProgressScreen
    └── PerfilTab → ProfileScreen
```

## Regras de Navegação
- **LoginScreen** é a tela inicial (root do Stack)
- Se `@kcal_user` já existe → `navigation.replace('MainTabs')`
- Se `@kcal_user` não existe → cria novo → `navigation.replace('Preferences')`
- PreferencesScreen salva dados → `navigation.replace('MainTabs')`
- ProfileScreen pode reabrir Preferences via navegação
- HomeScreen mostra dia atual da rotina; se for treino, botão leva à TreinoTab
- TreinoTab só mostra exercícios se for dia de treino (se for descanso, mostra mensagem)
- Resetar dados: `resetAll()` + `navigation.replace('Login')`
