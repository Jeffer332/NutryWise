// src/styles/RegisterScreenStyles.js
import { StyleSheet } from 'react-native';

const RegisterScreenStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageBackground: {
    height: '50%', // Cambia esto a 50% para que ocupe solo la mitad superior
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white', // Fondo blanco sin transparencia
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //position: 'absolute', // Cambiado a absolute para centrar el cuadro
    marginTop: '25%', // Ajusta la posición vertical del cuadro
    top: '40%', // Ajusta la posición vertical del cuadro
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  dropdown: {
    height: 40, // Asegúrate de que el dropdown tenga la misma altura que los otros campos
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20, // Espacio adicional
    paddingHorizontal: 163,
    width: '100%',
    backgroundColor: 'white', // Asegúrate de que el fondo sea blanco
    textAlign: 'left', // Alineación a la izquierda
  },
  button: {
    backgroundColor: '#0583F2',
    padding: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  passwordStrengthBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 10,
  },
  passwordStrengthBar: {
    height: '100%',
    borderRadius: 5,
  },
  passwordStrength: {
    fontSize: 14,
    marginTop: 5,
    padding: 10,
  },
});

export default RegisterScreenStyles;