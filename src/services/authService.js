import api from './api';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Biometria (opcional)
export async function authenticateWithBiometrics() {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;

    const savedToken = await SecureStore.getItemAsync('token');
    if (!savedToken) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se',
      fallbackLabel: 'Usar senha',
    });
    return !!result.success;
  } catch {
    return false;
  }
}

export async function forgotPassword(email) {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data; // { message: '...' }
}

export async function resetPassword({ email, code, newPassword }) {
  const { data } = await api.post('/auth/reset-password', { email, code, newPassword });
  return data; // { message: '...' }
}