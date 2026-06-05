# Workout Log — Calistenia Gamificada

Aplicativo mobile **React Native (Expo)** para registro de treinos de calistenia com rotinas pré-definidas, gamificação e parâmetros científicos de descanso. Projeto acadêmico para Android e iOS.

## Funcionalidades

- **6 telas**: Login, Preferências, Home, Treino Ativo, Progresso, Perfil
- **Gamificação**: XP por treino, streaks, 8 achievements, 50 níveis
- **4 rotinas**: PPL, UL, PPL+UP, Arnold Split (sugestão automática por objetivo/nível)
- **Timer científico**: descanso baseado em ACSM, NSCA e Schoenfeld (2010)
- **Persistência local**: AsyncStorage mantém dados entre sessões
- **Tema escuro**: slate 900 + verde `#22c55e`

## Stack

| Categoria | Escolha |
|-----------|---------|
| Framework | React Native + Expo |
| Navegação | @react-navigation (Stack + Bottom Tabs) |
| Estado | Context API + useReducer |
| Persistência | AsyncStorage |

## Instalação

```bash
npm install
npx expo start
```

Escaneie o QR Code com o app **Expo Go** (Android/iOS).

## Estrutura

```
src/
├── navigation/
├── screens/          # 6 telas
├── components/       # 9 componentes reutilizáveis
├── context/          # Estado global
├── data/             # Exercícios, rotinas, achievements
├── services/         # Storage
└── utils/            # XP, achievements, datas
```

## Base Científica

| Objetivo | Descanso | Referência |
|----------|:--------:|-----------|
| Força | 2-5 min | ATP-PC (Willardson, 2006) |
| Hipertrofia | 60-90s | Estresse metabólico (Schoenfeld, 2010) |
| Resistência | 30-60s | ACSM, 2021 |
| Geral | 60-90s | Equilíbrio entre sistemas |
