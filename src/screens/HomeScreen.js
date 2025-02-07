// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer'; // Importa el Footer

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const firestoreDb = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser ;
      if (user) {
        const userDoc = await getDoc(doc(firestoreDb, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
            <Text style={styles.userProvince}>{`${userData.edad} / ${userData.estatura} / ${userData.peso}`}</Text>
          </View>
        )}
        <TouchableOpacity>
          <Image source={require('../../assets/user.jpg')} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Usar el componente Footer */}
      <Footer activeScreen="Home" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#191A2E',
    elevation: 5,
    marginTop: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  userProvince: {
    fontSize: 14,
    color: 'gray',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default HomeScreen;