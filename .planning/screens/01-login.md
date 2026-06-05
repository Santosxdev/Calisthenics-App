# LoginScreen

## Função
Primeira tela ao abrir o app. Usuário insere o nome para entrar. Se já usou antes, reconhece e pula para Home.

## Layout
```
┌──────────────────────┐
│                      │
│   🏋️ WORKOUT LOG     │
│                      │
│   Seu nome           │
│   ┌────────────────┐ │
│   │                │ │
│   │  ___________   │ │
│   │                │ │
│   └────────────────┘ │
│                      │
│   [ ENTRAR ]         │
│                      │
│   ─────────────────  │
│                      │
│   ℹ️ Digite seu nome │
│   para continuar     │
│                      │
└──────────────────────┘
```

## Comportamento
- Input de nome com placeholder "Seu nome"
- Botão "Entrar":
  - Se nome vazio ou < 2 caracteres: mostra erro "Nome deve ter ao menos 2 caracteres"
  - Busca `@kcal_user` no AsyncStorage
  - Se usuário existe → navega para Home (MainTabs)
  - Se não existe → cria novo usuário com nome → navega para PreferencesScreen
- Botão desabilitado enquanto input vazio

## Estados
- Normal: input + botão habilitado
- Erro: mensagem "Nome deve ter ao menos 2 caracteres" abaixo do input
- Carregando: botão mostra "Entrando..."
