# Tech Stack

| Categoria | Escolha | Motivo |
|-----------|---------|--------|
| Framework | React Native + Expo | Snack-ready, entrega via link |
| Linguagem | JavaScript (JSX) | Padrão Expo Snack |
| Navegação | @react-navigation/native + @react-navigation/bottom-tabs + @react-navigation/native-stack | Bottom tabs + stack |
| Estado Global | Context API + useReducer | Simples, sem dependências extras |
| Persistência | @react-native-async-storage/async-storage | Dados locais, sem backend |
| Timer | setInterval + useRef | Nativo, sem lib extra |

## Por que não...
- **Firebase**: Desnecessário, AsyncStorage resolve
- **Zustand/Redux**: Overkill para o escopo
- **Expo Router**: Pode ter incompatibilidades no Snack
- **Auth real**: O login é apenas um input de nome — sem backend
