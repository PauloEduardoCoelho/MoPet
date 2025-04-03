import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Welcome() {
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
            navigation.navigate('SignIn');
        } else {
            Alert.alert('Autenticação falhou', 'Tente novamente ou use outro método.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation="flipInY"
                    source={require('../../assets/logo.png')}
                    style={{ width: '100%' }}
                    resizeMode="contain"
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Cadastre e monitore os cães e gatos das campanhas de vacinação.</Text>
                <Text style={styles.text}>Faça o login para começar</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleBiometricAuth}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D69A3A'
    },
    containerLogo: {
        flex: 2,
        backgroundColor: '#D69A3A',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12,
    },
    text: {
        color: '#a1a1a1'
    },
    button: {
        position: 'absolute',
        backgroundColor: '#D69A3A',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        fontWeight: 'bold'
    },
});
