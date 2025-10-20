import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';

export default function AlterarSenha() {
  const [curr, setCurr] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <HeaderLayout title="Alterar Senha" scroll>
      <Text style={styles.title}>Por segurança, informe sua senha atual e defina uma nova.</Text>

      <TextInput style={styles.input} placeholder="Senha atual" secureTextEntry value={curr} onChangeText={setCurr} />
      <TextInput style={styles.input} placeholder="Nova senha" secureTextEntry value={next} onChangeText={setNext} />
      <TextInput style={styles.input} placeholder="Confirmar nova senha" secureTextEntry value={confirm} onChangeText={setConfirm} />

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Salvar nova senha</Text>
      </TouchableOpacity>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, color: '#333', marginBottom: 16, fontWeight: '600' },
  input: { backgroundColor: '#F2F2F2', height: 48, borderRadius: 10, paddingHorizontal: 12, marginBottom: 14 },
  btn: { backgroundColor: '#D69A3A', height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});