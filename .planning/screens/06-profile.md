# ProfileScreen

## Função
Gerenciamento de perfil, preferências, rotina e dados.

## Layout
```
┌──────────────────────┐
│ ⚙️ Perfil            │
├──────────────────────┤
│                      │
│ ┌──────────────────┐ │
│ │ 👤 Paulo          │ │
│ │ Lv.3 · 12 treinos │ │
│ │ Membro desde      │ │
│ │ 29/05/2026        │ │
│ └──────────────────┘ │
│                      │
│ PREFERÊNCIAS         │
│ ┌──────────────────┐ │
│ │ Objetivo: Força   │ │
│ │ Nível: Intermed.  │ │
│ │ [ Redefinir ]     │ │
│ └──────────────────┘ │
│                      │
│ ROTINA ATUAL         │
│ ┌──────────────────┐ │
│ │ PPL               │ │
│ │ 6x/semana         │ │
│ │ [ Trocar ]        │ │
│ └──────────────────┘ │
│                      │
│ AGENDA SEMANAL       │
│ Seg ☐ Push           │
│ Ter ☐ Pull           │
│ Qua ☐ Legs           │
│ Qui 🟢 Descanso      │
│ Sex ☐ Push           │
│ Sáb ☐ Pull           │
│ Dom ☐ Legs           │
│                      │
│ ──── AÇÕES ────      │
│                      │
│ [ Trocar Rotina ]    │
│ [ Redefinir Prefs ]  │
│ [ Resetar Dados ]    │
│ (vermelho)           │
└──────────────────────┘
```

## Comportamento
- **Card Preferências**: mostra objetivo + nível atuais (somente leitura)
  - "Redefinir" → navega para PreferencesScreen (mantém XP, sessions, achievements)
- **Rotina Atual**: nome + frequência
  - "Trocar" → abre modal com RoutineSelector (igual do Preferences)
  - Ao trocar: mantém XP, nível, achievements (só muda `user.routine`)
- **"Resetar Dados"**: modal de confirmação
  - "Tem certeza? Todo progresso será perdido."
  - Confirmar: `resetAll()` → navega para Login
- **Agenda semanal**: lista os 7 dias com status (treino/descanso)
