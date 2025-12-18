import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D69A3A',
  },
  containerHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    gap: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    color: '#333',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#D69A3A',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonGhost: {
    marginTop: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGhostText: {
    color: '#D69A3A',
    fontWeight: 'bold',
  },
});