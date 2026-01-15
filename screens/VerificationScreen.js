import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function VerificationScreen({ email, verificationCode, onVerify, onResend, onCancel }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showCode, setShowCode] = useState(true); // Mostrar código para testes
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focar no primeiro input quando a tela carregar
    if (inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0].focus(), 100);
    }
  }, []);

  useEffect(() => {
    // Countdown para reenvio
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (value, index) => {
    // Aceitar apenas números
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length > 1) {
      // Se colar múltiplos dígitos
      const digits = numericValue.slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      
      // Focar no próximo input disponível
      const nextIndex = Math.min(index + digits.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Mover para o próximo input automaticamente
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Voltar para o input anterior ao apagar
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join('');
    
    if (codeString.length !== 6) {
      Alert.alert('Atenção', 'Por favor, preencha todos os 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      // Verificar se o código está correto
      if (codeString === verificationCode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        onVerify();
      } else {
        Alert.alert('Código inválido', 'O código inserido está incorreto. Tente novamente.');
        // Limpar os campos
        setCode(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar o código');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) {
      return;
    }

    setResendLoading(true);
    try {
      await onResend();
      setCountdown(60);
      Alert.alert('Sucesso', 'Novo código enviado para seu email!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível reenviar o código');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verificação de Email</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de 6 dígitos para
          </Text>
          <Text style={styles.email}>{email}</Text>
          
          {/* Mostrar código para testes - remover em produção */}
          {showCode && (
            <View style={styles.testCodeContainer}>
              <Text style={styles.testCodeLabel}>Código de teste (desenvolvimento):</Text>
              <TouchableOpacity
                style={styles.testCodeBox}
                onPress={() => {
                  // Preencher automaticamente o código
                  const digits = verificationCode.split('');
                  setCode(digits);
                  // Focar no último input
                  if (inputRefs.current[5]) {
                    inputRefs.current[5].focus();
                  }
                }}
              >
                <Text style={styles.testCode}>{verificationCode}</Text>
              </TouchableOpacity>
              <Text style={styles.testCodeHint}>
                Toque no código para preencher automaticamente
              </Text>
              <TouchableOpacity
                style={styles.hideCodeButton}
                onPress={() => setShowCode(false)}
              >
                <Text style={styles.hideCodeText}>Ocultar código</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {!showCode && (
            <TouchableOpacity
              style={styles.showCodeButton}
              onPress={() => setShowCode(true)}
            >
              <Text style={styles.showCodeText}>Mostrar código de teste</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verificar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Não recebeu o código?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={countdown > 0 || resendLoading}
            style={styles.resendButton}
          >
            {resendLoading ? (
              <ActivityIndicator size="small" color="#2196F3" />
            ) : (
              <Text style={[
                styles.resendButtonText,
                countdown > 0 && styles.resendButtonTextDisabled
              ]}>
                {countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  codeInputFilled: {
    borderColor: '#2196F3',
    backgroundColor: '#f0f8ff',
  },
  verifyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  testCodeContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
    alignItems: 'center',
  },
  testCodeLabel: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 8,
    fontWeight: '600',
  },
  testCodeBox: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffc107',
    marginBottom: 8,
  },
  testCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#856404',
    letterSpacing: 4,
  },
  testCodeHint: {
    fontSize: 11,
    color: '#856404',
    textAlign: 'center',
    marginBottom: 8,
  },
  hideCodeButton: {
    padding: 4,
  },
  hideCodeText: {
    fontSize: 12,
    color: '#856404',
    textDecorationLine: 'underline',
  },
  showCodeButton: {
    marginTop: 16,
    padding: 8,
  },
  showCodeText: {
    fontSize: 14,
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});
