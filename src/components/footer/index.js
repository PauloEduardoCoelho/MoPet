import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Footer() {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['bottom']} style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('CadastroAnimal')} style={styles.footerItem}>
                <Icon name="plus-box" size={24} color="#D69A3A" />
                <Text style={styles.label}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AnimalList')} style={styles.footerItem}>
                <Icon name="format-list-bulleted" size={24} color="#D69A3A" />
                <Text style={styles.label}>Listar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.footerItem}>
                <View style={styles.homeIconCircle}>
                    <Icon name="home" size={26} color="#D69A3A" />
                </View>
                <Text style={styles.label}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Building')} style={styles.footerItem}>
                <Icon name="chart-bar" size={24} color="#D69A3A" />
                <Text style={styles.label}>Análise</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Building')} style={styles.footerItem}>
                <Icon name="calendar-check" size={24} color="#D69A3A" />
                <Text style={styles.label}>Campanhas</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 8,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 4,
    },
    footerItem: {
        flex: 1, // Distribui os 5 itens igualmente
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeIconCircle: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        padding: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: '#333',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    }
});
