import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from '../components/footer';
import * as Animatable from 'react-native-animatable';

export default function Building() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text
          animation="fadeInLeft"
          delay={300}
          style={styles.headerText}
        >
          Desculpe...
        </Animatable.Text>
      </View>

      <View style={styles.content}>
        <Icon name="tools" size={80} color="#D69A3A" style={styles.icon} />
        <Text style={styles.title}>Página em construção</Text>
        <Text style={styles.description}>
          Essa funcionalidade ainda está sendo desenvolvida.
        </Text>
        <Text style={styles.description}>
          Em breve estará disponível. Pedimos desculpas!
        </Text>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D69A3A',
  },
  header: {
    height: 140,
    backgroundColor: '#D69A3A',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 70,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D69A3A',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
});
