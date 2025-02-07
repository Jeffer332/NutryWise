// src/styles/LoginScreenStyles.js
import { StyleSheet } from 'react-native';

const LoginScreenStyles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-start', // Cambiado a flex-start para que la imagen esté en la parte superior
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff', // Cambia a blanco sin transparencia
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    position: 'absolute', // Cambiado a absolute para centrar el cuadro
    top: '40%', // Ajusta la posición vertical del cuadro
    left: '5%', // Centra horizontalmente
    alignSelf: 'center', // Centra horizontalmente
    //transform: [{ translateX: -0.5 * '90%' }], // Ajusta la posición horizontalmente
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#0583F2',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  button2: {
    flex: 1,
    backgroundColor: '#494C73',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default LoginScreenStyles;