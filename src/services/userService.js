import api from './api';
import * as SecureStore from 'expo-secure-store';

export async function getMe() {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.get('/profile/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function updateMe(payload) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.put('/profile/me', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function changeEmail(currentPassword, newEmail) {
  const token = await SecureStore.getItemAsync('token');
  const res = await api.put(
    '/profile/me/email',
    { currentPassword, newEmail },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function changePassword(currentPassword, newPassword) {
  const token = await SecureStore.getItemAsync('token');
  const res = await api.put(
    '/profile/me/password',
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}