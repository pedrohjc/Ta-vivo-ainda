import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import VerificationScreen from './screens/VerificationScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const AUTH_STORAGE_KEY = '@ta_vivo_ainda:user';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateVerificationCode = () => {
    // Gerar código de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleVerifyEmail = (data) => {
    // Salvar dados temporários da verificação
    setVerificationData(data);
  };

  const handleResendCode = async () => {
    if (!verificationData) return;
    
    // Gerar novo código
    const newCode = generateVerificationCode();
    
    // Em produção, aqui você enviaria o novo código por email
    console.log('Novo código de verificação:', newCode);
    
    // Atualizar código na verificação
    setVerificationData({
      ...verificationData,
      verificationCode: newCode,
    });
    
    Alert.alert(
      'Código Reenviado',
      `Novo código enviado para ${verificationData.email}\n\nPara teste, o código é: ${newCode}\n\n(Em produção, isso será enviado por email)`
    );
  };

  const handleVerify = async () => {
    if (!verificationData) return;
    
    try {
      // Em produção, aqui você validaria o código no backend
      // Por enquanto, apenas faz login após verificação
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        email: verificationData.email,
        name: verificationData.name,
        loginMethod: 'email',
      }));
      
      setUser({
        email: verificationData.email,
        name: verificationData.name,
        loginMethod: 'email',
      });
      
      setVerificationData(null);
    } catch (error) {
      console.error('Erro ao salvar autenticação:', error);
      Alert.alert('Erro', 'Não foi possível completar o cadastro');
    }
  };

  const handleCancelVerification = () => {
    setVerificationData(null);
  };

  const handleLogin = async (userData) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erro ao salvar autenticação:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setVerificationData(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (verificationData) {
    return (
      <VerificationScreen
        email={verificationData.email}
        verificationCode={verificationData.verificationCode}
        onVerify={handleVerify}
        onResend={handleResendCode}
        onCancel={handleCancelVerification}
      />
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} onVerifyEmail={handleVerifyEmail} />;
  }

  if (showProfile) {
    return (
      <ProfileScreen
        user={user}
        onBack={() => setShowProfile(false)}
      />
    );
  }

  return (
    <HomeScreen
      user={user}
      onLogout={handleLogout}
      onOpenProfile={() => setShowProfile(true)}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
