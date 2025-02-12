import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Dimensions
} from "react-native"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { auth } from "../services/firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"

const ThreeDView = ({ navigation }) => {
  const [userData, setUserData] = useState(null)
  const [streakDays, setStreakDays] = useState(0)
  const bounceAnim = useState(new Animated.Value(0))[0]
  const screenWidth = Dimensions.get("window").width

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    if (userData) {
      const streak = calculateStreak(userData.achievementDays)
      setStreakDays(streak)
    }
  }, [userData])

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        const firestoreDb = getFirestore()
        const userDoc = await getDoc(doc(firestoreDb, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const calculateStreak = (achievementDays) => {
    if (!achievementDays || achievementDays.length === 0) return 0
    return achievementDays.length
  }

  const getPetLevel = (streak) => {
    if (streak < 40) return 1
    if (streak < 80) return 2
    if (streak < 100) return 3
    return 4
  }

  const getPetImage = (level) => {
    switch (level) {
      case 1:
        return require("../../assets/pet1.png")
      case 2:
        return require("../../assets/pet2.png")
      case 3:
        return require("../../assets/pet3.png")
      case 4:
        return require("../../assets/pet4.png")
      default:
        return require("../../assets/pet1.png")
    }
  }

  const petLevel = getPetLevel(streakDays)
  const nextPets = [petLevel + 1, petLevel + 2, petLevel + 3].filter(level => level <= 4)

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.ViewContainer}>
        {/* Consejos y reglas */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Consejos para mantener la racha</Text>
          <Text style={styles.tip}>🥦 Come saludable y registra tu comida.</Text>
          <Text style={styles.tip}>🚶 Mantente activo al menos 30 minutos al día.</Text>
          <Text style={styles.tip}>💧 Bebe suficiente agua y mantén hábitos saludables.</Text>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Día {streakDays} / 100</Text>
          <View style={styles.progressBarWrapper}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min((streakDays / 100) * 100, 100)}%`,
                  backgroundColor: streakDays < 40 ? "#4CAF50" : streakDays < 80 ? "#FFC107" : "#FF5722",
                },
              ]}
            />
          </View>
          <View style={styles.hitos}>
            {[40, 80, 100].map((hito) => (
              <View key={hito} style={styles.hito}>
                <Text style={styles.hitoText}>{hito}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mascota actual */}
        <View style={styles.petContainer}>
          <Animated.Image source={getPetImage(petLevel)} style={styles.petImage} />
        </View>

        {/* Carrusel de futuras mascotas */}
        <Text style={styles.sectionTitle}>Próximas Evoluciones</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {nextPets.map((level, index) => (
            <View key={index} style={[styles.nextPetContainer, { width: screenWidth * 0.3 }]}>
              <Image source={getPetImage(level)} style={styles.nextPetImage} />
              <Text style={styles.nextPetText}>Día {level * 40}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Botón para alimentar */}
        <TouchableOpacity style={styles.feedButton}>
          <Text style={styles.feedButtonText}>Alimentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E2E" },
  ViewContainer: { flex: 1, padding: 20 },

  // Consejos
  tipsContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF", marginBottom: 10 },
  tip: { fontSize: 16, color: "#DDD", marginBottom: 5 },

  // Barra de progreso
  progressContainer: { marginBottom: 20 },
  progressText: { fontSize: 18, fontWeight: "bold", color: "#FFF", textAlign: "center", marginBottom: 5 },
  progressBarWrapper: {
    height: 20,
    width: "100%",
    backgroundColor: "#2E2E3E",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: { height: "100%", borderRadius: 10 },
  hitos: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  hito: { backgroundColor: "#FFF", borderRadius: 15, padding: 5 },
  hitoText: { fontWeight: "bold", color: "#000" },

  // Mascota
  petContainer: { alignItems: "center", marginVertical: 20 },
  petImage: { width: 250, height: 250, resizeMode: "contain" },

  // Carrusel
  carousel: { padding: 10, flexDirection: "row", justifyContent: "center" },
  nextPetContainer: { marginHorizontal: 10, alignItems: "center" },
  nextPetImage: { width: 80, height: 80, borderRadius: 10, resizeMode: "contain" },
  nextPetText: { fontSize: 14, color: "#fff", marginTop: 5, fontWeight: "bold" },

  // Botón
  feedButton: { backgroundColor: "#FF5722", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  feedButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
})

export default ThreeDView
