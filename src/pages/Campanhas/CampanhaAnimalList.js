import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCampaign, getCampaignRegistrations, removeRegistration } from '../../services/campaignService';
import { useRoute } from '@react-navigation/native';

export default function CampanhaAnimalList() {
  const route = useRoute();
  const { id } = route.params;

  const [camp, setCamp] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const c = await getCampaign(id);
      setCamp(c);
      const r = await getCampaignRegistrations(id);
      setRegs(r || []);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const confirmRemove = (reg) => {
    Alert.alert('Remover inscrição', `Remover "${reg?.pet?.nome}" desta campanha?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeRegistration(id, reg._id);
            setRegs(prev => prev.filter(x => x._id !== reg._id));
          } catch {
            Alert.alert('Erro', 'Não foi possível remover.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    const pet = item.pet;
    const owner = item.owner;
    return (
      <View style={styles.card}>
        <Image
          source={pet?.imagem ? { uri: `data:image/jpeg;base64,${pet.imagem}` } : require('../../assets/cat4.jpg')}
          style={styles.thumb}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{pet?.nome || '—'}</Text>
          <Text style={styles.cardSub}>{(pet?.tipo || '—')} • {(pet?.raca || '—')}</Text>
          <Text style={styles.cardSubSmall}>
            Tutor: {(owner?.name || '—')} • CPF: {(owner?.cpf || '—')} • Tel: {(owner?.phone || '—')}
          </Text>
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={() => confirmRemove(item)}>
          <Icon name="delete" size={20} color="#C53030" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <HeaderLayout title="Inscritos">
      {!camp || loading ? (
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <ActivityIndicator size="large" color="#D69A3A" />
        </View>
      ) : (
        <>
          <View style={styles.top}>
            <Text style={styles.topTitle}>
              {camp?.address?.city ? `${camp.address.city} / ${camp.address.state}` : `CEP ${camp.cep}`}
            </Text>
            <Text style={styles.topSub}>{camp.day} • {camp.time}</Text>
            <Text style={styles.badge}>{(regs || []).length}/{camp.capacity} inscritos</Text>
          </View>

          <FlatList
            data={regs}
            keyExtractor={(i) => String(i._id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: '#777' }}>Nenhum pet inscrito até o momento.</Text>
              </View>
            }
          />
        </>
      )}
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  top: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  topTitle: { fontWeight: '700', fontSize: 16, color: '#111' },
  topSub: { color: '#666', marginTop: 4 },
  badge: {
    marginTop: 8, backgroundColor: '#ECFDF3', color: '#027A48',
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8
  },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#222' },
  cardSub: { color: '#666', marginTop: 2 },
  cardSubSmall: { color: '#777', marginTop: 4, fontSize: 12 },

  iconBtn: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#eee'
  },
});