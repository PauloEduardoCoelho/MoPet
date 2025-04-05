import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import * as Animatable from 'react-native-animatable';
 
  export default function Access() {
     const navigation = useNavigation();
 
     return (
         <View style={styles.container}>
             <View style={styles.containerLogo}>
                 <Animatable.Image
                     animation="flipInY"
                     source={require('../../assets/logo.png')}
                     style={{ width: '100%' }}
                     resizeMode="contain"
                 />
                 <Text style={styles.appName}>MoPet</Text>
             </View>
 
             <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                 <Text style={styles.title}>Cadastre e monitore os cães e gatos das campanhas de vacinação.</Text>
                 <Text style={styles.text}>Faça o login para começar</Text>
 
                 <TouchableOpacity
                     style={styles.button}
                     onPress={() => {
                         setTimeout(() => {
                             navigation.navigate('SignIn');
                         }, 500);
                     }}
                 >
                     <Text style={styles.buttonText}>Acessar</Text>
                 </TouchableOpacity>
             </Animatable.View>
             </View>
          );
        }