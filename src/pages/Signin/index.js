import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

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
            navigation.navigate('Home');
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
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput 
                    placeholder="Sua senha"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity 
                    style={styles.buttonForgot}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.registerText}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleBiometricAuth}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

<<<<<<< HEAD
                <TouchableOpacity 
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('Register')}
                >
=======
                <TouchableOpacity style={styles.buttonRegister}>
>>>>>>> de3041bb416458ac80e62479fb284ad281e475ac
                    <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#D69A3A',
    },
    containerHeader:{
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm:{
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title:{
        fontSize: 20,
        marginTop: 28,
    },
    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button:{
        backgroundColor: '#D69A3A',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText:{
        color: '#A1A1A1'
    },
    buttonForgot:{
        marginTop: 4,
        alignSelf: 'flex-end'
    }
});
