// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, 
  Alert, SafeAreaView, StyleSheet 
} from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigation = useNavigation();
  const firestoreDb = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(firestoreDb, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        Alert.alert('Error', 'No se pudo obtener los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestoreDb, 'users', user.uid);
        await updateDoc(userRef, {
          name: userData.name,
          edad: userData.edad,
          estatura: userData.estatura,
          peso: userData.peso,
        });

        Alert.alert('Éxito', 'Tu perfil ha sido actualizado.');
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Redirige a la pantalla de Login eliminando historial
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={userData?.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />

      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        value={userData?.edad}
        keyboardType="numeric"
        onChangeText={(text) => setUserData({ ...userData, edad: text })}
      />

      <Text style={styles.label}>Estatura (cm)</Text>
      <TextInput
        style={styles.input}
        value={userData?.estatura}
        keyboardType="numeric"
        onChangeText={(text) => setUserData({ ...userData, estatura: text })}
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        value={userData?.peso}
        keyboardType="numeric"
        onChangeText={(text) => setUserData({ ...userData, peso: text })}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loggingOut}>
        {loggingOut ? <ActivityIndicator color="#fff" /> : <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191A2E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
