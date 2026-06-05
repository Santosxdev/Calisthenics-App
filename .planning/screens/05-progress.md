# ProgressScreen

## Função
Acompanhamento de evolução, conquistas e estatísticas.

## Layout
```
┌──────────────────────┐
│ 🏆 Progresso         │
├──────────────────────┤
│                      │
│ SEU NÍVEL            │
│ ┌──────────────────┐ │
│ │     ⭐ Lv.3       │ │
│ │ ████████░░░░ 250  │ │
│ │       /500 XP     │ │
│ └──────────────────┘ │
│                      │
│ CONQUISTAS (4/8)     │
│ ┌────┐ ┌────┐ ┌────┐│
│ │ 🏆 │ │ 🔒 │ │ 🔒 ││
│ │ 1º  │ │ Sem │ │ Mês││
│ │ Tr  │ │     │ │    ││
│ └────┘ └────┘ └────┘│
│ ┌────┐ ┌────┐ ┌────┐│
│ │ 🔒 │ │ 🔒 │ │ 🔒 ││
│ │ 50  │ │100 │ │500 ││
│ │ Tr  │ │ Tr │ │Flx ││
│ └────┘ └────┘ └────┘│
│                      │
│ 🔥 STREAK            │
│ 5 dias consecutivos  │
│ [calendário visual]  │
│                      │
│ 📊 ESTATÍSTICAS      │
│ Total treinos: 12    │
│ Total flexões: 340   │
│ Total barras: 45     │
│ Média reps/semana: 8 │
└──────────────────────┘
```

## Comportamento
- Achievements grid: 3 colunas, scroll vertical
- Achievement desbloqueado: card colorido + ícone + data
- Achievement bloqueado: card cinza + cadeado
- Stats calculados a partir de `@kcal_sessions`
- Streak calendar: últimas 4 semanas, dias verdes = treinou
- Atualizar ao entrar na tab (useFocusEffect)
