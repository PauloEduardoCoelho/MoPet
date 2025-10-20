import * as SecureStore from 'expo-secure-store';
import api from './api';

export async function getMyPets() {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.get('/pets/my', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deletePet(id) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.delete(`/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function updatePet(id, payload) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.put(`/pets/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}