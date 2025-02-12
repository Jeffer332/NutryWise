// src/App.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserProvider, useUser } from './src/context/UserContext';

// Pantallas
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import DViewScreen from './src/screens/DView';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CartScreen from './src/screens/CartScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 Configuración de TabNavigator
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'ChatBot') {
            iconName = 'chatbubble-ellipses';
          } else if (route.name === 'Logros') {
            iconName = 'medal';
          } else if (route.name === 'Shop') {
            iconName = 'cart';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: { backgroundColor: '#f0f0f0', paddingBottom: 5 }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ChatBot" component={ChatScreen} />
      <Tab.Screen name="Logros" component={DViewScreen} />
      <Tab.Screen name="Shop" component={CartScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// 🔹 Navegación principal basada en la autenticación
const MainStack = () => {
  const { user } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Tabs" 
            component={Tabs} 
            options={{ gestureEnabled: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// 🔹 Estructura principal asegurando que `UserProvider` maneje todo
const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
