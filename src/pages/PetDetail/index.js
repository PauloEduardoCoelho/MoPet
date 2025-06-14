import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

export default function PetDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { pet } = route.params;

  return (
    <View style={styles.container}>
      {/* Botão de Fechar */}
      <TouchableOpacity
        onPress={() => navigation.goBack()} // Navega para a tela anterior
        style={styles.closeButton}
      >
        <Icon name="close" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Imagem do Animal */}
        <View style={styles.imageContainer}>
          {pet.imagem ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${pet.imagem}` }}
              style={styles.image}
            />
          ) : (
            <View style={styles.emptyImage}>
              <Text style={styles.emptyImageText}>Sem Imagem</Text>
            </View>
          )}
        </View>

        {/* Nome do Animal */}
        <Text style={styles.title}>{pet.nome}</Text>

        {/* Detalhes do Pet */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{pet.tipo}</Text>

          <Text style={styles.label}>Raça:</Text>
          <Text style={styles.value}>{pet.raca || 'Não informado'}</Text>

          <Text style={styles.label}>Cor:</Text>
          <Text style={styles.value}>{pet.cor || 'Não informado'}</Text>

          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{pet.peso || 'Não informado'} kg</Text>

          <Text style={styles.label}>Idade:</Text>
          <Text style={styles.value}>{pet.idade || 'Não informado'} anos</Text>
        </View>

        {/* Detalhes do Tutor */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Tutor:</Text>
          <Text style={styles.value}>{pet.nomeTutor}</Text>

          <Text style={styles.label}>CPF do Tutor:</Text>
          <Text style={styles.value}>{pet.cpfTutor}</Text>

          <Text style={styles.label}>Data de Cadastro:</Text>
          <Text style={styles.value}>{pet.dataCadastro}</Text>
        </View>

        {/* Endereço */}
        {pet.endereco && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Endereço:</Text>
            <Text style={styles.value}>{pet.endereco}</Text>
          </View>
        )}

        {/* Localização */}
        {pet.localizacao && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: pet.localizacao.latitude,
              longitude: pet.localizacao.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={pet.localizacao} />
          </MapView>
        )}
      </ScrollView>
    </View>
  );
}
