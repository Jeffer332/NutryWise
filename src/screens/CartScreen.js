import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView, // ✅ Importar SafeAreaView
} from "react-native";
import { getFirestore, collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { auth } from "../services/firebase";

const CartScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [processingOrder, setProcessingOrder] = useState(false);
  const db = getFirestore();

  // 📌 Obtener datos del usuario desde Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        Alert.alert("Error", "No se pudo obtener los datos del usuario.");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  // 📌 Obtener productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos_saludables"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los productos.");
      }
    };

    fetchProducts();
  }, []);

  // 📌 Añadir productos al carrito
  const handleAddToCart = (product) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: {
        ...product,
        quantity: (prevCart[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  // 📌 Modificar cantidad de productos en el carrito
  const handleChangeQuantity = (id, quantity) => {
    if (quantity <= 0) {
      const updatedCart = { ...cart };
      delete updatedCart[id];
      setCart(updatedCart);
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        [id]: { ...prevCart[id], quantity },
      }));
    }
  };

  // 📌 Calcular total del pedido
  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 📌 Manejar el pedido y guardarlo en Firestore
  const handleCheckout = async () => {
    if (loadingUser) {
      Alert.alert("Cargando", "Espere mientras se obtienen los datos del usuario.");
      return;
    }

    if (!userData || !auth.currentUser) {
      Alert.alert("Error", "No se ha encontrado el usuario autenticado.");
      return;
    }

    if (Object.keys(cart).length === 0) {
      Alert.alert("Carrito vacío", "Añade productos antes de hacer el pedido.");
      return;
    }

    setProcessingOrder(true);

    console.log("Usuario autenticado:", userData);

    const orderDetails = Object.values(cart).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }));

    const orderData = {
      userId: auth.currentUser.uid,
      userEmail: userData.email,
      date: new Date().toISOString(),
      items: orderDetails,
      total: total.toFixed(2),
      status: "pendiente",
    };

    try {
      await addDoc(collection(db, "pedidos"), orderData);
      Alert.alert("Pedido realizado", "Tu pedido ha sido guardado con éxito.");
      setCart({});
    } catch (error) {
      console.error("Error guardando el pedido:", error);
      Alert.alert("Error", "No se pudo guardar el pedido.");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}> 
      <Text style={styles.title}>Carrito de Compras</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text>{item.name} - ${item.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
              <Text style={styles.addButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <FlatList
        data={Object.values(cart)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name} - ${item.price.toFixed(2)}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(item.quantity)}
              onChangeText={(text) => handleChangeQuantity(item.id, Number(text))}
            />
          </View>
        )}
      />

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={processingOrder}>
        {processingOrder ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkoutText}>Hacer Pedido</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color:"green",
    paddingVertical:20
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
    marginVertical: 5,
  },
  input: {
    width: 40,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: "#FF5733",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
