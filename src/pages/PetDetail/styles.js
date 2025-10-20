import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // topo âmbar
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#D69A3A',
    position: 'relative',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerClose: {
    position: 'absolute',
    right: 12,
    top: 56,
    padding: 6,
  },

  // conteúdo branco com bordas arredondadas
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  // imagem do pet
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  cardTitle: {
    color: '#C2862F',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },

  // campos
  fieldLabel: {
    color: '#909090',
    fontSize: 13,
  },
  fieldValue: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
});

export default styles;