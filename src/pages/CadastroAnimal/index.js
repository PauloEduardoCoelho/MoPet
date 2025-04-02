// CadastroAnimalScreen.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { DateTimePickerAndroid } from 'react-native';

export default function CadastroAnimalScreen() {
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [nomeTutor, setNomeTutor] = useState('');
  const [cpfTutor, setCpfTutor] = useState('');
  const [data, setData] = useState(new Date());
  const [imagem, setImagem] = useState(null);
  const [localizacao, setLocalizacao] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para usar a câmera é necessária!');
      }
    })();
  }, []);

  const selecionarImagem = async () => {
    let resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const abrirDatePicker = () => {
    DateTimePickerAndroid.open({
      value: data,
      onChange: (event, selectedDate) => {
        if (selectedDate) setData(selectedDate);
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const aoMarcarMapa = (evento) => {
    setLocalizacao(evento.nativeEvent.coordinate);
  };

  const aoSalvar = () => {
    const dados = {
      nomeAnimal,
      nomeTutor,
      cpfTutor,
      data: data.toLocaleDateString(),
      imagem,
      localizacao,
    };
    console.log('Dados cadastrados:', dados);
    alert('Cadastro realizado com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Animal:</Text>
      <TextInput style={styles.input} value={nomeAnimal} onChangeText={setNomeAnimal} />

      <Text style={styles.label}>Nome do Tutor:</Text>
      <TextInput style={styles.input} value={nomeTutor} onChangeText={setNomeTutor} />

      <Text style={styles.label}>CPF do Tutor:</Text>
      <TextInput
        style={styles.input}
        value={cpfTutor}
        onChangeText={setCpfTutor}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity style={styles.botao} onPress={abrirDatePicker}>
        <Text style={styles.textoBotao}>Selecionar Data</Text>
      </TouchableOpacity>
        <Text style={styles.dataTexto}>{data.toLocaleDateString()}</Text>

        <Text style={styles.label}>Foto do Animal:</Text>
      <TouchableOpacity style={styles.botao} onPress={selecionarImagem}>
        <Text style={styles.textoBotao}>Tirar Foto</Text>
      </TouchableOpacity>
      {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}


      <Text style={styles.label}>Marcar Localização no Mapa:</Text>
      <MapView
        style={styles.mapa}
        initialRegion={{
          ...localizacao,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={aoMarcarMapa}
      >
        <Marker coordinate={localizacao} />
      </MapView>

      <TouchableOpacity style={styles.botao} onPress={aoSalvar}>
        <Text style={styles.textoBotao}>Salvar Cadastro</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  dataTexto: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  imagem: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 6,
  },
  mapa: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  botao: {
    backgroundColor: '#D69A3A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },  
});
