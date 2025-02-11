"use client"
import { View, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Footer from "../components/Footer"
import Header from "../components/Header"
import ProductSearchG from "../components/ProductSearchG"

const CameraScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.viewContainer}>
        <ProductSearchG />
      </View>
      <Footer activeScreen="Camera" navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A2E",
  },
  viewContainer: {
    flex: 1,
  },
})

export default CameraScreen

