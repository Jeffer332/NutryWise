// src/screens/CameraScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer'; // Importa el Footer
import Header from '../components/Header'; // Importa el Header

const CameraScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.ViewContainer}>



      </View>
      {/* Usar el componente Footer */}
      <Footer activeScreen="DView" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ViewContainer: {
    flex: 1, // Ocupa el espacio entre el header y el footer
  },
});

export default CameraScreen;