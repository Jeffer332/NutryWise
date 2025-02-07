// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginScreenStyles from '../styles/LoginScreenStyles';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const db = getFirestore(); // Inicializa Firestore

  const handleLogin = async () => {
    try {
      //validar que el usuario exista aprovechando la autenticación y capturamos datos del usuario
      const cap_user = await signInWithEmailAndPassword(auth, email, password);
      //console.log(cap_user);
      const user = cap_user.user; //captura exclusiva de los datos del usuario autenticado
      //console.log(user);
      // obtenemos la colección referente al usuario autenticado
      const user_Ref = doc(db,'users',user.uid);
      const doc_datos_user = await getDoc(user_Ref);
      //console.log(doc_datos_user.data())
      if (doc_datos_user.exists()){
        const datos_user = doc_datos_user.data();
        const email_original = datos_user.email;
        console.log(email_original)
        console.log(email)
        //validamos que el correo sea exáctamente similar al de la base
        if (email === email_original){
          navigation.navigate('Home');
        }else{
          alert("Error al iniciar sesión. Verifica tus credenciales.");
        }
      }else{
        alert("El usuario no existe");
      }
    } catch (error) {
      //console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={LoginScreenStyles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={{ height: '50%', width: '100%' }} // Cambia el tamaño de la imagen de fondo a 50%
      >
        <View style={LoginScreenStyles.container}>
          <Image source={require('../../assets/logo.jpeg')} style={LoginScreenStyles.logo} />
          
          <View style={LoginScreenStyles.buttonContainer}>
            <TouchableOpacity style={LoginScreenStyles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={LoginScreenStyles.buttonText}>Ingreso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={LoginScreenStyles.button2} onPress={() => navigation.navigate('Register')}>
              <Text style={LoginScreenStyles.buttonText}>Registro</Text>
            </TouchableOpacity>
          </View>

          <View style={LoginScreenStyles.formContainer}>
            <TextInput
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              style={LoginScreenStyles.input}
            />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={LoginScreenStyles.input}
            />
            <TouchableOpacity style={LoginScreenStyles.button} onPress={handleLogin}>
              <Text style={LoginScreenStyles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;