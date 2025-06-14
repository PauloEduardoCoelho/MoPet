import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';
import * as SecureStore from 'expo-secure-store';
import LoadingScreen from './src/screens/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        setUserLogged(true); // Usuário está logado
      } else {
        setUserLogged(false); // Usuário não está logado
      }
      setLoading(false); // Fim do carregamento
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#D69A3A" barStyle="light-content" />
      {loading ? <LoadingScreen /> : <Routes userLogged={userLogged} />}
    </NavigationContainer>
  );
}
