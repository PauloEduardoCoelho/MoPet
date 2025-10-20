import api from './api';
import * as SecureStore from 'expo-secure-store';

export async function getCampaigns() {
  const { data } = await api.get('/campaigns');
  return data;
}

export async function getCampaign(id) {
  const { data } = await api.get(`/campaigns/${id}`);
  return data;
}

export async function createCampaign(payload) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.post('/campaigns', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deleteCampaign(id) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.delete(`/campaigns/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function enrollPet(campaignId, petId) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.post(
    `/campaigns/${campaignId}/enroll`,
    { petId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

export async function unEnrollPet(campaignId, petId) {
  const token = await SecureStore.getItemAsync('token');
  const { data } = await api.delete(
    `/campaigns/${campaignId}/enroll/${petId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}