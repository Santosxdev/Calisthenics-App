# Requisitos Funcionais

## RF1 — Login
- RF1.1 O sistema deve permitir que o usuário insira seu nome
- RF1.2 O sistema deve reconhecer usuários existentes e pular para Home
- RF1.3 Se novo usuário, deve redirecionar para PreferencesScreen

## RF2 — Preferências
- RF2.1 O sistema deve exibir 4 opções de objetivo: Força, Hipertrofia, Resistência, Geral
- RF2.2 O sistema deve exibir 3 opções de nível: Iniciante, Intermediário, Avançado
- RF2.3 O sistema deve sugerir uma rotina baseada no objetivo + nível
- RF2.4 O sistema deve salvar preferências do usuário localmente

## RF3 — Dashboard Home
- RF3.1 O sistema deve exibir o treino programado para o dia atual
- RF3.2 O sistema deve indicar se o dia é de descanso
- RF3.3 O sistema deve exibir o streak (dias consecutivos de treino)
- RF3.4 O sistema deve exibir o nível atual e barra de XP
- RF3.5 O sistema deve exibir um resumo da semana (dias de treino vs descanso)

## RF4 — Treino Ativo
- RF4.1 O sistema deve listar os exercícios do treino do dia
- RF4.2 O sistema deve permitir que o usuário registre séries com número de repetições
- RF4.3 O sistema deve permitir marcar cada série como concluída
- RF4.4 O sistema deve permitir marcar o exercício como concluído
- RF4.5 O sistema deve exibir um timer de descanso entre séries (baseado no objetivo do usuário)
- RF4.6 O sistema deve exibir um botão "Finalizar Treino" quando todos exercícios forem concluídos
- RF4.7 Ao finalizar, o sistema deve calcular XP e atualizar streak

## RF5 — Progresso e Conquistas
- RF5.1 O sistema deve exibir uma grade de achievements (conquistados e bloqueados)
- RF5.2 O sistema deve exibir o nível atual e progressão para o próximo nível
- RF5.3 O sistema deve exibir um calendário de streak
- RF5.4 O sistema deve exibir estatísticas (total treinos, total exercícios, etc.)

## RF6 — Perfil e Rotina
- RF6.1 O sistema deve exibir o nome do usuário e nível
- RF6.2 O sistema deve permitir trocar de rotina
- RF6.3 O sistema deve exibir a agenda semanal da rotina atual
- RF6.4 O sistema deve permitir resetar todos os dados

## RF7 — Persistência
- RF7.1 O sistema deve salvar todos os dados no AsyncStorage
- RF7.2 O sistema deve carregar os dados salvos ao iniciar
- RF7.3 O sistema deve recalcular streak baseado na data do último treino

## RF8 — Gamificação
- RF8.1 O sistema deve conceder XP ao completar um treino (50 base + bônus)
- RF8.2 O sistema deve gerenciar níveis de 1 a 50
- RF8.3 O sistema deve verificar e desbloquear achievements automaticamente
- RF8.4 O sistema deve conceder bônus de XP por streak (dias consecutivos)
