import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function LoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animatable.Image
          animation="pulse"
          easing="ease-in-out"
          iterationCount="infinite"
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animatable.Text
        animation="fadeInUp"
        delay={800}
        duration={1000}
        style={styles.powered}
      >
        From PJ
      </Animatable.Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D69A3A',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
  powered: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.5,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
