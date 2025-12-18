import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderLayout from '../../components/HeaderLayout';

export default function EditPet() {
  const route = useRoute();
  const navigation = useNavigation();
  const { pet } = route.params;

  // alinhar com o schema: nome, tipo, raca, peso, cor, idade
  const [nome, setNome]       = useState(pet?.nome ?? '');
  const [tipo, setTipo]       = useState((pet?.tipo || '').toLowerCase()); // 'gato' | 'cachorro'
  const [raca, setRaca]       = useState(pet?.raca ?? '');
  const [peso, setPeso]       = useState(pet?.peso ? String(pet.peso) : '');
  const [pesoDesconhecido, setPesoDesconhecido] = useState(!pet?.peso);
  const [cor, setCor]         = useState(pet?.cor ?? '');
  const [idade, setIdade]     = useState(pet?.idade ? String(pet.idade) : '');

  function normalizaTipo(t) {
    if (!t) return '';
    const low = String(t).toLowerCase();
    if (low === 'gato') return 'Gato';
    if (low === 'cachorro') return 'Cachorro';
    return '';
  }

  async function handleSalvar() {
    try {
      if (!nome?.trim()) return Alert.alert('Atenção', 'Informe o nome do animal.');
      if (!tipo)         return Alert.alert('Atenção', 'Selecione o tipo do animal.');

      const token = await SecureStore.getItemAsync('token');
      if (!token) return Alert.alert('Sessão expirada', 'Faça login novamente.');

      const payload = {
        nome: nome.trim(),
        tipo: normalizaTipo(tipo),
        raca: (raca || '').trim(),
        cor:  (cor  || '').trim(),
        idade: (idade || '').toString().trim(),
        // só envia 'peso' se o usuário souber
        ...(pesoDesconhecido ? {} : { peso: (peso || '').toString().trim() }),
      };

      await api.put(`/pets/${pet._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Sucesso', 'Informações atualizadas!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(), // MeusAnimais dá refresh com useIsFocused
        },
      ]);
    } catch (error) {
      console.error(error?.response?.data || error.message);
      const msg = error?.response?.data?.error || 'Não foi possível atualizar.';
      Alert.alert('Erro', msg);
    }
  }

  return (
    <HeaderLayout title="Editar Pet" scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Nome do Animal</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Thor"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Tipo do Animal</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, tipo === 'cachorro' && styles.radioButtonSelected]}
              onPress={() => setTipo('cachorro')}
              activeOpacity={0.8}
            >
              <Icon name="dog" size={22} color={tipo === 'cachorro' ? '#FFF' : '#D69A3A'} />
              <Text style={[styles.radioText, tipo === 'cachorro' && styles.radioTextSelected]}>
                Cachorro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioButton, tipo === 'gato' && styles.radioButtonSelected]}
              onPress={() => setTipo('gato')}
              activeOpacity={0.8}
            >
              <Icon name="cat" size={22} color={tipo === 'gato' ? '#FFF' : '#D69A3A'} />
              <Text style={[styles.radioText, tipo === 'gato' && styles.radioTextSelected]}>
                Gato
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Raça</Text>
          <TextInput
            style={styles.input}
            value={raca}
            onChangeText={setRaca}
            placeholder="Ex: Vira-lata"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <View style={{ gap: 8 }}>
            <TextInput
              style={[styles.input, pesoDesconhecido && styles.disabledInput]}
              keyboardType="numeric"
              value={peso}
              onChangeText={setPeso}
              placeholder="Ex: 7.5"
              placeholderTextColor="#9EA0A4"
              editable={!pesoDesconhecido}
            />
            <TouchableOpacity
              style={[styles.unknownChip, pesoDesconhecido && styles.unknownChipOn]}
              onPress={() => setPesoDesconhecido(prev => !prev)}
              activeOpacity={0.8}
            >
              <Icon
                name={pesoDesconhecido ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={pesoDesconhecido ? '#fff' : '#D69A3A'}
              />
              <Text style={[styles.unknownText, pesoDesconhecido && styles.unknownTextOn]}>
                Não sei informar
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Cor</Text>
          <TextInput
            style={styles.input}
            value={cor}
            onChangeText={setCor}
            placeholder="Ex: Caramelo"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Idade (anos)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={idade}
            onChangeText={setIdade}
            placeholder="Ex: 3"
            placeholderTextColor="#9EA0A4"
          />

          <TouchableOpacity style={[styles.botao, { marginTop: 20 }]} onPress={handleSalvar}>
            <Text style={styles.textoBotao}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </HeaderLayout>
  );
}