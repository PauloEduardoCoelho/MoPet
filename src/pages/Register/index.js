import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';

export default function Register() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister() {
    try {
      if (!name || !email || !password) {
        return Alert.alert('Atenção', 'Nome, email e senha são obrigatórios.');
      }
      await api.post('/auth/register', { name, email, password, cpf, phone });
      Alert.alert('Sucesso', 'Conta criada!', [
        { text: 'OK', onPress: () => navigation.navigate('SignIn') }
      ]);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao registrar.';
      Alert.alert('Erro', msg);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Criar conta</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Nome</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor="#aaa" />

          <Text style={styles.title}>CPF (opcional)</Text>
          <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" placeholderTextColor="#aaa" keyboardType="numeric" />

          <Text style={styles.title}>Telefone (opcional)</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="(XX) 9XXXX-XXXX" placeholderTextColor="#aaa" keyboardType="phone-pad" />

          <Text style={styles.title}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.title}>Senha</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Sua senha" placeholderTextColor="#aaa" secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Criar conta</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </KeyboardAvoidingView>
  );
}