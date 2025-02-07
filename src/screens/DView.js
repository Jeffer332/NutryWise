// src/screens/DView.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Importa WebView
import Footer from '../components/Footer'; // Importa el Footer
import Header from '../components/Header'; // Importa el Header

const ThreeDView = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.webViewContainer}>



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
  webViewContainer: {
    flex: 1, // Ocupa el espacio entre el header y el footer
  },
});

export default ThreeDView;