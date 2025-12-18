import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import { getMe } from '../../services/userService';
import * as SecureStore from 'expo-secure-store';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function PerfilHome({ navigation }) {
  const [user, setUser] = useState(null);

  async function loadMe() {
    const data = await getMe();
    setUser(data);
  }

  useEffect(() => {
    loadMe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // toda vez que voltar para esta tela, refaz o GET
      loadMe();
    }, [])
  );

  async function handleLogout() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('role');
            if (api?.defaults?.headers?.common) {
              delete api.defaults.headers.common.Authorization;
            }
            const rootNav = navigation.getParent?.() ?? navigation;
            rootNav.reset({ index: 0, routes: [{ name: 'Access' }] });
          } catch {
            navigation.navigate('Access');
          }
        },
      },
    ]);
  }

  return (
    <HeaderLayout title="Meu Perfil" scroll>
      {!user ? (
        <View />
      ) : (
        <>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>CPF:</Text>
            <Text style={styles.value}>{user.cpf || 'Não informado'}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Telefone:</Text>
            <Text style={styles.value}>{user.phone || 'Não informado'}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('MeusAnimais')}
          >
            <Text style={styles.buttonText}>Ver Meus Animais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditarDados')}
          >
            <Text style={styles.buttonText}>Editar Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AlterarSenha')}
          >
            <Text style={styles.buttonText}>Alterar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </>
      )}
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  infoBox: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 15, marginBottom: 20 },
  label: { fontWeight: 'bold', color: '#333' },
  value: { color: '#555', marginBottom: 10 },
  button: {
    backgroundColor: '#D69A3A',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  logoutText: {
    color: '#c0392b',
    fontWeight: 'bold',
  },
});