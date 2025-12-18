import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  content: { padding: 20 },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f1f1f1',
    color: '#9EA0A4',
  },

  radioGroup: { flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 10 },
  radioButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  radioButtonSelected: { backgroundColor: '#D69A3A', borderColor: '#D69A3A' },
  radioText: { color: '#333', fontWeight: 'bold' },
  radioTextSelected: { color: '#FFF', fontWeight: 'bold' },

  imageContainer: { marginTop: 10, marginBottom: 10 },
  imagem: { width: '100%', height: 220, marginTop: 10, borderRadius: 10 },
  emptyImage: {
    height: 220,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImageText: { color: '#9EA0A4', fontSize: 14 },

  selectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D69A3A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#D69A3A',
    fontWeight: 'bold',
    fontSize: 16,
  },

  unknownChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D69A3A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
  },
  unknownChipOn: { backgroundColor: '#D69A3A', borderColor: '#D69A3A' },
  unknownText: { color: '#D69A3A', fontWeight: '600' },
  unknownTextOn: { color: '#fff' },

  botao: {
    backgroundColor: '#D69A3A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default styles;