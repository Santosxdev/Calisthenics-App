# ActiveWorkoutScreen

## Função
Execução do treino do dia — log de séries, timer de descanso científico, conclusão.

## Layout

### Estado: Lista de Exercícios
```
┌──────────────────────┐
│ PUSH DAY       ⏱ 12m│
│ ████████░░ 80%      │
├──────────────────────┤
│                      │
│ Exercícios:          │
│                      │
│ ┌──────────────────┐ │
│ │ ✅ Flexão        │ │
│ │ Peito            │ │
│ │ 3 sets × 12 reps │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ☐ Mergulho       │ │
│ │ Tríceps          │ │
│ │ 0/3 sets         │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ☐ Pike Push      │ │
│ │ Ombros           │ │
│ │ 0/3 sets         │ │
│ └──────────────────┘ │
│ ...                  │
│                      │
│ [ FINALIZAR TREINO ] │  ← só quando 100%
└──────────────────────┘
```

### Estado: Exercício Expandido (log de séries)
```
┌──────────────────────┐
│ ← Flexão             │
│ Peito                │
│                      │
│ Série 1: 12 reps [✅]│
│ Série 2: 12 reps [✅]│
│ Série 3: 12 reps [☐]│
│                      │
│ ⏱️ DESCANSO 90s      │ ← baseado no objetivo
│ [████████░░]         │
│ 30s │ 60s │ 90s      │ ← presets ajustáveis
│                      │
│ [ CONCLUIR EXERCÍCIO ]│
└──────────────────────┘
```

### Estado: Pós-Treino (Modal)
```
┌──────────────────────┐
│ 🎉 TREINO COMPLETO!  │
│                      │
│ +75 XP               │
│ 🔥 Streak: 6 dias    │
│                      │
│ 🏆 Novo achievement! │
│ "Semana Focada"      │
│                      │
│ Próximo: Pull Day    │
│                      │
│ [ VOLTAR AO DASHBOARD]│
└──────────────────────┘
```

## Timer de Descanso (Científico)

O tempo de descanso padrão é definido pelo **goal** do usuário:

| Objetivo | Descanso padrão | Presets disponíveis | Evidência |
|----------|:---------------:|:-------------------:|-----------|
| Força | 180s (3 min) | 60s · 120s · 180s · 300s | Recuperação ATP-PC (Willardson, 2006) |
| Hipertrofia | 90s | 30s · 60s · 90s · 120s | Estresse metabólico (Schoenfeld, 2010) |
| Resistência | 60s | 30s · 60s · 90s · 120s | Resistência muscular (ACSM, 2021) |
| Geral | 90s | 30s · 60s · 90s · 120s | Equilíbrio geral |

## Comportamento
1. Carrega exercícios do dia baseado na rotina
2. Timer de descanso padrão baseado em `user.preferences.goal`
3. Tap no exercise → expande (mostra sets)
4. Add set: botão "+", até configurable max (default 4)
5. Input reps: stepper (+ / -) ou input numérico
6. Checkbox na série → marca concluída
7. Ao marcar série → RestTimer auto-inicia (com duração do objetivo)
8. Timer tem presets ajustáveis + pular
9. Checkbox no exercise → marca concluído (só quando todos sets ok)
10. Barra de progresso: sets concluídos / sets totais
11. "Finalizar Treino": enabled quando todos exercises concluídos
12. Ao finalizar:
    - Calcula XP (50 base + streak bonus + meta bonus)
    - Atualiza streak
    - Salva WorkoutSession
    - Verifica achievements
    - Mostra modal de pós-treino
13. Se dia de descanso: tela com mensagem "Hoje é dia de descanso! 🟢"
