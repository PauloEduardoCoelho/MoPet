import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D69A3A',
    marginBottom: 30,
    alignSelf: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '47%',
    height: 120,
    marginBottom: 20,
  },
  iconLabel: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },  
});

export default styles;