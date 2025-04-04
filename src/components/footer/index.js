import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
    const navigation = useNavigation();

    return (
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('CadastroAnimal')} style={styles.iconWrapper}>
                <Icon name="plus-box" size={24} color="#D69A3A" />
                <Text style={styles.label}>Cadastrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AnimalList')} style={styles.iconWrapper}>
                <Icon name="format-list-bulleted" size={24} color="#D69A3A" />
                <Text style={styles.label}>Listar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => navigation.navigate('Home')} 
                style={styles.homeWrapper}
            >
                <Icon name="home" size={34} color="#D69A3A" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Campaigns')} style={styles.iconWrapper}>
                <Icon name="chart-bar" size={24} color="#D69A3A" />
                <Text style={styles.label}>Análise</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Campaigns')} style={styles.iconWrapper}>
                <Icon name="calendar-check" size={24} color="#D69A3A" />
                <Text style={styles.label}>Campanhas</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 8, // ⬅️ menor altura
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
    iconWrapper: {
        alignItems: 'center',
        gap: 2,
    },
    label: {
        color: '#333',
        fontSize: 10,
    },
    homeWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        borderRadius: 30,
        backgroundColor: '#FFF',
        marginHorizontal: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    }
});
