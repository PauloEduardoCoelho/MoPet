import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Image, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';
import HeaderLayout from '../../components/HeaderLayout';
import styles from './styles';
import { getMe } from '../../services/userService';

export default function CadastroAnimal({ navigation }) {
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [idadeAnimal, setIdadeAnimal] = useState('');
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [racaAnimal, setRacaAnimal] = useState('');
  const [pesoAnimal, setPesoAnimal] = useState('');
  const [pesoDesconhecido, setPesoDesconhecido] = useState(false);
  const [corAnimal, setCorAnimal] = useState('');
  const [imagem, setImagem] = useState(null);

  const [tutorNome, setTutorNome] = useState('');
  const [tutorCpf, setTutorCpf] = useState('');
  const [tutorTelefone, setTutorTelefone] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setTutorNome(me?.name ?? '');
        setTutorCpf(me?.cpf ?? '');
        setTutorTelefone(me?.phone ?? '');
      } catch {
      }
    })();
  }, []);

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets?.length) {
      setImagem(result.assets[0]);
    }
  };

  const aoSalvar = async () => {
    if (!nomeAnimal || !tipoAnimal || !imagem) {
      return Alert.alert('Atenção', 'Preencha pelo menos: Nome, Tipo e Foto.');
    }

    const token = await SecureStore.getItemAsync('token');
    if (!token) return Alert.alert('Sessão expirada', 'Faça login novamente.');

    const tipoNormalizado =
      tipoAnimal?.toLowerCase() === 'gato' ? 'Gato' :
      tipoAnimal?.toLowerCase() === 'cachorro' ? 'Cachorro' : '';

    const dados = {
      nome: nomeAnimal.trim(),
      idade: idadeAnimal?.toString().trim(),
      tipo: tipoNormalizado,
      raca: racaAnimal.trim(),
      ...(pesoDesconhecido ? {} : { peso: pesoAnimal?.toString().trim() }),
      cor: corAnimal.trim(),
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
      imagem: imagem.base64,

      ...(tutorNome ? { nomeTutor: tutorNome } : {}),
      ...(tutorCpf ? { cpfTutor: tutorCpf } : {}),
      ...(tutorTelefone ? { telefoneTutor: tutorTelefone } : {}),
    };

    try {
      await api.post('/pets', dados, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setNomeAnimal('');
            setIdadeAnimal('');
            setTipoAnimal('');
            setRacaAnimal('');
            setPesoAnimal('');
            setPesoDesconhecido(false);
            setCorAnimal('');
            setImagem(null);
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      console.error('Erro ao salvar no banco:', err.response?.data || err.message);
      const msg = err.response?.data?.error || 'Erro ao salvar no banco';
      Alert.alert('Erro', msg);
    }
  };

  return (
    <HeaderLayout title="Cadastrar Animal" scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Nome do Animal</Text>
          <TextInput
            style={styles.input}
            value={nomeAnimal}
            onChangeText={setNomeAnimal}
            placeholder="Ex: Thor"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Tipo do Animal</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, tipoAnimal === 'cachorro' && styles.radioButtonSelected]}
              onPress={() => setTipoAnimal('cachorro')}
            >
              <Icon name="dog" size={24} color={tipoAnimal === 'cachorro' ? '#FFF' : '#D69A3A'} />
              <Text style={[styles.radioText, tipoAnimal === 'cachorro' && styles.radioTextSelected]}>
                Cachorro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radioButton, tipoAnimal === 'gato' && styles.radioButtonSelected]}
              onPress={() => setTipoAnimal('gato')}
            >
              <Icon name="cat" size={24} color={tipoAnimal === 'gato' ? '#FFF' : '#D69A3A'} />
              <Text style={[styles.radioText, tipoAnimal === 'gato' && styles.radioTextSelected]}>
                Gato
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Raça</Text>
          <TextInput
            style={styles.input}
            value={racaAnimal}
            onChangeText={setRacaAnimal}
            placeholder="Ex: Vira-lata"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Peso (kg)</Text>
          <View style={{ gap: 8 }}>
            <TextInput
              style={[styles.input, pesoDesconhecido && styles.disabledInput]}
              keyboardType="numeric"
              value={pesoAnimal}
              onChangeText={setPesoAnimal}
              placeholder="Ex: 7.5"
              placeholderTextColor="#9EA0A4"
              editable={!pesoDesconhecido}
            />
            <TouchableOpacity
              style={[styles.unknownChip, pesoDesconhecido && styles.unknownChipOn]}
              onPress={() => setPesoDesconhecido(!pesoDesconhecido)}
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
            value={corAnimal}
            onChangeText={setCorAnimal}
            placeholder="Ex: Caramelo"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Idade (anos)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={idadeAnimal}
            onChangeText={setIdadeAnimal}
            placeholder="Ex: 3"
            placeholderTextColor="#9EA0A4"
          />

          <Text style={styles.label}>Foto do Animal</Text>
          <View style={styles.imageContainer}>
            {imagem ? (
              <Image source={{ uri: imagem.uri }} style={styles.imagem} />
            ) : (
              <View style={styles.emptyImage}>
                <Text style={styles.emptyImageText}>Nenhuma imagem</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.selectButton} onPress={selecionarImagem}>
            <Text style={styles.textoBotao}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, { marginTop: 20 }]} onPress={aoSalvar}>
            <Text style={styles.textoBotao}>Salvar Cadastro</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </HeaderLayout>
  );
}