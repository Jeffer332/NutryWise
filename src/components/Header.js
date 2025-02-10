// src/components/Header.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Header = () => (
  <View style={styles.header}>
    <Image source={require('../../assets/logo.png')} style={styles.logo} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0, // Espacio vertical para el header
    backgroundColor: '#191A2E',
    elevation: 5,
    marginTop: 50, // Asegúrate de que no haya margen superior
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default Header;