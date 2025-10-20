import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import { getCampaigns, deleteCampaign } from '../../services/campaignService';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Campanhas() {
  const [items, setItems] = useState([]);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [cityQuery, setCityQuery] = useState('');

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await SecureStore.getItemAsync('role');
      setRole(r || 'user');
      const list = await getCampaigns();
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [isFocused, load]);

  const canManage = role === 'manager' || role === 'superadmin';

  const confirmDelete = (campaign) => {
    Alert.alert('Excluir campanha', `Deseja excluir esta campanha?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCampaign(campaign._id);
            setItems(prev => prev.filter(i => i._id !== campaign._id));
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        }
      }
    ]);
  };

  const filtered = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => (i?.address?.city || '').toLowerCase().includes(q));
  }, [items, cityQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CampanhaDetalhe', { id: item._id })}
    >
      <Text style={styles.title}>Campanha ({item.cep})</Text>
      <Text style={styles.sub}>{item.day} • {item.time}</Text>

      {!!item.address && (
        <>
          <Text style={styles.sub}>
            {(item.address?.street || '—')}
            {item.number ? `, ${item.number}` : ''}
            {item.address?.neighborhood ? ` - ${item.address.neighborhood}` : ''}
          </Text>
          <Text style={styles.sub}>
            {(item.address?.city || '—')}
            {item.address?.state ? ` / ${item.address.state}` : ''}
          </Text>
        </>
      )}
      {!!item.placeName && <Text style={styles.sub}>Local: {item.placeName}</Text>}
      {!!item.reference && <Text style={styles.sub}>Ref.: {item.reference}</Text>}

      <Text style={styles.badge}>
        {(item.enrollments?.length || 0)}/{item.capacity} vagas
      </Text>

      {canManage && (
        <TouchableOpacity style={styles.trash} onPress={() => confirmDelete(item)}>
          <Icon name="trash-can" size={20} color="#C53030" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <HeaderLayout title="Campanhas">
      {/* busca por cidade */}
      <View style={styles.searchBox}>
        <Icon name="magnify" size={22} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, color: '#333' }}
          placeholder="Filtrar por cidade…"
          placeholderTextColor="#bbb"
          value={cityQuery}
          onChangeText={setCityQuery}
        />
      </View>

      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <ActivityIndicator size="large" color="#D69A3A" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => String(i._id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#777' }}>Nenhuma campanha encontrada.</Text>
            </View>
          }
        />
      )}

      {canManage && (
        <TouchableOpacity
          style={[styles.fab, { bottom: 24 + insets.bottom }]}
          onPress={() => navigation.navigate('NovaCampanha')}
          activeOpacity={0.9}
        >
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 10,
    paddingHorizontal: 12, height: 48, marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)'
  },
  title: { fontWeight: '700', fontSize: 16, color: '#111' },
  sub: { color: '#666', marginTop: 4 },
  badge: { marginTop: 8, backgroundColor: '#FFF3DC', color: '#A86B07', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trash: { position: 'absolute', right: 12, top: 12 },
  fab: {
    position: 'absolute', right: 24, width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#D69A3A', alignItems: 'center', justifyContent: 'center', elevation: 8
  }
});