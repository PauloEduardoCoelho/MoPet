import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from '../../components/footer';
import * as Animatable from 'react-native-animatable';
import styles from './styles';
import api from '../../services/api';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

export default function AnimalList() {
  const [cpfBusca, setCpfBusca] = useState('');
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    buscarPets();
  }, []);

  const buscarPets = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      const response = await api.get('/pets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimais(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCpf = () => {
    if (!cpfBusca.trim()) {
      buscarPets();
    } else {
      const filtrados = animais.filter(animal => animal.cpfTutor.includes(cpfBusca));
      setAnimais(filtrados);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PetDetail', { pet: item })}
      style={styles.card}
    >
      <Image
        source={
          item.imagem
            ? { uri: `data:image/jpeg;base64,${item.imagem}` }
            : require('../../assets/cat4.jpg')
        }
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.nome}>Nome: {item.nome}</Text>
        <Text style={styles.cpf}>CPF do Tutor: {item.cpfTutor}</Text>
      </View>
      <View style={styles.iconArea}>
        <Icon
          name={item.tipo === 'gato' ? 'cat' : 'dog'}
          size={30}
          color="#D69A3A"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.View animation="fadeInLeft" delay={500}>
          <Text style={styles.headerTitle}>Animais cadastrados</Text>
        </Animatable.View>

        <View style={styles.searchArea}>
          <TextInput
            style={styles.input}
            placeholder="Insira o CPF do Tutor..."
            placeholderTextColor="#999"
            value={cpfBusca}
            onChangeText={setCpfBusca}
          />
          <TouchableOpacity style={styles.searchButton} onPress={filtrarPorCpf}>
            <Icon name="magnify" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#D69A3A" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={animais}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
          />
        )}
      </View>

      <Footer />
    </View>
  );
}