import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import { forgotPassword } from '../../services/authService';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  async function onSubmit() {
    try {
      if (!email.trim()) return Alert.alert('Informe seu email');
      await forgotPassword(email.trim());
      Alert.alert(
        'Código enviado',
        'Enviamos um código para o seu email. Insira o código na próxima tela.',
        [{ text: 'OK', onPress: () => navigation.navigate('ResetPassword', { email: email.trim() }) }]
      );
    } catch (e) {
      const msg = e?.response?.data?.error || 'Não foi possível enviar o código.';
      Alert.alert('Atenção', msg);
    }
  }

  return (
    <HeaderLayout title="Recuperar Senha" scroll>
      <Text style={styles.label}>Email da sua conta</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#9EA0A4"
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Enviar código</Text>
      </TouchableOpacity>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', color: '#333', marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 6, color: '#222'
  },
  button: {
    backgroundColor: '#D69A3A', borderRadius: 8, paddingVertical: 12,
    alignItems: 'center', marginTop: 18
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});