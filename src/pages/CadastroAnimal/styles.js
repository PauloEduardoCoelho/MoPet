import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#fff',
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
  },
  dataTexto: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
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
});

export default styles;