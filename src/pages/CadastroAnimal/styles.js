import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D69A3A',
  },
  header: {
    backgroundColor: '#D69A3A',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 100,
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
  },
  lockedInput: {
    backgroundColor: '#e0e0e0',
  },
  imagem: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 6,
  },
  mapa: {
    width: '100%',
    height: 300,
    marginTop: 10,
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
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  emptyImage: {
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  emptyImageText: {
    color: '#999',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#D69A3A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default styles;