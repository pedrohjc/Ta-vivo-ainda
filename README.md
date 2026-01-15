# Tá Vivo Ainda

Aplicativo mobile simples para confirmar diariamente que você está vivo.

## Funcionalidades

- Botão para confirmar que você está vivo
- Verificação se já foi confirmado hoje
- Armazenamento local da última confirmação
- Interface simples e intuitiva

## Como executar

### Pré-requisitos

- Node.js instalado
- Expo CLI instalado globalmente: `npm install -g expo-cli`
- Expo Go app no seu celular (iOS ou Android)

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

3. Escaneie o QR code com o app Expo Go no seu celular

### Scripts disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Inicia no Android
- `npm run ios` - Inicia no iOS
- `npm run web` - Inicia no navegador

## Tecnologias

- React Native
- Expo
- AsyncStorage (armazenamento local)
