# Solução de Problemas - Conexão Expo Go

## Erro: "The request timed out"

Este erro geralmente acontece quando o celular não consegue se conectar ao servidor Expo no seu computador.

### Soluções (tente nesta ordem):

#### 1. Verificar se estão na mesma rede Wi-Fi
- **IMPORTANTE**: Seu celular e computador DEVEM estar na mesma rede Wi-Fi
- Verifique o nome da rede Wi-Fi em ambos os dispositivos
- Se estiverem em redes diferentes, conecte ambos na mesma rede

#### 2. Usar modo Tunnel (recomendado se a opção 1 não funcionar)
```bash
npm run start:tunnel
```
- Isso cria um túnel através da internet
- Pode ser mais lento, mas funciona mesmo em redes diferentes
- Requer conexão com internet em ambos os dispositivos

#### 3. Verificar Firewall do Windows
- O Windows Firewall pode estar bloqueando a conexão
- Quando o Expo iniciar, o Windows pode pedir permissão - **permita o acesso**
- Se não pedir, vá em:
  - Configurações > Firewall do Windows Defender
  - Permitir um aplicativo pelo Firewall
  - Procure por "Node.js" e marque as caixas para Rede Privada e Pública

#### 4. Usar modo LAN explicitamente
```bash
npm run start:lan
```
- Força o uso da rede local
- Certifique-se de que ambos estão na mesma rede

#### 5. Verificar IP do computador
- No terminal, execute: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
- Procure pelo endereço IPv4 (geralmente algo como 192.168.x.x)
- No Expo Go, você pode tentar conectar manualmente digitando o IP

#### 6. Reiniciar tudo
1. Feche o Expo Go no celular
2. Pare o servidor Expo (Ctrl+C no terminal)
3. Execute `npm start` novamente
4. Escaneie o QR code novamente

### Dica Extra
Se nada funcionar, você pode testar no navegador primeiro:
```bash
npm run web
```
Isso abre o app no navegador para verificar se o código está funcionando.
