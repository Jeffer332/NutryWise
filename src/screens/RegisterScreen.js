// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ImageBackground, 
  Image, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { auth } from '../services/firebase'; // Importa la conexión a Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importa la función de registro
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Importa Firestore
import RegisterScreenStyles from '../styles/RegisterScreenStyles'; // Importa los estilos

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [estatura, setEstatura] = useState('');
  const [peso, setPeso] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Débil');

  const db = getFirestore(); // Inicializa Firestore

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda los datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        email,
        edad,
        estatura,
        peso,
        passwordStrength
      });

      Alert.alert('Registro exitoso', 'Usuario registrado correctamente.');
      navigation.navigate('Home'); // Redirige a la siguiente pantalla
    } catch (error) {
      console.error("Error al registrar:", error);
      Alert.alert("Error al registrar", error.message);
    }
  };

  const validatePasswordStrength = (password) => {
    if (password.length < 6) return 'Débil';
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[\W]/.test(password)) {
      return 'Fuerte';
    }
    return 'Media';
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(validatePasswordStrength(value));
  };

  return (
    <KeyboardAvoidingView
      style={RegisterScreenStyles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={RegisterScreenStyles.imageBackground}
      >
        <View style={RegisterScreenStyles.container}>
          <Image source={require('../../assets/logo.jpeg')} style={RegisterScreenStyles.logo} />

          <Text style={RegisterScreenStyles.title}>Registro</Text>

          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Apellido"
            value={surname}
            onChangeText={setSurname}
          />
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Edad"
            value={edad}
            onChangeText={setEdad}
          />
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Estatura"
            value={estatura}
            onChangeText={setEstatura}
          />
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Peso"
            value={peso}
            onChangeText={setPeso}
          />
          <TextInput
            style={RegisterScreenStyles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
          />

          {/* Barra de fortaleza de la contraseña */}
          <View style={RegisterScreenStyles.passwordStrengthBarContainer}>
            <View 
              style={[
                RegisterScreenStyles.passwordStrengthBar, 
                {
                  backgroundColor: passwordStrength === 'Débil' ? 'red' : passwordStrength === 'Media' ? 'orange' : 'green',
                  width: passwordStrength === 'Débil' ? '33%' : passwordStrength === 'Media' ? '66%' : '100%'
                }
              ]}
            />
          </View>

          {/* Indicador de fortaleza */}
          <Text style={[RegisterScreenStyles.passwordStrength, { color: passwordStrength === 'Débil' ? 'red' : passwordStrength === 'Media' ? 'orange' : 'green' }]}>
            Fortaleza de la contraseña: {passwordStrength}
          </Text>

          <TouchableOpacity style={RegisterScreenStyles.button} onPress={handleRegister}>
            <Text style={RegisterScreenStyles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={RegisterScreenStyles.link}>¿Ya tienes una cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;