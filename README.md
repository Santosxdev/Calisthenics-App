# Workout Log — Calistenia Gamificada

Aplicativo mobile **React Native (Expo)** para registro de treinos de calistenia com rotinas pré-definidas, gamificação e parâmetros científicos de descanso. Projeto acadêmico para Android e iOS.

---

## Como Instalar e Executar

### Pré-requisitos

- Node.js v18+ instalado ([nodejs.org](https://nodejs.org))
- NPM ou Yarn (gerenciador de pacotes)
- Expo CLI: `npm install -g expo-cli`
- Celular com **Expo Go** (App Store / Google Play) ou emulador Android/iOS configurado

### Passo a Passo

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Santosxdev/Calisthenics-App.git
   cd Calisthenics-App
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Iniciar o projeto**
   ```bash
   npx expo start
   ```

4. **Abrir no celular**
   Escaneie o QR Code com o aplicativo **Expo Go**.

> O app não necessita de variáveis de ambiente — toda persistência é local via AsyncStorage.

---

## Stack

| Categoria | Escolha |
|-----------|---------|
| Framework | React Native + Expo |
| Navegação | @react-navigation (Stack + Bottom Tabs) |
| Estado | Context API + useReducer |
| Persistência | AsyncStorage |

---

## Lista de Requisitos Funcionais

| ID | Descrição | Tela | Prioridade |
|----|-----------|------|------------|
| RF-01 | O sistema deve permitir login do usuário pelo nome, reconhecendo usuários existentes no AsyncStorage | Login | Alta |
| RF-02 | O sistema deve redirecionar usuários novos para a tela de preferências | Login / Preferências | Alta |
| RF-03 | O usuário deve selecionar objetivo (Força, Hipertrofia, Resistência, Geral) e nível (Iniciante, Intermediário, Avançado) | Preferências | Alta |
| RF-04 | O sistema deve sugerir automaticamente uma rotina baseada no objetivo + nível do usuário | Preferências | Alta |
| RF-05 | O dashboard deve exibir saudação, nível, streak, barra de XP e o treino do dia | Home | Alta |
| RF-06 | O sistema deve exibir um calendário semanal com os treinos previstos da rotina atual | Home | Média |
| RF-07 | O usuário deve visualizar os exercícios do treino do dia com número de séries | Treino Ativo | Alta |
| RF-08 | O usuário deve registrar repetições e marcar séries como concluídas | Treino Ativo | Alta |
| RF-09 | O sistema deve exibir um timer de descanso científico ajustado ao objetivo do usuário entre as séries | Treino Ativo | Alta |
| RF-10 | O sistema deve exibir barra de progresso do treino em tempo real | Treino Ativo | Média |
| RF-11 | O sistema deve calcular XP, atualizar streak e verificar achievements ao finalizar o treino | Treino Ativo | Alta |
| RF-12 | O sistema deve exibir modal pós-treino com XP ganho, streak atual e novos achievements desbloqueados | Treino Ativo | Média |
| RF-13 | O usuário deve visualizar seu nível atual, barra de XP, grade de achievements e estatísticas acumuladas | Progresso | Alta |
| RF-14 | O sistema deve exibir calendário de streak dos últimos 30 dias | Progresso | Média |
| RF-15 | O usuário deve visualizar e editar seu nome | Perfil | Baixa |
| RF-16 | O usuário deve visualizar suas preferências atuais (objetivo + nível) | Perfil | Média |
| RF-17 | O usuário deve trocar de rotina entre as 4 disponíveis | Perfil | Alta |
| RF-18 | O usuário deve visualizar a agenda semanal da rotina atual | Perfil | Baixa |
| RF-19 | O usuário deve poder resetar todos os dados do app | Perfil | Média |
| RF-20 | O sistema deve persistir todos os dados localmente via AsyncStorage | Todas | Alta |

---

## Estrutura do Projeto

```
src/
├── navigation/          # Stack + Bottom Tabs
├── screens/             # 6 telas (Login, Preferências, Home, Treino Ativo, Progresso, Perfil)
├── components/          # 9 componentes reutilizáveis
├── context/             # Estado global (Context API + useReducer)
├── data/                # Exercícios, rotinas e achievements
├── services/            # Storage (AsyncStorage)
└── utils/               # Cálculo de XP, verificação de achievements, utilitários de data
```

---

## Base Científica

Os tempos de descanso seguem recomendações da literatura:

| Objetivo | Descanso | Referência |
|----------|:--------:|-----------|
| Força | 2-5 min | ATP-PC (Willardson, 2006) |
| Hipertrofia | 60-90s | Estresse metabólico (Schoenfeld, 2010) |
| Resistência | 30-60s | ACSM, 2021 |
| Geral | 60-90s | Equilíbrio entre sistemas |
