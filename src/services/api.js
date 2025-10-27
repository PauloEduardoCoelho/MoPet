import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const publicApi =
  Constants?.expoConfig?.extra?.EXPO_PUBLIC_API_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  null;

const baseURL = publicApi || 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;