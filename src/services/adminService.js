import api from './api';
import * as SecureStore from 'expo-secure-store';

async function authHeader() {
  const token = await SecureStore.getItemAsync('token');
  return { Authorization: `Bearer ${token}` };
}

export async function listManagers() {
  const headers = await authHeader();
  const { data } = await api.get('/admin/managers', { headers });
  return data;
}

export async function createManager(payload) {
  const headers = await authHeader();
  const { data } = await api.post('/admin/managers', payload, { headers });
  return data;
}

export async function deleteManager(id) {
  const headers = await authHeader();
  const { data } = await api.delete(`/admin/managers/${id}`, { headers });
  return data;
}