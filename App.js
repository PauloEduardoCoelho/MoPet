import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/routes';
import LoadingScreen from './src/pages/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserLogged(!!token);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaProvider>
      {/* Expo StatusBar: style controla a cor dos ícones, backgroundColor só no Android */}
      <StatusBar style="light" backgroundColor="#D69A3A" />
      {/* key muda quando login muda, garantindo reset limpo de navegação */}
      <NavigationContainer key={userLogged ? 'in' : 'out'}>
        {loading ? <LoadingScreen /> : <Routes userLogged={userLogged} />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}