"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image, Linking } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import * as Location from "expo-location"

const ProductSearchG = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [places, setPlaces] = useState([])
  const [location, setLocation] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita acceso a la ubicación para buscar lugares cercanos.")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  const searchNearbyPlaces = () => {
    if (!location) {
      Alert.alert("Ubicación no disponible", "Por favor, espere a que se obtenga su ubicación.")
      return
    }

    if (searchTerm.trim() === "") {
      Alert.alert("Búsqueda vacía", "Por favor, ingrese un producto para buscar.")
      return
    }

    // Esta es una llamada API simulada. En una app real, llamarías a tu API backend aquí.
    const mockPlaces = [
      {
        id: "1",
        name: "Supermercado Fresh",
        type: "Tienda",
        distance: 1.2,
        products: ["Frutas", "Verduras", "Lácteos"],
        image: "https://example.com/fresh.jpg",
        coords: { latitude: 40.7128, longitude: -74.006 },
      },
      {
        id: "2",
        name: "Granja El Amanecer",
        type: "Productor",
        distance: 2.5,
        products: ["Huevos", "Leche"],
        image: "https://example.com/farm.jpg",
        coords: { latitude: 40.7129, longitude: -74.0061 },
      },
      {
        id: "3",
        name: "Mercado Local",
        type: "Tienda",
        distance: 0.8,
        products: ["Frutas", "Verduras", "Carnes"],
        image: "https://example.com/market.jpg",
        coords: { latitude: 40.713, longitude: -74.0062 },
      },
      {
        id: "4",
        name: "Avícola San Juan",
        type: "Productor",
        distance: 3.2,
        products: ["Huevos", "Pollo"],
        image: "https://example.com/poultry.jpg",
        coords: { latitude: 40.7131, longitude: -74.0063 },
      },
    ]

    const filteredPlaces = mockPlaces.filter((place) =>
      place.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    setPlaces(filteredPlaces)

    if (filteredPlaces.length === 0) {
      Alert.alert("Sin resultados", "No se encontraron lugares para este producto.")
    }
  }

  const openMaps = (coords) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`
    Linking.openURL(url)
  }

  const renderPlaceItem = ({ item }) => (
    <View style={styles.placeItem}>
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeType}>{item.type}</Text>
        <Text style={styles.placeDistance}>{item.distance.toFixed(1)} km</Text>
        <Text style={styles.placeProducts}>{item.products.join(", ")}</Text>
        <TouchableOpacity style={styles.directionsButton} onPress={() => openMaps(item.coords)}>
          <MaterialIcons name="directions" size={24} color="#fff" />
          <Text style={styles.directionsButtonText}>Cómo llegar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor="#8E8E93"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchNearbyPlaces}>
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={places}
        renderItem={renderPlaceItem}
        keyExtractor={(item) => item.id}
        style={styles.placeList}
        contentContainerStyle={styles.placeListContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            {places.length === 0 ? "Busca un producto para ver resultados" : "No se encontraron lugares"}
          </Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    color: "#000",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeList: {
    flex: 1,
  },
  placeListContent: {
    paddingBottom: 20,
  },
  placeItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  placeInfo: {
    padding: 15,
  },
  placeName: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  placeType: {
    color: "#007AFF",
    fontSize: 16,
    marginBottom: 5,
  },
  placeDistance: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 5,
  },
  placeProducts: {
    color: "#000",
    fontSize: 14,
    marginBottom: 10,
  },
  directionsButton: {
    backgroundColor: "#34C759",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  emptyListText: {
    color: "#8E8E93",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
})

export default ProductSearchG

