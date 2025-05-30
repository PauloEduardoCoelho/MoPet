import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D69A3A',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 14,
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: 10,
  },
});

export default styles;