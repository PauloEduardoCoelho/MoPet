import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

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
                    onPress={() => navigation.navigate('Cats')}
                >
                    <Icon name="format-list-bulleted" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Listar Animais</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('Campaigns')}
                >
                    <Icon name="chart-bar" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Análise de Dados</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('Campaigns')}
                >
                    <Icon name="calendar-check" size={40} color="#D69A3A" />
                    <Text style={styles.iconLabel}>Campanhas Ativas</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D69A3A',
        marginBottom: 30,
        alignSelf: 'center'
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        width: '47%',
        marginBottom: 20,
    },
    iconLabel: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold'
    }
});
