import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import styles from './styles';
import HeaderLayout from '../../components/HeaderLayout';

export default function Home() {

  return (
    <HeaderLayout title="Menu Principal" scroll>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Icon name="hospital-box" size={28} color="#A86B07" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Castramóvel</Text>
            <Text style={styles.heroText}>
              Programa de castração gratuita para cães e gatos do Governo do Estado, com mutirões em diversos municípios.
            </Text>
          </View>
        </View>

        <Animatable.View animation="fadeInUp" delay={150} style={styles.card}>
          <Text style={styles.cardTitle}>O que é o Castramóvel</Text>
          <Text style={styles.cardText}>
            É uma unidade móvel que oferece castração gratuita para cães e gatos em diferentes municípios, em parceria com prefeituras.
            O programa promove saúde, controle populacional e guarda responsável.
          </Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
          <Text style={styles.cardTitle}>Como agendar</Text>
          <Text style={styles.cardBullet}>• Acesse o App "MoPet" baixando-o na PlayStore ou Apple Store</Text>
          <Text style={styles.cardBullet}>• Faça seu cadastro com e-mail e senha</Text>
          <Text style={styles.cardBullet}>• Preencha os dados do seu animal</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={250} style={styles.card}>
          <Text style={styles.cardTitle}>Requisitos para castração</Text>
          <Text style={styles.cardBullet}>• Idade entre 4 meses e 7 anos</Text>
          <Text style={styles.cardBullet}>• Peso entre 3 e 25 quilos</Text>
          <Text style={styles.cardBullet}>• Tutor maior de 18 anos</Text>
        </Animatable.View>
      </ScrollView>
    </HeaderLayout>
  );
}