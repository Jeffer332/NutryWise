// src/styles/WelcomeScreenStyles.js
import { StyleSheet } from 'react-native';

const WelcomeScreenStyles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20, // Espacio entre el título y el logo
  },
  logo: {
    width: 150, // Ajusta el tamaño del logo
    height: 150, // Ajusta el tamaño del logo
    marginBottom: 20, // Espacio entre el logo y el subtítulo
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
  },
});

export default WelcomeScreenStyles;