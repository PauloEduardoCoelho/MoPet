import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Recuperar Senha</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Email</Text>
                <TextInput 
                    placeholder="Digite seu email de cadastro"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Enviar link de recuperação</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text style={styles.registerText}>Lembrou a senha? Voltar ao login</Text>
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText:{
        color: '#A1A1A1'
    }
});