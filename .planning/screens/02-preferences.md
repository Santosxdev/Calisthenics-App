# PreferencesScreen

## Função
Configurações iniciais do usuário — objetivo e nível. Aparece apenas na primeira vez (após o login de novo usuário).

## Layout
```
┌──────────────────────┐
│   ⚙️ Suas Preferências│
│                      │
│   Qual seu objetivo? │
│                      │
│   ┌────────────────┐ │
│   │ 💪 Força        │ │
│   │ 5-8 reps ·      │ │
│   │ Descanso 2-5min │ │
│   └────────────────┘ │
│   ┌────────────────┐ │
│   │ 🔱 Hipertrofia  │ │
│   │ 8-15 reps ·     │ │
│   │ Descanso 60-90s │ │
│   └────────────────┘ │
│   ┌────────────────┐ │
│   │ 💨 Resistência  │ │
│   │ 15+ reps ·      │ │
│   │ Descanso 30-60s │ │
│   └────────────────┘ │
│   ┌────────────────┐ │
│   │ ⚖️ Geral        │ │
│   │ 10-12 reps ·    │ │
│   │ Descanso 60-90s │ │
│   └────────────────┘ │
│                      │
│   Qual seu nível?    │
│                      │
│   ┌────────┐┌────────┐│
│   │ 🌱     ││ 🌿     ││
│   │ Inic.  ││ Inter. ││
│   └────────┘└────────┘│
│   ┌────────┐          │
│   │ 🌳     │          │
│   │ Avanç. │          │
│   └────────┘          │
│                      │
│   ─────────────────  │
│   Rotina sugerida:   │
│   PPL · 6x/semana    │
│                      │
│   [ COMEÇAR TREINOS ]│
└──────────────────────┘
```

## Cards de Objetivo

| Card | Descanso | Reps | Séries | Ícone |
|------|:--------:|:----:|:------:|:-----:|
| 💪 Força | 2-5 min | 5-8 | 3-5 | 💪 |
| 🔱 Hipertrofia | 60-90s | 8-15 | 3-4 | 🔱 |
| 💨 Resistência | 30-60s | 15-20+ | 2-3 | 💨 |
| ⚖️ Geral | 60-90s | 10-12 | 3 | ⚖️ |

## Cards de Nível

| Card | Descrição |
|------|-----------|
| 🌱 Iniciante | Menos exercícios, movimentos básicos |
| 🌿 Intermediário | Variedade moderada, progressão |
| 🌳 Avançado | Exercícios avançados, periodização |

## Sugestão de Rotina (automática)

| Objetivo | Iniciante | Intermediário | Avançado |
|----------|-----------|---------------|----------|
| Força | PPL | PPL+UP | Arnold Split |
| Hipertrofia | PPL | PPL+UP | Arnold Split |
| Resistência | UL | PPL | PPL+UP |
| Geral | PPL | PPL | PPL+UP |

## Comportamento
- 4 cards de objetivo: tap seleciona (borda verde destaca)
- 3 cards de nível: tap seleciona
- Abaixo, mostra "Rotina sugerida: [nome]" baseada na combinação
- Botão "Começar Treinos" desabilitado até objetivo + nível preenchidos
- Ao clicar:
  - Salva `user.preferences` (goal + level)
  - Salva rotina sugerida como `user.routine`
  - Navega para Home (MainTabs)
