import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ta_vivo_ainda:last_pressed';
const MODE_STORAGE_KEY = '@ta_vivo_ainda:view_mode';

export default function HomeScreen({ user, onLogout, onOpenProfile }) {
  const [lastPressedDate, setLastPressedDate] = useState(null);
  const [isPressedToday, setIsPressedToday] = useState(false);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);

  useEffect(() => {
    checkLastPressed();
    loadViewMode();
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

  const loadViewMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(MODE_STORAGE_KEY);
      if (savedMode !== null) {
        setIsSimplifiedMode(savedMode === 'true');
      }
    } catch (error) {
      console.error('Erro ao carregar modo de visualização:', error);
    }
  };

  const handleModeToggle = async (value) => {
    setIsSimplifiedMode(value);
    try {
      await AsyncStorage.setItem(MODE_STORAGE_KEY, value.toString());
    } catch (error) {
      console.error('Erro ao salvar modo de visualização:', error);
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

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {!isSimplifiedMode && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onOpenProfile} style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.welcomeText}>Olá, {user?.name || user?.email?.split('@')[0] || 'Usuário'}!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {!isSimplifiedMode && (
          <>
            <Text style={styles.title}>Tá Vivo Ainda?</Text>
            <Text style={styles.subtitle}>
              Confirme que você está vivo hoje
            </Text>
          </>
        )}

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status de hoje:</Text>
          <Text style={[
            styles.statusText,
            isPressedToday ? styles.statusConfirmed : styles.statusPending
          ]}>
            {isPressedToday ? '✓ Confirmado' : '✗ Pendente'}
          </Text>
        </View>

        {!isSimplifiedMode && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Última confirmação:</Text>
            <Text style={styles.infoText}>{formatDate(lastPressedDate)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            isSimplifiedMode && styles.buttonSimplified,
            isPressedToday && styles.buttonPressed
          ]}
          onPress={handlePress}
          disabled={isPressedToday}
        >
          <Text style={[
            styles.buttonText,
            isSimplifiedMode && styles.buttonTextSimplified
          ]}>
            {isPressedToday ? '✓' : 'Estou Vivo!'}
          </Text>
          {isPressedToday && (
            <Text style={[
              styles.buttonSubtext,
              isSimplifiedMode && styles.buttonSubtextSimplified
            ]}>
              Confirmado
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Toggle no canto inferior direito */}
      <View style={styles.modeToggleContainer}>
        <Text style={styles.modeToggleLabel}>
          {isSimplifiedMode ? 'Simplificado' : 'Padrão'}
        </Text>
        <Switch
          value={isSimplifiedMode}
          onValueChange={handleModeToggle}
          trackColor={{ false: '#ccc', true: '#4CAF50' }}
          thumbColor={isSimplifiedMode ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#ccc"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  logoutText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    maxWidth: 400,
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
    maxWidth: 400,
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
    backgroundColor: '#4CAF50',
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#45a049',
  },
  buttonPressed: {
    backgroundColor: '#9E9E9E',
    borderColor: '#757575',
    shadowColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  buttonSimplified: {
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  buttonTextSimplified: {
    fontSize: 36,
  },
  buttonSubtextSimplified: {
    fontSize: 20,
  },
  modeToggleContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modeToggleLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
});
