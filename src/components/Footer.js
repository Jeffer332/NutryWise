// src/components/Footer.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Footer = ({ activeScreen, navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={30} color={activeScreen === 'Home' ? '#494C73' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AsistenteVirtual')}>
        <Ionicons name="chatbubble-ellipses" size={30} color={activeScreen === 'AsistenteVirtual' ? '#494C73' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
        <Ionicons name="camera" size={30} color={activeScreen === 'Camera' ? '#494C73' : '#fff'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DView')}>
        <Ionicons name="logo-apple-ar" size={30} color={activeScreen === 'DView' ? '#494C73' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#191A2E',
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },
};

export default Footer;