import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import styles from './styles';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditPet() {
  const route = useRoute();
  const navigation = useNavigation();
  const { pet } = route.params;

  const [nomeAnimal, setNomeAnimal] = useState(pet.nomeAnimal || '');
  const [nomeTutor, setNomeTutor] = useState(pet.nomeTutor || '');
  const [cpfTutor, setCpfTutor] = useState(pet.cpfTutor || '');
  const [racaAnimal, setRacaAnimal] = useState(pet.racaAnimal || '');
  const [tipoAnimal, setTipoAnimal] = useState(pet.tipoAnimal || '');
  const [idadeAnimal, setIdadeAnimal] = useState(String(pet.idadeAnimal || ''));
  const [pesoAnimal, setPesoAnimal] = useState(String(pet.pesoAnimal || ''));
  const [corAnimal, setCorAnimal] = useState(pet.corAnimal || '');

  const handleAtualizar = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await api.put(`/api/pets/${pet._id}`, {
        nomeAnimal,
        nomeTutor,
        cpfTutor,
        racaAnimal,
        tipoAnimal,
        idadeAnimal,
        pesoAnimal,
        corAnimal,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Sucesso', 'Informações atualizadas!');
      navigation.navigate('AnimalList');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.headerTitle}>Editar Pet</Text>

          <Text style={styles.label}>Nome do Animal:</Text>
          <TextInput style={styles.input} value={nomeAnimal} onChangeText={setNomeAnimal} />

          <Text style={styles.label}>Tipo do Animal:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                tipoAnimal === 'cachorro' && styles.radioButtonSelected
              ]}
              onPress={() => setTipoAnimal('cachorro')}
            >
              <Text style={[
                styles.radioText,
                tipoAnimal === 'cachorro' && styles.radioTextSelected
              ]}>
                Cachorro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                tipoAnimal === 'gato' && styles.radioButtonSelected
              ]}
              onPress={() => setTipoAnimal('gato')}
            >
              <Text style={[
                styles.radioText,
                tipoAnimal === 'gato' && styles.radioTextSelected
              ]}>
                Gato
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Raça:</Text>
          <TextInput style={styles.input} value={racaAnimal} onChangeText={setRacaAnimal} />

          <Text style={styles.label}>Peso (kg):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={pesoAnimal} onChangeText={setPesoAnimal} />

          <Text style={styles.label}>Cor:</Text>
          <TextInput style={styles.input} value={corAnimal} onChangeText={setCorAnimal} />

          <Text style={styles.label}>Idade:</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={idadeAnimal} onChangeText={setIdadeAnimal} />

          <Text style={styles.label}>Nome do Tutor:</Text>
          <TextInput style={styles.input} value={nomeTutor} onChangeText={setNomeTutor} />

          <Text style={styles.label}>CPF do Tutor:</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={cpfTutor} onChangeText={setCpfTutor} />

          <TouchableOpacity style={[styles.botao, { marginTop: 20 }]} onPress={handleAtualizar}>
            <Text style={styles.textoBotao}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}