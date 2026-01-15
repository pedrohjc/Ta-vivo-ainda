import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ta_vivo_ainda:last_pressed';

export default function App() {
  const [lastPressedDate, setLastPressedDate] = useState(null);
  const [isPressedToday, setIsPressedToday] = useState(false);

  useEffect(() => {
    checkLastPressed();
  }, []);

  const checkLastPressed = async () => {
    try {
      const storedDate = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDate) {
        const date = new Date(storedDate);
        setLastPressedDate(date);
        setIsPressedToday(isToday(date));
      }
    } catch (error) {
      console.error('Erro ao verificar última data:', error);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePress = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem(STORAGE_KEY, now.toISOString());
      setLastPressedDate(now);
      setIsPressedToday(true);
      
      Alert.alert(
        'Confirmado!',
        'Você confirmou que está vivo hoje!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao salvar data:', error);
      Alert.alert('Erro', 'Não foi possível salvar a confirmação.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Tá Vivo Ainda</Text>
        <Text style={styles.subtitle}>
          Confirme que você está vivo hoje
        </Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status de hoje:</Text>
          <Text style={[
            styles.statusText,
            isPressedToday ? styles.statusConfirmed : styles.statusPending
          ]}>
            {isPressedToday ? '✓ Confirmado' : '✗ Pendente'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Última confirmação:</Text>
          <Text style={styles.infoText}>{formatDate(lastPressedDate)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isPressedToday && styles.buttonPressed
          ]}
          onPress={handlePress}
          disabled={isPressedToday}
        >
          <Text style={styles.buttonText}>
            {isPressedToday ? 'Já confirmado hoje!' : 'Estou Vivo!'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
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
  statusLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusConfirmed: {
    color: '#4CAF50',
  },
  statusPending: {
    color: '#FF9800',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
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
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonPressed: {
    backgroundColor: '#9E9E9E',
    shadowColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
