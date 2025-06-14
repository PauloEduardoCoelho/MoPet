import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Função para autenticar com biometria
export async function authenticateWithBiometrics() {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      alert('Biometria não disponível nesse dispositivo');
      return false;
    }

    const savedToken = await SecureStore.getItemAsync('token');
    if (!savedToken) {
      alert('Token não encontrado, por favor, faça login');
      return false;
    }

    // Tenta autenticar com a biometria
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se',
      fallbackLabel: 'Usar senha',
    });

    if (result.success) {
      console.log('Biometria autenticada com sucesso!');
      return true;
    } else {
      console.log('Falha na autenticação biométrica');
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
