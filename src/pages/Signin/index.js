import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import styles from './styles';

export default function SignIn() {
    const navigation = useNavigation();

    async function handleBiometricAuth() {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) {
            return Alert.alert('Erro', 'Seu dispositivo não suporta autenticação biométrica.');
        }

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
            return Alert.alert('Biometria não configurada', 'Configure a biometria nas configurações do dispositivo.');
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autentique-se para acessar',
            fallbackLabel: 'Usar senha',
            cancelLabel: 'Cancelar'
        });

        if (result.success) {
            setTimeout(() => {
                navigation.navigate('Home');
            }, 500);
        } else {
            Alert.alert('Autenticação falhou', 'Tente novamente ou use outro método.');
        }
    }

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem-vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput 
                    placeholder="Digite um email..."
                    placeholderTextColor="#aaa"
                    style={styles.input}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput 
                    placeholder="Sua senha"
                    placeholderTextColor="#aaa"
                    style={styles.input}
                    secureTextEntry
                />

                <TouchableOpacity 
                    style={styles.buttonForgot}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.registerText}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}