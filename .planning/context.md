# Workout Log — Calistenia Gamificada

## Propósito
App mobile de registro de treinos de calistenia com rotinas pré-definidas, gamificação e progressão.

## Público
Praticantes de calistenia (iniciantes a intermediários) que querem seguir rotinas estruturadas e acompanhar evolução.

## Tech Stack
- React Native + Expo (Snack-ready)
- React Navigation (Stack + Bottom Tabs)
- Context API
- AsyncStorage
- Português

## Entrega Acadêmica
- Nome + Matrícula + Link Expo Snack
- 1 arquivo explicativo (CAPA, Visão Geral, Prints, Instalação, Requisitos)
- Mínimo 5 telas front-end

## Estrutura de Telas (6)
1. LoginScreen (nome + reconhecer usuário existente)
2. PreferencesScreen (objetivo + nível → rotina sugerida)
3. HomeScreen / Dashboard (treino de hoje, streak, XP)
4. ActiveWorkoutScreen (log de séries, timer científico, conclusão)
5. ProgressScreen (achievements, níveis, estatísticas)
6. ProfileScreen (perfil, trocar rotina, reset)

## Fluxo Principal
Login → (se 1ª vez) Preferences → Home → Treino Ativo → log séries → concluir → XP ↑ → Progresso

## Parâmetros Científicos (Objetivo → Descanso)
| Objetivo | Descanso entre séries | Reps | Séries |
|----------|----------------------|------|--------|
| Força | 2-5 min | 5-8 | 3-5 |
| Hipertrofia | 60-90s | 8-15 | 3-4 |
| Resistência | 30-60s | 15-20+ | 2-3 |
| Geral | 60-90s | 10-12 | 3 |
