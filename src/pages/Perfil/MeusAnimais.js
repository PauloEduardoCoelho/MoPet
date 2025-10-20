import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, Image,
  TouchableOpacity, Alert, RefreshControl, ActivityIndicator
} from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMe } from '../../services/userService';
import { getMyPets, deletePet } from '../../services/petService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function MeusAnimais() {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const u = await getMe();
      setUser(u);
      const list = await getMyPets();
      setPets(list || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [isFocused, fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pets;
    return pets.filter(p =>
      (p.nome || '').toLowerCase().includes(q) ||
      (p.raca || '').toLowerCase().includes(q)
    );
  }, [pets, query]);

  const confirmDelete = (pet) => {
    Alert.alert(
      'Remover animal',
      `Deseja remover “${pet.nome}”?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(pet._id);
              setPets(prev => prev.filter(p => p._id !== pet._id));
            } catch {
              Alert.alert('Erro', 'Não foi possível remover o animal.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PetDetail', { pet: item, tutor: user })}
    >
      <Image
        source={item.imagem ? { uri: `data:image/jpeg;base64,${item.imagem}` } : require('../../assets/cat4.jpg')}
        style={styles.thumb}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.nome}</Text>
        <Text style={styles.cardSub}>
          {(item.tipo || '—')} • {(item.raca || '—')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate('EditPet', { pet: item })}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon name="pencil" size={20} color="#C58A2B" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconBtn, { marginLeft: 8 }]}
        onPress={() => confirmDelete(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon name="delete" size={20} color="#C53030" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <HeaderLayout title="Meus Animais">
      <Text style={styles.headerLine}>
        Tutor: <Text style={styles.bold}>{user?.name || '—'}</Text>
      </Text>

      <View style={styles.searchBox}>
        <Icon name="magnify" size={22} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, color: '#333' }}
          placeholder="Buscar por nome ou raça..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <ActivityIndicator size="large" color="#D69A3A" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="paw-off" size={56} color="#c7c7c7" />
          <Text style={styles.emptyText}>Nenhum animal encontrado para o seu perfil.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item._id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 140 }} // espaço extra, além do que o HeaderLayout já dá
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D69A3A']} />
          }
        />
      )}

      {/* FAB acima do footer */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CadastroAnimal')}
        activeOpacity={0.9}
        style={[
          styles.fab,
          { bottom: 88 + insets.bottom } // sobe um pouco mais pra não colidir com o footer
        ]}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  headerLine: { fontSize: 16, color: '#555', marginBottom: 12 },
  bold: { fontWeight: 'bold', color: '#222' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 10,
    paddingHorizontal: 12, height: 48, marginBottom: 16,
  },

  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 12, color: '#777', fontSize: 16, textAlign: 'center', paddingHorizontal: 24 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12,
    elevation: 2
  },
  thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#222' },
  cardSub: { color: '#666', marginTop: 2 },

  iconBtn: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#eee'
  },

  fab: {
    position: 'absolute', right: 24, width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#D69A3A', alignItems: 'center', justifyContent: 'center',
    elevation: 8
  },
});