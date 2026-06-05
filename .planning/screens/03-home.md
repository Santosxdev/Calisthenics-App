# HomeScreen

## Função
Dashboard principal — visão geral do progresso e treino de hoje.

## Layout
```
┌──────────────────────┐
│ Olá, Paulo      Lv.3 │
│ 🔥 5 dias        ██░ │  ← Streak badge + XP bar
├──────────────────────┤
│                      │
│ 📅 HOJE              │
│ ┌──────────────────┐ │
│ │ PUSH DAY         │ │
│ │ 6 exercícios     │ │
│ │ [ INICIAR TREINO ]│ │
│ └──────────────────┘ │
│                      │
│ 📊 SEMANA            │
│ Seg Ter Qua Qui Sex  │
│  ✅ ✅ 🟢 ✅ ✅     │ ← treino/descanso
│  Sáb Dom             │
│  ✅ ✅               │
│                      │
│ 📈 RESUMO            │
│ Treinos: 5/6 essa    │
│ │ semana             │
└──────────────────────┘
```

## Comportamento
- Se dia de descanso: card mostra "🟢 Dia de Descanso" sem botão
- "Iniciar Treino" → navega para ActiveWorkoutScreen (tab Treino)
- Streak calculado: diferença entre hoje e `lastWorkoutDate` ≤ 1 dia
- XP bar: `user.xp % 500` / 500
- Sempre recarregar ao entrar na tab (useFocusEffect)
