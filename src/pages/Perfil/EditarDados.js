import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import { getMe, updateMe } from '../../services/userService';

export default function EditarDados({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const u = await getMe();
        setName(u?.name ?? '');
        setEmail(u?.email ?? '');
        setPhone(u?.phone ?? '');
        setCpf(u?.cpf ?? '');
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar seus dados.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSave() {
    try {
      // Envia CPF apenas com dígitos (sem máscara/pontuação)
      const cleanCpf = (cpf || '').replace(/\D/g, '');

      const payload = {
        name: (name || '').trim(),
        email: (email || '').trim(),
        phone: (phone || '').trim(),
        cpf: cleanCpf || '' // envia vazio se quiser limpar/definir
      };

      await updateMe(payload);

      Alert.alert('Sucesso', 'Dados atualizados!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao atualizar.';
      Alert.alert('Atenção', msg);
    }
  }

  if (loading) {
    return (
      <HeaderLayout title="Editar dados">
        <View />
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout title="Editar dados" scroll>
      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
        placeholderTextColor="#9EA0A4"
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        placeholder="000.000.000-00"
        placeholderTextColor="#9EA0A4"
        keyboardType="numeric"
      />
      <Text style={styles.hint}>
        Você pode alterar o CPF somente uma vez. Caso já tenha alterado, não será possível mudar novamente.
      </Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        placeholderTextColor="#9EA0A4"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Telefone (opcional)</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="(XX) 9XXXX-XXXX"
        placeholderTextColor="#9EA0A4"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Salvar alterações</Text>
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
  hint: { fontSize: 12, color: '#8a8a8a', marginTop: 6 },
  button: {
    backgroundColor: '#D69A3A', borderRadius: 8, paddingVertical: 12,
    alignItems: 'center', marginTop: 18
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});