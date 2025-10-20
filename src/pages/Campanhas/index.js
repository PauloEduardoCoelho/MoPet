import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';

export default function Campanhas() {
  const [q, setQ] = useState('Barra do pirai');

  const data = [
    { id: '1', titulo: 'Mutirão Vacinação - Praça Central', quando: '25/11, 9h-16h', onde: 'Praça Central, Centro' },
    { id: '2', titulo: 'Posto Volante - Escola Municipal', quando: '27/11, 8h-12h', onde: 'Escola M. São Lucas, Bairro Norte' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardSub}>{item.quando}</Text>
      <Text style={styles.cardSub}>{item.onde}</Text>
      <View style={styles.badge}><Text style={styles.badgeText}>Ativa</Text></View>
    </View>
  );

  return (
    <HeaderLayout title="Campanhas Ativas">
      <Text style={styles.subtitle}>Procure campanhas por endereço, bairro ou cidade.</Text>

      <View style={styles.searchRow}>
        <TextInput style={styles.search} value={q} onChangeText={setQ} placeholder="Digite um local" />
        <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Buscar</Text></TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 16, color: '#4a4a4a', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  search: { flex: 1, backgroundColor: '#F2F2F2', height: 48, borderRadius: 10, paddingHorizontal: 12 },
  btn: { backgroundColor: '#D69A3A', borderRadius: 10, height: 48, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  cardSub: { color: '#666', marginBottom: 2 },
  badge: { backgroundColor: '#F6E7C7', paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', borderRadius: 10, marginTop: 8 },
  badgeText: { color: '#A87812', fontWeight: '700' },
});