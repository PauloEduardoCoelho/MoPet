import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import Footer from "../../components/footer";

export default function Home() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu Principal</Text>

            <View style={styles.iconGrid}>
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={() => navigation.navigate('CadastroAnimal')}
                >
                    <Icon name="plus-box" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Cadastrar Animal</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('AnimalList')}
                >
                    <Icon name="format-list-bulleted" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Listar Animais</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('Building')}
                >
                    <Icon name="chart-bar" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Análise de Dados</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('Building')}
                >
                    <Icon name="calendar-check" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Campanhas Ativas</Text>
                </TouchableOpacity>
            </View>
            <Footer />
        </View>
    );
}