import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import styles from './styles';
import Footer from "../../components/footer";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Text animation="fadeInLeft" delay={300} style={styles.headerTitle}>
          Menu Principal
        </Animatable.Text>
      </View>

      <View style={styles.content}>

      </View>

      <Footer />
    </View>
  );
}
