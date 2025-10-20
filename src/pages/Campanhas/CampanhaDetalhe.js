import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderLayout from '../../components/HeaderLayout';
import * as SecureStore from 'expo-secure-store';
import { getCampaign, enrollPet, unEnrollPet } from '../../services/campaignService';
import { getMyPets } from '../../services/petService';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function CampanhaDetalhe() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [role, setRole] = useState('user');
  const [campaign, setCampaign] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await SecureStore.getItemAsync('role');
      setRole(r || 'user');

      const c = await getCampaign(id); // campanha com enrollments populados
      setCampaign(c);

      if ((r === 'user' || !r)) {
        const mine = await getMyPets();
        setMyPets(mine || []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const used = campaign?.enrollments?.length || 0;
  const full = used >= (campaign?.capacity || 0);

  // mapa rápido: petId -> enrollment
  const enrollmentByPet = useMemo(() => {
    const map = new Map();
    (campaign?.enrollments || []).forEach(e => map.set(String(e.pet?._id || e.pet), e));
    return map;
  }, [campaign]);

  const onEnroll = async (pet) => {
    try {
      await enrollPet(campaign._id, pet._id);
      await load();
    } catch (e) {
      Alert.alert('Erro', e?.response?.data?.error || 'Não foi possível inscrever.');
    }
  };

  const onUnEnroll = async (petId) => {
    try {
      await unEnrollPet(campaign._id, petId);
      await load();
    } catch (e) {
      Alert.alert('Erro', e?.response?.data?.error || 'Não foi possível remover inscrição.');
    }
  };

  const Header = () => (
    <View style={{ backgroundColor: '#D69A3A' }}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Detalhe da Campanha</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn} hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}>
          <Icon name="close" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.topLine}>
          CEP {campaign?.cep} • {campaign?.day} • {campaign?.time}
        </Text>

        {!!campaign?.address && (
          <>
            <Text style={styles.sub}>
              {(campaign.address?.street || '—')}
              {campaign.number ? `, ${campaign.number}` : ''}
              {campaign.address?.neighborhood ? ` - ${campaign.address.neighborhood}` : ''}
            </Text>
            <Text style={styles.sub}>
              {(campaign.address?.city || '—')}
              {campaign.address?.state ? ` / ${campaign.address.state}` : ''}
            </Text>
          </>
        )}
        {!!campaign?.placeName && <Text style={styles.sub}>Local: {campaign.placeName}</Text>}
        {!!campaign?.reference && <Text style={styles.sub}>Ref.: {campaign.reference}</Text>}

        <Text style={[styles.badge, full ? styles.badgeFull : styles.badgeOk]}>
          {used}/{campaign?.capacity} vagas
        </Text>

        {role === 'user' && (
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Inscrever meu pet</Text>
        )}
        {role !== 'user' && (
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Inscritos</Text>
        )}
      </View>
    </View>
  );

  // DATA & RENDER
  const data = role === 'user' ? myPets : (campaign?.enrollments || []);

  const renderItem = ({ item }) => {
    if (role === 'user') {
      const enrolled = !!enrollmentByPet.get(String(item._id));
      return (
        <View style={styles.row}>
          <Image
            source={item.imagem ? { uri: `data:image/jpeg;base64,${item.imagem}` } : require('../../assets/cat4.jpg')}
            style={styles.thumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{item.nome}</Text>
            <Text style={styles.rowSub}>{item.tipo || '—'} • {item.raca || '—'}</Text>
          </View>

          {enrolled ? (
            <TouchableOpacity
              style={[styles.chip, { backgroundColor: '#eee' }]}
              onPress={() => onUnEnroll(item._id)}
            >
              <Text style={[styles.chipText, { color: '#666' }]}>Inscrito (remover)</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.chip, { backgroundColor: '#D69A3A' }]}
              disabled={full}
              onPress={() => onEnroll(item)}
            >
              <Text style={[styles.chipText, { color: '#fff' }]}>{full ? 'Lotado' : 'Inscrever'}</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // manager/superadmin — item é um enrollment
    const e = item;
    const p = e.pet || {};
    const o = e.owner || {};
    return (
      <View style={styles.row}>
        <Image
          source={p.imagem ? { uri: `data:image/jpeg;base64,${p.imagem}` } : require('../../assets/cat4.jpg')}
          style={styles.thumb}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{p.nome || '—'}</Text>
          <Text style={styles.rowSub}>{p.tipo || '—'} • {p.raca || '—'}</Text>
          <Text style={styles.tutorLine}>Tutor: {o.name || '—'}</Text>
          <Text style={styles.tutorLineSmall}>{o.cpf || '—'} • {o.phone || '—'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.iconBtn]}
          onPress={() =>
            Alert.alert('Remover inscrição', `Remover ${p.nome} da campanha?`, [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Remover', style: 'destructive', onPress: () => onUnEnroll(p._id) }
            ])
          }
        >
          <Icon name="delete" size={20} color="#C53030" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <HeaderLayout title="Detalhe da Campanha">
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <ActivityIndicator size="large" color="#D69A3A" />
        </View>
      </HeaderLayout>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, idx) => String(item._id || idx)}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  headerBar: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#D69A3A',
  },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  closeBtn: { position: 'absolute', right: 12, top: 56, padding: 6 },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 12,
    padding: 16,
  },
  topLine: { fontWeight: '700', fontSize: 16, color: '#111' },
  sub: { color: '#666', marginTop: 4 },
  badge: { marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  badgeOk: { backgroundColor: '#E9F9EE', color: '#177245' },
  badgeFull: { backgroundColor: '#FDE8E8', color: '#B91C1C' },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#111', marginTop: 4 },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 10,
    padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)'
  },
  thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  rowTitle: { fontWeight: '700', fontSize: 16, color: '#222' },
  rowSub: { color: '#666', marginTop: 2 },
  tutorLine: { color: '#333', marginTop: 6, fontWeight: '600' },
  tutorLineSmall: { color: '#666', fontSize: 12 },

  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  chipText: { fontWeight: '700' },

  iconBtn: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#eee'
  },
});