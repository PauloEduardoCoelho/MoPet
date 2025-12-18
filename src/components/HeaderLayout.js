import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from './footer';

const FOOTER_HEIGHT = 64;

export default function HeaderLayout({ title, children, scroll = false }) {
  const insets = useSafeAreaInsets();

  const Header = (
    <View style={[styles.header, { paddingTop: Math.max(16, insets.top + 8) }]}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {Header}

      {scroll ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ padding: 16, paddingBottom: FOOTER_HEIGHT + Math.max(insets.bottom, 8) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { padding: 16, paddingBottom: FOOTER_HEIGHT + Math.max(insets.bottom, 8) }]}>
          {children}
        </View>
      )}

      {/* Footer agora faz parte do fluxo normal, sem absolute */}
      <View style={[styles.footerWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D69A3A' },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#D69A3A',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  footerWrap: {
    backgroundColor: '#fff',
  },
});