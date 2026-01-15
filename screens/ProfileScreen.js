import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = '@ta_vivo_ainda:profile';

export default function ProfileScreen({ user, onBack }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bloodType: '',
    emergencyContact: '',
    emergencyPhone: '',
    hospital: '',
    allergies: '',
    medications: '',
    medicalConditions: '',
    insurance: '',
    doctorName: '',
    doctorPhone: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const savedProfile = JSON.parse(storedProfile);
        setProfile(prev => ({
          ...prev,
          ...savedProfile,
          // Manter o email do usuário atual, mas preservar o nome salvo no perfil
          email: user?.email || savedProfile.email,
          // Usar o nome salvo no perfil se existir, senão usar o do usuário
          name: savedProfile.name || user?.name || '',
        }));
      } else {
        // Se não tem perfil salvo, usar dados do usuário
        setProfile(prev => ({
          ...prev,
          name: user?.name || '',
          email: user?.email || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha seu nome');
      return;
    }

    if (!profile.emergencyContact.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o nome do contato de emergência');
      return;
    }

    if (!profile.emergencyPhone.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o telefone de emergência');
      return;
    }

    setLoading(true);
    try {
      // Salvar o perfil completo incluindo o nome
      const profileToSave = {
        ...profile,
        name: profile.name.trim(), // Garantir que o nome está sem espaços extras
      };
      
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileToSave));
      
      // Mostrar popup de confirmação
      Alert.alert(
        '✓ Perfil Atualizado',
        'Suas informações foram salvas com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Atualizar o estado local para garantir que está salvo
              setProfile(profileToSave);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              value={profile.name}
              onChangeText={(value) => updateField('name', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={profile.email}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Médicas</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo Sanguíneo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: O+, A-, AB+"
              value={profile.bloodType}
              onChangeText={(value) => updateField('bloodType', value.toUpperCase())}
              maxLength={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alergias</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Liste suas alergias (medicamentos, alimentos, etc.)"
              value={profile.allergies}
              onChangeText={(value) => updateField('allergies', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Medicamentos em Uso</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Liste os medicamentos que você toma regularmente"
              value={profile.medications}
              onChangeText={(value) => updateField('medications', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Condições Médicas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Diabetes, hipertensão, etc."
              value={profile.medicalConditions}
              onChangeText={(value) => updateField('medicalConditions', value)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato de Emergência</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Contato *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da pessoa de contato"
              value={profile.emergencyContact}
              onChangeText={(value) => updateField('emergencyContact', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone de Emergência *</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              value={profile.emergencyPhone}
              onChangeText={(value) => updateField('emergencyPhone', value)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Saúde</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hospital de Preferência</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do hospital"
              value={profile.hospital}
              onChangeText={(value) => updateField('hospital', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Plano de Saúde / Convênio</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do plano de saúde"
              value={profile.insurance}
              onChangeText={(value) => updateField('insurance', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Médico</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do seu médico de confiança"
              value={profile.doctorName}
              onChangeText={(value) => updateField('doctorName', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone do Médico</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              value={profile.doctorPhone}
              onChangeText={(value) => updateField('doctorPhone', value)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Salvar Perfil'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            * Campos obrigatórios
          </Text>
          <Text style={styles.footerText}>
            Estas informações são importantes em caso de emergência
          </Text>
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
  backButton: {
    padding: 8,
    minWidth: 80,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
});
