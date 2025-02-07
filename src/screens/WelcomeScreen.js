// src/screens/WelcomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  Easing
} from 'react-native-reanimated'; // Importa Animated y sus utilidades
import WelcomeScreenStyles from '../styles/WelcomeScreenStyles';

const WelcomeScreen = ({ navigation }) => {
  const scale = useSharedValue(0); // Valor compartido para la animación de escala
  const opacity = useSharedValue(0); // Valor compartido para la animación de opacidad

  // Configura la animación de escala y fade-in
  useEffect(() => {
    scale.value = withTiming(1, { 
      duration: 1000, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
    opacity.value = withTiming(1, { 
      duration: 1000, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
  }, []);

  // Usa useEffect para manejar la navegación después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login'); // Navega a la pantalla LoginScreen
    }, 2000); // 5000 milisegundos = 5 segundos

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [navigation]);

  // Estilo animado para el logo
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')} // Asegúrate de tener una imagen en la carpeta assets
      style={WelcomeScreenStyles.background}
    >
      <View style={WelcomeScreenStyles.overlay}>
        <Text style={WelcomeScreenStyles.title}>AIDrive</Text>
        {/* Agrega el logo con animación */}
        <Animated.Image
          source={require('../../assets/logo.jpeg')} // Asegúrate de tener un logo en la carpeta assets
          style={[WelcomeScreenStyles.logo, animatedStyles]} // Aplica el estilo animado
        />
        <Text style={WelcomeScreenStyles.subtitle}>Bienvenido</Text>
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;