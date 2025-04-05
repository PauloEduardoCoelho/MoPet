import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#D69A3A',
    },
    header: {
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 16,
    },
    headerTitle: {
      color: '#FFF',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    content: {
      flex: 1,
      backgroundColor: '#FFF',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      overflow: 'hidden',
    },
    searchArea: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 30,
      paddingLeft: 16,
      overflow: 'hidden',
      elevation: 5,
    },
    input: {
      flex: 1,
      height: 48,
      color: '#333',
      paddingRight: 12,
    },
    searchButton: {
      backgroundColor: '#D69A3A',
      paddingHorizontal: 16,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: '#D69A3A',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 20,
      elevation: 4,
    },
    image: {
      width: 70,
      height: 70,
      resizeMode: 'cover',
    },
    cardContent: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
    },
    nome: {
      color: '#fff',
      fontWeight: 'bold',
    },
    cpf: {
      color: '#fff',
      fontSize: 13,
    },
    iconArea: {
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
  });
  