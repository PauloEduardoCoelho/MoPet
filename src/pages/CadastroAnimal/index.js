import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { DateTimePickerAndroid } from 'react-native';
import Footer from '../../components/footer';
import styles from './styles';

export default function CadastroAnimalScreen() {
    const [nomeAnimal, setNomeAnimal] = useState('');
    const [idadeAnimal, setIdadeAnimal] = useState('');
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
      try {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
          alert('Permissão de câmera negada. Ative nas configurações do dispositivo.');
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
    
        console.log('Resultado da câmera:', result); // debug
    
        if (!result.canceled && result.assets.length > 0) {
          setImagem(result.assets[0].uri);
        }
      } catch (error) {
        console.log('Erro ao abrir a câmera:', error);
        alert('Ocorreu um erro ao tentar abrir a câmera.');
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
        idadeAnimal,
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
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nome do Animal:</Text>
        <TextInput
          style={styles.input}
          value={nomeAnimal}
          onChangeText={setNomeAnimal}
          placeholder="Digite o nome do animal"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Idade do Animal:</Text>
        <TextInput
          style={styles.input}
          value={idadeAnimal}
          onChangeText={setIdadeAnimal}
          keyboardType="numeric"
          placeholder="Digite a idade do animal"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Nome do Tutor:</Text>
        <TextInput
          style={styles.input}
          value={nomeTutor}
          onChangeText={setNomeTutor}
          placeholder="Digite o nome do tutor"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>CPF do Tutor:</Text>
        <TextInput
          style={styles.input}
          value={cpfTutor}
          onChangeText={setCpfTutor}
          keyboardType="numeric"
          placeholder="Digite o CPF do tutor"
          placeholderTextColor="#aaa"
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
      <Footer />
    </View>
  );
}