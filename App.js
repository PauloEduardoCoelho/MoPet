import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'; 
import Routes from './src/routes';
import React, { useEffect, useState } from 'react';
import LoadingScreen from './src/screens/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#D69A3A" barStyle="light-content" />
      {loading ? <LoadingScreen /> : <Routes />}
    </NavigationContainer>
  );
}
