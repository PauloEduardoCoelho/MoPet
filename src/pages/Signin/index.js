import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import api from "../../services/api";
import * as LocalAuthentication from "expo-local-authentication";
import styles from "./styles";

export default function SignIn({ route }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userLogged = route?.params?.userLogged ?? false;

  useEffect(() => { if (userLogged) handleBiometricAuth(); }, [userLogged]);

  function goToApp() { navigation.replace('AppTabs'); }

  async function handleLogin() {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("role", data.role ?? "user");
      goToApp();
    } catch (error) {
      const msg = error?.response?.data?.error || "Erro ao fazer login. Verifique seus dados.";
      Alert.alert("Falha no Login", msg);
    }
  }

  async function handleBiometricAuth() {
    try {
      const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!hasBiometrics) return;
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se com sua biometria",
        cancelLabel: "Usar senha",
      });
      if (result.success) goToApp();
    } catch {}
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
          <Text style={styles.message}>Bem-vindo(a)</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.title}>Email</Text>
          <TextInput
            placeholder="Digite seu email..."
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.title}>Senha</Text>
          <TextInput
            placeholder="Sua senha"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Acessar</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 10 }}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={{ color: '#D69A3A', fontWeight: '600' }}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </KeyboardAvoidingView>
  );
}