import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D69A3A',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D69A3A',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#222',
  },
  disabledInput: {
    backgroundColor: '#f1f1f1',
    color: '#9EA0A4',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },
  radioButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#D69A3A',
    borderColor: '#D69A3A',
  },
  radioText: {
    color: '#333',
    fontWeight: 'bold',
  },
  radioTextSelected: {
    color: '#FFF',
  },
  botao: {
    backgroundColor: '#D69A3A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // novos estilos para o chip "Não sei informar"
  unknownChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D69A3A',
    backgroundColor: '#fff',
  },
  unknownChipOn: {
    backgroundColor: '#D69A3A',
    borderColor: '#D69A3A',
  },
  unknownText: {
    color: '#D69A3A',
    fontWeight: '600',
  },
  unknownTextOn: {
    color: '#fff',
  },
});

export default styles;