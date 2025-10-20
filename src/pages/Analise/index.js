import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator
} from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import { getCampaigns } from '../../services/campaignService';
import { useIsFocused } from '@react-navigation/native';

// util: normaliza "YYYY-MM-DD" para Date no fuso local
const parseDay = (d) => {
  if (!d) return null;
  const [Y, M, D] = d.split('-').map(n => parseInt(n, 10));
  return new Date(Y, (M || 1) - 1, D || 1);
};

// últimos 3 meses (inclui mês atual)
const buildLast3Months = () => {
  const arr = [];
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    const label = dt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    arr.push({ key, label, date: dt });
  }
  return arr;
};

export default function Analise() {
  const [role, setRole] = useState('user');
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [months] = useState(buildLast3Months());
  const [selectedIdx, setSelectedIdx] = useState(0);

  const isFocused = useIsFocused();

  const canSee = role === 'manager' || role === 'superadmin';

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await SecureStore.getItemAsync('role');
      setRole(r || 'user');
      const list = await getCampaigns(); // precisa trazer registrations
      setAllCampaigns(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [isFocused, load]);

  const selectedMonth = months[selectedIdx];

  // filtra campanhas do mês escolhido
  const campaigns = useMemo(() => {
    if (!selectedMonth) return [];
    const year = selectedMonth.date.getFullYear();
    const month = selectedMonth.date.getMonth(); // 0-11
    return allCampaigns.filter(c => {
      const d = parseDay(c.day);
      return d && d.getFullYear() === year && d.getMonth() === month;
    });
  }, [allCampaigns, selectedMonth]);

  // KPIs
  const { totalCampaigns, totalAnimals, capacitySum, citiesCount, occPct } = useMemo(() => {
    let totalAnimals = 0;
    let capacitySum = 0;
    const citySet = new Set();

    for (const c of campaigns) {
      const regs = Array.isArray(c.registrations) ? c.registrations.length : 0;
      totalAnimals += regs;
      capacitySum += Number(c.capacity || 0);
      const city = c?.address?.city?.trim();
      if (city) citySet.add(city);
    }
    const totalCampaigns = campaigns.length;
    const occPct = capacitySum > 0 ? Math.round((totalAnimals / capacitySum) * 100) : 0;
    return { totalCampaigns, totalAnimals, capacitySum, citiesCount: citySet.size, occPct };
  }, [campaigns]);

  // “gráfico” de barras simples (regs vs capacidade)
  const renderBar = ({ item }) => {
    const regs = Array.isArray(item.registrations) ? item.registrations.length : 0;
    const cap = Number(item.capacity || 0);
    const pct = cap > 0 ? Math.min(100, Math.round((regs / cap) * 100)) : 0;
    const title = `${item.address?.city ? `${item.address.city} • ` : ''}${item.day || ''}`;

    return (
      <View style={styles.barCard}>
        <Text style={styles.barTitle} numberOfLines={1}>{title}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.barLegend}>
          {regs}/{cap} ({pct}%)
        </Text>
      </View>
    );
  };

  if (!canSee) {
    return (
      <HeaderLayout title="Análise de Dados">
        <View style={styles.lockWrap}>
          <Icon name="lock" size={42} color="#C2862F" />
          <Text style={styles.lockTitle}>Acesso restrito</Text>
          <Text style={styles.lockSub}>Somente gerentes e super admins podem ver esta página.</Text>
        </View>
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout title="Análise de Dados" scroll={false}>
      <View style={styles.monthRow}>
        {months.map((m, idx) => {
          const active = idx === selectedIdx;
          return (
            <TouchableOpacity
              key={m.key}
              style={[styles.monthChip, active && styles.monthChipOn]}
              onPress={() => setSelectedIdx(idx)}
              activeOpacity={0.8}
            >
              <Text style={[styles.monthChipText, active && styles.monthChipTextOn]}>
                {m.label[0].toUpperCase() + m.label.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <ActivityIndicator size="large" color="#D69A3A" />
        </View>
      ) : (
        <>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Campanhas no mês</Text>
              <Text style={styles.kpiValue}>{totalCampaigns}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Animais atendidos</Text>
              <Text style={styles.kpiValue}>{totalAnimals}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Cidades atendidas</Text>
              <Text style={styles.kpiValue}>{citiesCount}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Ocupação média</Text>
              <Text style={styles.kpiValue}>{occPct}%</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Ocupação por campanha</Text>
          {campaigns.length === 0 ? (
            <Text style={styles.emptyText}>Sem campanhas neste mês.</Text>
          ) : (
            <FlatList
              data={campaigns}
              keyExtractor={(it) => String(it._id)}
              renderItem={renderBar}
              contentContainerStyle={{ paddingBottom: 16 }}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  monthChip: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthChipOn: { backgroundColor: '#D69A3A' },
  monthChipText: { color: '#333', fontWeight: '600' },
  monthChipTextOn: { color: '#fff' },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  kpiLabel: { color: '#666', fontSize: 12 },
  kpiValue: { color: '#111', fontWeight: '800', fontSize: 20, marginTop: 4 },

  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#111', marginBottom: 8 },

  barCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  barTitle: { color: '#333', fontWeight: '600', marginBottom: 8 },
  barTrack: {
    height: 12,
    backgroundColor: '#EEE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#D69A3A',
  },
  barLegend: { color: '#666', marginTop: 6, fontSize: 12 },

  lockWrap: { alignItems: 'center', marginTop: 40, paddingHorizontal: 24 },
  lockTitle: { marginTop: 8, fontWeight: '700', fontSize: 18, color: '#222' },
  lockSub: { marginTop: 6, color: '#666', textAlign: 'center' },

  emptyText: { color: '#666' },
});