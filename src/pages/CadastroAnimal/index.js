import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import Footer from '../../components/footer';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default function CadastroAnimal() {
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [idadeAnimal, setIdadeAnimal] = useState('');
  const [nomeTutor, setNomeTutor] = useState('');
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [racaAnimal, setRacaAnimal] = useState('');
  const [pesoAnimal, setPesoAnimal] = useState('');
  const [corAnimal, setCorAnimal] = useState('');
  const [cpfTutor, setCpfTutor] = useState('');
  const [data] = useState(new Date());
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
        alert('Permissão de câmera negada.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Erro ao abrir a câmera:', error);
    }
  };

  const escolherImagemGaleria = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Erro ao abrir galeria:', error);
    }
  };

  const aoMarcarMapa = (evento) => {
    setLocalizacao(evento.nativeEvent.coordinate);
  };

  const aoSalvar = () => {
    const dados = {
      nomeAnimal,
      idadeAnimal,
      tipoAnimal,
      racaAnimal,
      pesoAnimal,
      corAnimal,
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text animation="fadeInLeft" delay={300} style={styles.headerTitle}>
          Cadastrar Animal
        </Animatable.Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome do Animal:</Text>
        <TextInput style={styles.input} value={nomeAnimal} onChangeText={setNomeAnimal} placeholder="Digite o nome do animal" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Tipo do Animal:</Text>
        <View style={styles.radioGroup}>
      <TouchableOpacity
        style={[
          styles.radioButton,
          tipoAnimal === 'cachorro' && styles.radioButtonSelected
        ]}
        onPress={() => setTipoAnimal('cachorro')}
      >
        <Icon
          name="dog"
          size={24}
          color={tipoAnimal === 'cachorro' ? '#FFF' : '#D69A3A'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.radioButton,
          tipoAnimal === 'gato' && styles.radioButtonSelected
        ]}
        onPress={() => setTipoAnimal('gato')}
      >
        <Icon
          name="cat"
          size={24}
          color={tipoAnimal === 'gato' ? '#FFF' : '#D69A3A'}
        />
      </TouchableOpacity>
    </View>


        <Text style={styles.label}>Raça do Animal:</Text>
        <TextInput style={styles.input} value={racaAnimal} onChangeText={setRacaAnimal} placeholder="Digite a raça do animal" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Peso do Animal (kg):</Text>
        <TextInput style={styles.input} value={pesoAnimal} onChangeText={setPesoAnimal} keyboardType="numeric" placeholder="Digite o peso do animal" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Cor do Animal:</Text>
        <TextInput style={styles.input} value={corAnimal} onChangeText={setCorAnimal} placeholder="Digite a cor do animal" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Idade do Animal:</Text>
        <TextInput style={styles.input} value={idadeAnimal} onChangeText={setIdadeAnimal} keyboardType="numeric" placeholder="Digite a idade do animal" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Nome do Tutor:</Text>
        <TextInput style={styles.input} value={nomeTutor} onChangeText={setNomeTutor} placeholder="Digite o nome do tutor" placeholderTextColor="#aaa" />

        <Text style={styles.label}>CPF do Tutor:</Text>
        <TextInput style={styles.input} value={cpfTutor} onChangeText={setCpfTutor} keyboardType="numeric" placeholder="Digite o CPF do tutor" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Data do Cadastro:</Text>
        <TextInput style={[styles.input, styles.lockedInput]} value={data.toLocaleDateString()} editable={false} selectTextOnFocus={false} placeholderTextColor="#aaa" />

        <Text style={styles.label}>Foto do Animal:</Text>
        <View style={styles.imageContainer}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.imagem} />
          ) : (
            <View style={styles.emptyImage}>
              <Text style={styles.emptyImageText}>Nenhuma imagem selecionada</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.selectButton} onPress={selecionarImagem}>
            <Icon name="camera" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectButton} onPress={escolherImagemGaleria}>
            <Icon name="image" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

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