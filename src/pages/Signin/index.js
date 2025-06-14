import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';
import * as LocalAuthentication from 'expo-local-authentication';
import styles from './styles';

export default function SignIn({ route }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userLogged } = route.params; 

  useEffect(() => {
    if (userLogged) {
      handleBiometricAuth(); 
    }
  }, [userLogged]);

  async function handleLogin() {
    try {
      const response = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('token', response.data.token);
      await SecureStore.setItemAsync('role', response.data.role);
      navigation.navigate('Home');
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao fazer login. Verifique seus dados.';
      Alert.alert('Falha no Login', msg);
    }
  }

  async function handleBiometricAuth() {
    const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (hasBiometrics) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se com sua biometria',
        cancelLabel: 'Usar senha',
      });

      if (result.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Falha na biometria', 'Tente novamente ou use a senha.');
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Bem-vindo(a)</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Email</Text>
          <TextInput 
            placeholder="Digite seu email..."
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.title}>Senha</Text>
          <TextInput 
            placeholder="Sua senha"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Acessar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonRegister}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </KeyboardAvoidingView>
  );
}
