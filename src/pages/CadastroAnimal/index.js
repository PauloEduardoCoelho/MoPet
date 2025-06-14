import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Footer from '../../components/footer';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { TextInputMask } from 'react-native-masked-text'; // Importando a biblioteca para máscara

export default function CadastroAnimal() {
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [idadeAnimal, setIdadeAnimal] = useState('');
  const [nomeTutor, setNomeTutor] = useState('');
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [racaAnimal, setRacaAnimal] = useState('');
  const [pesoAnimal, setPesoAnimal] = useState('');
  const [corAnimal, setCorAnimal] = useState('');
  const [cpfTutor, setCpfTutor] = useState('');
  const [imagem, setImagem] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [endereco, setEndereco] = useState('');
  const [loadingMapa, setLoadingMapa] = useState(false);

  const selecionarImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5
    });
    if (!result.canceled && result.assets.length > 0) {
      setImagem(result.assets[0]);
    }
  };

  const buscarCoordenadas = async () => {
    if (!endereco.trim()) return Alert.alert("Digite um endereço válido");
    setLoadingMapa(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json`,
        {
          headers: {
            'User-Agent': 'MoPetApp/1.0',
            'Accept-Language': 'pt-BR'
          }
        }
      );
      const data = await response.json();
      if (data.length > 0) {
        setLocalizacao({
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        });
      } else {
        Alert.alert("Endereço não encontrado");
      }
    } catch (err) {
      Alert.alert("Erro ao buscar localização", err.message);
    } finally {
      setLoadingMapa(false);
    }
  };

  const aoSalvar = async () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nomeAnimal || !tipoAnimal || !cpfTutor || !localizacao || !imagem) {
      return Alert.alert("Preencha os campos obrigatórios");
    }

    // Corrigir formato do tipo (para garantir que seja "Cachorro" ou "Gato")
    const tipoAnimalFormatted = tipoAnimal.charAt(0).toUpperCase() + tipoAnimal.slice(1);

    // Corrige formatação de raca, remove espaços e coloca hífen
    const racaAnimalFormatted = racaAnimal.trim().replace(/\s+/g, '-');

    const token = await SecureStore.getItemAsync('token');
    if (!token) return Alert.alert("Usuário não autenticado");

    const dados = {
      nome: nomeAnimal,
      idade: idadeAnimal,
      tipo: tipoAnimalFormatted,  // Envia o valor corrigido para tipo
      raca: racaAnimalFormatted,  // Envia o valor corrigido para raca
      peso: pesoAnimal,
      cor: corAnimal,
      nomeTutor,
      cpfTutor,
      dataCadastro: new Date().toLocaleDateString(),
      imagem: imagem.base64,
      localizacao,
    };

    console.log("Dados enviados:", dados); // Verifique os dados enviados no console

    try {
      const response = await api.post('/pets', dados, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Resposta do servidor:", response.data); // Verifique a resposta do servidor
      Alert.alert("Cadastro realizado com sucesso!");

      // Resetar formulário
      setNomeAnimal('');
      setIdadeAnimal('');
      setTipoAnimal('');
      setRacaAnimal('');
      setPesoAnimal('');
      setCorAnimal('');
      setNomeTutor('');
      setCpfTutor('');
      setImagem(null);
      setEndereco('');
      setLocalizacao(null);
    } catch (err) {
      console.error("Erro ao salvar no banco:", err.response?.data); // Exibe detalhes do erro
      Alert.alert("Erro ao salvar no banco", err.response?.data?.error || "Erro desconhecido");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text animation="fadeInLeft" delay={300} style={styles.headerTitle}>
          Cadastrar Animal
        </Animatable.Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Nome do Animal:</Text>
          <TextInput style={styles.input} value={nomeAnimal} onChangeText={setNomeAnimal} placeholder="Ex: Thor" />

          <Text style={styles.label}>Tipo do Animal:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, tipoAnimal === 'cachorro' && styles.radioButtonSelected]}
              onPress={() => setTipoAnimal('cachorro')}
            >
              <Icon name="dog" size={24} color={tipoAnimal === 'cachorro' ? '#FFF' : '#D69A3A'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, tipoAnimal === 'gato' && styles.radioButtonSelected]}
              onPress={() => setTipoAnimal('gato')}
            >
              <Icon name="cat" size={24} color={tipoAnimal === 'gato' ? '#FFF' : '#D69A3A'} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Raça:</Text>
          <TextInput style={styles.input} value={racaAnimal} onChangeText={setRacaAnimal} placeholder="Ex: Vira-lata" />

          <Text style={styles.label}>Peso (kg):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={pesoAnimal} onChangeText={setPesoAnimal} />

          <Text style={styles.label}>Cor:</Text>
          <TextInput style={styles.input} value={corAnimal} onChangeText={setCorAnimal} />

          <Text style={styles.label}>Idade:</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={idadeAnimal} onChangeText={setIdadeAnimal} />

          <Text style={styles.label}>Nome do Tutor:</Text>
          <TextInput style={styles.input} value={nomeTutor} onChangeText={setNomeTutor} />

          <Text style={styles.label}>CPF do Tutor:</Text>
          <TextInputMask
            type={'cpf'}
            value={cpfTutor}
            onChangeText={setCpfTutor}
            style={styles.input}
            placeholder="Digite o CPF"
          />

          <Text style={styles.label}>Foto do Animal:</Text>
          <View style={styles.imageContainer}>
            {imagem ? (
              <Image source={{ uri: imagem.uri }} style={styles.imagem} />
            ) : (
              <View style={styles.emptyImage}><Text>Nenhuma imagem</Text></View>
            )}
          </View>

          <TouchableOpacity style={styles.selectButton} onPress={selecionarImagem}>
            <Text style={styles.textoBotao}>Selecionar Imagem</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Endereço:</Text>
          <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Digite o endereço..." />

          <TouchableOpacity style={styles.botao} onPress={buscarCoordenadas}>
            <Text style={styles.textoBotao}>Buscar Localização</Text>
          </TouchableOpacity>

          {loadingMapa && <ActivityIndicator size="large" color="#D69A3A" style={{ marginTop: 10 }} />}

          {localizacao && (
            <MapView
              style={styles.mapa}
              initialRegion={{
                ...localizacao,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={localizacao} />
            </MapView>
          )}

          <TouchableOpacity style={[styles.botao, { marginTop: 20 }]} onPress={aoSalvar}>
            <Text style={styles.textoBotao}>Salvar Cadastro</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Footer />
    </View>
  );
}
