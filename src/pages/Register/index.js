import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Register() {
    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Crie sua conta</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Nome</Text>
                <TextInput 
                    placeholder="Digite seu nome completo"
                    style={styles.input}
                />

                <Text style={styles.title}>Email</Text>
                <TextInput 
                    placeholder="Digite seu email"
                    style={styles.input}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput 
                    placeholder="Crie uma senha"
                    secureTextEntry
                    style={styles.input}
                />
                
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text style={styles.registerText}>Já possui uma conta? Faça login</Text>
                </TouchableOpacity>

            </Animatable.View>
        </View>
    );
}