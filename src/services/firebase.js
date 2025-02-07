// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa el módulo de autenticación
import { getAnalytics } from "firebase/analytics"; // Si necesitas analíticas

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB48JDDMuvkQhwPLTQq5WIsRnYra4tX5-8",
  authDomain: "nutrywise-ba1b8.firebaseapp.com",
  databaseURL: "https://nutrywise-ba1b8-default-rtdb.firebaseio.com",
  projectId: "nutrywise-ba1b8",
  storageBucket: "nutrywise-ba1b8.firebasestorage.com",
  messagingSenderId: "1003469030739",
  appId: "1:1003469030739:web:825452f00b85f7f0e5cda6",
  measurementId: "G-G8FP1620ES"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializa el servicio de autenticación
const analytics = getAnalytics(app); // Si decides usar analíticas

export { auth }; // Exporta el objeto de autenticación