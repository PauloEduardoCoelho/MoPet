import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';

export default function Register() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleRegister() {
        if (!name || !email || !password) {
            Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.');
            return;
        }

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                role: 'user' // papel padrão
            });

            Alert.alert('Cadastro realizado!', 'Sua conta foi criada com sucesso.');
            navigation.navigate('SignIn');
        } catch (error) {
            const msg = error.response?.data?.error || 'Erro ao cadastrar. Tente novamente.';
            Alert.alert('Erro no cadastro', msg);
        }
    }

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Crie sua conta</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.title}>Nome</Text>
                <TextInput 
                    placeholder="Digite seu nome completo"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.title}>Email</Text>
                <TextInput 
                    placeholder="Digite seu email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput 
                    placeholder="Crie uma senha"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />
                
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
