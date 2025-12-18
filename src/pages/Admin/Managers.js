import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import HeaderLayout from '../../components/HeaderLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { listManagers, createManager, deleteManager } from '../../services/adminService';

export default function Managers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listManagers();
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function onCreate() {
    try {
      if (!name || !email || !password) {
        Alert.alert('Atenção', 'Nome, e-mail e senha são obrigatórios.');
        return;
      }
      await createManager({ name, cpf, email, phone, password });
      setName(''); setCpf(''); setEmail(''); setPhone(''); setPassword('');
      fetchAll();
      Alert.alert('Sucesso', 'Gerente criado!');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro ao criar gerente.';
      Alert.alert('Erro', msg);
    }
  }

  function confirmRemove(item) {
    Alert.alert(
      'Remover gerente',
      `Deseja remover “${item.name}”?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteManager(item._id);
              setItems(prev => prev.filter(i => i._id !== item._id));
            } catch {
              Alert.alert('Erro', 'Não foi possível remover.');
            }
          }
        }
      ]
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.sub}>{item.email}</Text>
        <Text style={styles.sub}>{item.cpf || 'CPF —'}</Text>
        {!!item.phone && <Text style={styles.sub}>{item.phone}</Text>}
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmRemove(item)}>
        <Icon name="delete" size={20} color="#C53030" />
      </TouchableOpacity>
    </View>
  );

  return (
    <HeaderLayout title="Gerentes">
      {/* Form compacto no topo */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Criar novo gerente</Text>

        <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="CPF (opcional)" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Telefone (opcional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.createBtn} onPress={onCreate}>
          <Text style={styles.createText}>Criar gerente</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i._id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={!loading && (
          <View style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={{ color: '#666' }}>Nenhum gerente cadastrado.</Text>
          </View>
        )}
      />
    </HeaderLayout>
  );
}

const styles = StyleSheet.create({
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  formTitle: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 8, color: '#222'
  },
  createBtn: { marginTop: 12, backgroundColor: '#D69A3A', borderRadius: 8, alignItems: 'center', paddingVertical: 12 },
  createText: { color: '#fff', fontWeight: 'bold' },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  title: { fontWeight: '700', fontSize: 16, color: '#222' },
  sub: { color: '#666', marginTop: 2 },
  deleteBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'center', marginLeft: 8 }
});