import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import { resetPassword } from '../../services/authService';

export default function ResetPassword({ route, navigation }) {
  const email = route?.params?.email || '';
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  async function onSubmit() {
    try {
      if (!code.trim() || !newPassword.trim()) {
        return Alert.alert('Preencha o código e a nova senha.');
      }
      if (newPassword !== confirm) {
        return Alert.alert('As senhas não coincidem.');
      }
      await resetPassword({ email, code: code.trim(), newPassword });
      Alert.alert('Pronto!', 'Sua senha foi alterada.', [
        { text: 'OK', onPress: () => navigation.replace('SignIn') }
      ]);
    } catch (e) {
      const msg = e?.response?.data?.error || 'Não foi possível redefinir a senha.';
      Alert.alert('Atenção', msg);
    }
  }

  return (
    <HeaderLayout title="Definir nova senha" scroll>
      <Text style={styles.label}>Email</Text>
      <TextInput style={[styles.input, { backgroundColor: '#f3f4f6' }]} value={email} editable={false} />

      <Text style={styles.label}>Código recebido</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Ex: 483921"
        placeholderTextColor="#9EA0A4"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="••••••••"
        placeholderTextColor="#9EA0A4"
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar nova senha</Text>
      <TextInput
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
        placeholder="••••••••"
        placeholderTextColor="#9EA0A4"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Redefinir</Text>
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