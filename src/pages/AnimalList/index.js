import React, { useState } from 'react';
 import {
   View,
   Text,
   StyleSheet,
   TextInput,
   FlatList,
   TouchableOpacity,
   Image
 } from 'react-native';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
 import Footer from '../../components/footer';
 import * as Animatable from 'react-native-animatable';
 
 const mockData = [
   {
     id: '1',
     nome: 'Garfield da Silva Santos',
     cpf: '123.456.789-0',
     tipo: 'gato',
     foto: require('../../assets/cat1.jpg')
   },
   {
     id: '2',
     nome: 'Marley&Eu Alves',
     cpf: '987.654.321-0',
     tipo: 'cachorro',
     foto: require('../../assets/dog1.jpg')
   },
   {
     id: '3',
     nome: 'John Cena',
     cpf: '978.546.231-0',
     tipo: 'cachorro',
     foto: require('../../assets/dog2.jpg')
   },
   {
     id: '4',
     nome: 'Meow Meow Meow',
     cpf: '999.555.333-1',
     tipo: 'gato',
     foto: require('../../assets/cat2.jpg')
   },
   {
     id: '5',
     nome: 'Luna Felina',
     cpf: '201.983.774-56',
     tipo: 'gato',
     foto: require('../../assets/cat3.jpg')
   },
   {
     id: '6',
     nome: 'Thor Canino',
     cpf: '789.432.198-75',
     tipo: 'cachorro',
     foto: require('../../assets/dog3.jpg')
   },
   {
     id: '7',
     nome: 'Mimi Ronron',
     cpf: '345.667.231-99',
     tipo: 'gato',
     foto: require('../../assets/cat4.jpg')
   },
   {
     id: '8',
     nome: 'Rex da Silva',
     cpf: '560.883.112-47',
     tipo: 'cachorro',
     foto: require('../../assets/dog4.jpg')
   }
 ];
 
 export default function AnimalList() {
   const [cpfBusca, setCpfBusca] = useState('');
   const [animais, setAnimais] = useState(mockData);
 
   const filtrarPorCpf = () => {
     if (cpfBusca === '') {
       setAnimais(mockData);
     } else {
       const filtrados = mockData.filter(animal =>
         animal.cpf.includes(cpfBusca)
       );
       setAnimais(filtrados);
     }
   };
 
   const renderItem = ({ item }) => (
     <View style={styles.card}>
       <Image source={item.foto} style={styles.image} />
       <View style={styles.cardContent}>
         <Text style={styles.nome}>Nome: {item.nome}</Text>
         <Text style={styles.cpf}>CPF do Tutor: {item.cpf}</Text>
       </View>
       <View style={styles.iconArea}>
         <Icon
           name={item.tipo === 'gato' ? 'cat' : 'dog'}
           size={30}
           color="#D69A3A"
         />
       </View>
     </View>
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
         <FlatList
           data={animais}
           keyExtractor={item => item.id}
           renderItem={renderItem}
           contentContainerStyle={{
             padding: 16,
             paddingBottom: 60,
           }}
         />
       </View>
 
       <Footer />
     </View>
   );
 }
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D69A3A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  searchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingLeft: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#333',
    paddingRight: 12,
  },
  searchButton: {
    backgroundColor: '#D69A3A',
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#D69A3A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  nome: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cpf: {
    color: '#fff',
    fontSize: 13,
  },
  iconArea: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});