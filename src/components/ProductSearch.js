"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"

const ProductSearch = ({ onClose, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const firestoreDb = getFirestore()

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        searchProducts(searchTerm)
      }, 300)

      return () => clearTimeout(delayDebounceFn)
    } else {
      setProducts([])
    }
  }, [searchTerm])

  const searchProducts = async (term) => {
    const productsRef = collection(firestoreDb, "nutryproducts")
    const q = query(productsRef, where("product_name", ">=", term), where("product_name", "<=", term + "\uf8ff"))
    const querySnapshot = await getDocs(q)
    const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setProducts(results)
  }

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => onProductSelect(item)}>
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productDetails}>{`${item.unit_calories} cal / ${item.unit_weight}${item.weight_unit}`}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        style={styles.productList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A2E",
    padding: 20,
    marginTop: 50,
  },
  searchBox: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFE55C",
    fontSize: 16,
  },
  productList: {
    flex: 1,
  },
  productItem: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  productName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  productDetails: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
  },
})

export default ProductSearch

