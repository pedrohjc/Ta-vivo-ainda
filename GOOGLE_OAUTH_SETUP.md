# Configuração do Google OAuth

Para habilitar o login com Google, você precisa configurar as credenciais OAuth do Google.

## Passos para configurar:

1. **Acesse o Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Crie um novo projeto ou selecione um existente

2. **Habilite a API do Google+**
   - No menu lateral, vá em "APIs & Services" > "Library"
   - Procure por "Google+ API" e habilite

3. **Crie credenciais OAuth 2.0:**
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "OAuth client ID"
   - Escolha "Web application" para Web Client ID
   - Escolha "iOS" para iOS Client ID
   - Escolha "Android" para Android Client ID

4. **Configure os Client IDs no app:**
   - Edite o arquivo `screens/LoginScreen.js`
   - Substitua os placeholders:
     - `YOUR_GOOGLE_CLIENT_ID` → Expo Client ID
     - `YOUR_GOOGLE_IOS_CLIENT_ID` → iOS Client ID
     - `YOUR_GOOGLE_ANDROID_CLIENT_ID` → Android Client ID
     - `YOUR_GOOGLE_WEB_CLIENT_ID` → Web Client ID

5. **Configure o app.json:**
   - Adicione o `scheme` no `app.json`:
   ```json
   {
     "expo": {
       "scheme": "ta-vivo-ainda"
     }
   }
   ```

## Nota:
Por enquanto, o login com email/senha funciona como mock (aceita qualquer email/senha). 
Para produção, você precisará implementar um backend de autenticação real.
