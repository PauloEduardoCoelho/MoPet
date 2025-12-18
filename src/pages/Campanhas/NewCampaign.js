import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import { createCampaign } from '../../services/campaignService';

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');

export default function NewCampaign({ navigation }) {
  const [cep, setCep] = useState('');
  const [day, setDay] = useState('');      // YYYY-MM-DD
  const [time, setTime] = useState('');    // HH:mm ou HH:mm-HH:mm
  const [capacity, setCapacity] = useState('');

  // endereço vindo do ViaCEP
  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  // campos adicionais do local
  const [number, setNumber] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [reference, setReference] = useState('');

  async function fetchAddressByCep(raw) {
    const cleaned = onlyDigits(raw);
    if (cleaned.length !== 8) return; // só busca com 8 dígitos

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();
      if (data.erro) {
        Alert.alert('CEP não encontrado', 'Verifique o CEP informado.');
        setAddress({ street: '', neighborhood: '', city: '', state: '' });
        return;
      }
      setAddress({
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar o endereço para este CEP.');
    }
  }

  async function onSave() {
    try {
      if (!cep || !day || !time || !capacity) {
        return Alert.alert('Atenção', 'Preencha CEP, Dia, Hora e Capacidade.');
      }

      const payload = {
        cep: onlyDigits(cep),
        day,
        time,
        capacity: Number(capacity),
        address,      // rua, cidade, estado
        number,       // número informado
        placeName,    // nome do lugar
        reference     // ponto de referência
      };

      await createCampaign(payload);
      Alert.alert('Sucesso', 'Campanha criada!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao criar campanha.';
      Alert.alert('Atenção', msg);
    }
  }

  return (
    <HeaderLayout title="Nova Campanha" scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={(t) => setCep(onlyDigits(t).slice(0, 8))}
          onBlur={() => fetchAddressByCep(cep)}
          placeholder="Ex: 01310940"
          keyboardType="numeric"
        />

        {(address.street || address.neighborhood || address.city || address.state) ? (
          <View style={styles.addressBox}>
            <Text style={styles.addressLine}>
              {address.street || '—'}{address.neighborhood ? `, ${address.neighborhood}` : ''}
            </Text>
            <Text style={styles.addressLine}>
              {address.city || '—'}{address.state ? ` / ${address.state}` : ''}
            </Text>
          </View>
        ) : (
          <Text style={styles.hint}>Informe o CEP e saia do campo para buscar o endereço (ViaCEP).</Text>
        )}

        <Text style={styles.label}>Número</Text>
        <TextInput
          style={styles.input}
          value={number}
          onChangeText={setNumber}
          placeholder="Ex: 120"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nome do Lugar</Text>
        <TextInput
          style={styles.input}
          value={placeName}
          onChangeText={setPlaceName}
          placeholder="Ex: Escola Municipal João Silva"
        />

        <Text style={styles.label}>Ponto de Referência</Text>
        <TextInput
          style={styles.input}
          value={reference}
          onChangeText={setReference}
          placeholder="Ex: Próximo à praça central"
        />

        <Text style={styles.hint}>Dia (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={day}
          onChangeText={setDay}
          placeholder="Ex: 2025-11-27"
          autoCapitalize="none"
        />

        <Text style={styles.hint}>Hora (HH:mm ou HH:mm-HH:mm)</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Ex: 09:00-16:00"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Capacidade (máx. de animais)</Text>
        <TextInput
          style={styles.input}
          value={capacity}
          onChangeText={(t) => setCapacity(onlyDigits(t))}
          placeholder="Ex: 120"
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={onSave}>
          <Text style={styles.buttonText}>Criar campanha</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', color: '#333', marginTop: 12 },
  hint: { color: '#666', marginTop: 12 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 6, color: '#222'
  },
  addressBox: {
    backgroundColor: '#FFF3DC',
    borderColor: '#F3D29D',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8
  },
  addressLine: { color: '#6A4D15' },
  button: { backgroundColor: '#D69A3A', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 18 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});