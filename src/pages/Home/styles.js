import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF6E8',
    borderColor: '#FFE0A6',
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#A86B07', marginBottom: 4 },
  heroText: { color: '#5b5b5b' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1b1b1b', marginBottom: 8 },
  cardText: { color: '#555', lineHeight: 20 },
  cardBullet: { color: '#444', marginTop: 6 },

  cta: {
    marginTop: 12,
    backgroundColor: '#D69A3A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
});

export default styles;