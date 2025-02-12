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
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import RegisterScreenStyles from '../styles/RegisterScreenStyles';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('');
  const [estatura, setEstatura] = useState('');
  const [peso, setPeso] = useState('');
  const [password, setPassword] = useState('');

  const db = getFirestore();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        email,
        edad,
        estatura,
        peso,
        password
      });

      Alert.alert('Registro exitoso', 'Usuario registrado correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error al registrar:", error);
      Alert.alert("Error al registrar", error.message);
    }
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
            onChangeText={(value) => {
              setPassword(value);
            }}
          />

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
