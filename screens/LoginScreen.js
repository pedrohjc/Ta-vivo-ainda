import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ onLogin, onVerifyEmail }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Configuração do Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_GOOGLE_CLIENT_ID', // Será configurado depois
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication);
    } else if (response?.type === 'error') {
      Alert.alert('Erro', 'Não foi possível fazer login com Google');
    }
  }, [response]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Atenção', 'Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      // Simulação de login (substituir por autenticação real depois)
      // Por enquanto, aceita qualquer email/senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onLogin({
        email: email.trim(),
        name: name.trim() || email.trim().split('@')[0],
        loginMethod: 'email',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer login');
    } finally {
      setLoading(false);
    }
  };

  const generateVerificationCode = () => {
    // Gerar código de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Atenção', 'Por favor, insira um email válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      // Simulação de criação de conta e envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar código de verificação
      const verificationCode = generateVerificationCode();
      
      // Em produção, aqui você enviaria o código por email usando um serviço como:
      // - SendGrid
      // - AWS SES
      // - Firebase Cloud Functions
      // - Nodemailer
      
      // Por enquanto, vamos mostrar o código no console para debug
      // Em produção, aqui você enviaria o código por email real
      console.log('Código de verificação:', verificationCode);
      
      // Chamar callback para mostrar tela de verificação
      onVerifyEmail({
        email: email.trim(),
        name: name.trim(),
        password: password,
        verificationCode: verificationCode,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a conta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (authentication) => {
    setLoading(true);
    try {
      // Buscar informações do usuário do Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authentication.accessToken}`
      );
      const userInfo = await userInfoResponse.json();

      onLogin({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        loginMethod: 'google',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter informações do Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Tá Vivo Ainda</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Crie sua conta para começar' : 'Faça login para continuar'}
            </Text>
          </View>

          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder={isSignUp ? "Mínimo 6 caracteres" : "••••••••"}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.showPasswordText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {isSignUp && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.showPasswordText}>
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={isSignUp ? handleSignUp : handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              disabled={loading}
            >
              <Text style={styles.switchModeText}>
                {isSignUp
                  ? 'Já tem uma conta? Faça login'
                  : 'Não tem uma conta? Criar conta'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, loading && styles.googleButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={loading || !request}
            >
              <Text style={styles.googleButtonText}>🔐 Continuar com Google</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Ao continuar, você concorda com nossos termos de uso
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 16,
    top: 42,
    padding: 4,
  },
  showPasswordText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  footerText: {
    marginTop: 24,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
