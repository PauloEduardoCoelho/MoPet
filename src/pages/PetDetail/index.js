import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { getMe } from '../../services/userService';

export default function PetDetail({ route, navigation }) {
  const { pet, tutor: tutorFromRoute } = route.params || {};
  const [tutor, setTutor] = useState(tutorFromRoute || null);

  useEffect(() => {
    (async () => {
      if (!tutorFromRoute) {
        try {
          const me = await getMe();
          setTutor(me);
        } catch {
          // silencioso
        }
      }
    })();
  }, [tutorFromRoute]);

  const pesoTxt  = pet?.peso  ? String(pet.peso)  : 'Não informado';
  const idadeTxt = pet?.idade ? String(pet.idade) : '—';
  const tipoTxt  = pet?.tipo  || '—';
  const racaTxt  = pet?.raca  || '—';

  const tutorNome  = tutor?.name  || '—';
  const tutorCpf   = tutor?.cpf   || '—';
  const tutorPhone = tutor?.phone || '—';

  return (
    <View style={{ flex: 1, backgroundColor: '#D69A3A' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{pet?.nome || 'Detalhes'}</Text>
        <TouchableOpacity
          accessibilityLabel="Fechar"
          onPress={() => navigation.goBack()}
          style={styles.headerClose}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          activeOpacity={0.7}
        >
          <Icon name="close" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {pet?.imagem ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${pet.imagem}` }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Icon name="image-off" size={28} color="#bbb" />
          </View>
        )}

        <View style={styles.card}>
          <Field label="Nome"  value={pet?.nome || '—'} />
          <Field label="Tipo"  value={tipoTxt} />
          <Field label="Raça"  value={racaTxt} />
          <Field label="Peso"  value={pesoTxt} />
          <Field label="Idade" value={idadeTxt} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tutor</Text>
          <Field label="Nome"     value={tutorNome} />
          <Field label="CPF"      value={tutorCpf} />
          <Field label="Telefone" value={tutorPhone} />
        </View>
      </ScrollView>
    </View>
  );
}

function Field({ label, value }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}