import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from './footer';

const FOOTER_HEIGHT = 64;

export default function Screen({ children, scroll = false }) {
  const insets = useSafeAreaInsets();

  if (scroll) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ padding: 16, paddingBottom: FOOTER_HEIGHT + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        <View style={[styles.footerWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <Footer />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.content, { padding: 16, paddingBottom: FOOTER_HEIGHT + 24 }]}>
        {children}
      </View>

      <View style={[styles.footerWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
});