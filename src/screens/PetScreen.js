"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native-web" //Fixed import
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { auth } from "../services/firebase"
import { MaterialIcons } from "@expo/vector-icons"

const PetScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null)
  const [petLevel, setPetLevel] = useState(1)
  const [streakDays, setStreakDays] = useState(0)
  const [bounceAnim] = useState(new Animated.Value(0))

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    if (userData) {
      const streak = calculateStreak(userData.achievementDays)
      setStreakDays(streak)
      setPetLevel(calculatePetLevel(streak))
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

    const sortedDays = achievementDays.sort((a, b) => new Date(b) - new Date(a))
    let streak = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 1; i < sortedDays.length; i++) {
      const currentDay = new Date(sortedDays[i])
      const previousDay = new Date(sortedDays[i - 1])

      const diffDays = Math.floor((previousDay - currentDay) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const calculatePetLevel = (streak) => {
    if (streak < 7) return 1
    if (streak < 14) return 2
    if (streak < 30) return 3
    return 4
  }

  const getPetImage = () => {
    switch (petLevel) {
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

  const animatePet = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: -1, duration: 200, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Mascota Nutricional</Text>
      </View>

      <View style={styles.petContainer}>
        <Animated.Image
          source={getPetImage()}
          style={[
            styles.petImage,
            {
              transform: [
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-20, 0, 20],
                  }),
                },
              ],
            },
          ]}
        />
        <TouchableOpacity style={styles.feedButton} onPress={animatePet}>
          <Text style={styles.feedButtonText}>Alimentar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.streakText}>Racha actual: {streakDays} días</Text>
        <Text style={styles.levelText}>Nivel de mascota: {petLevel}</Text>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Consejos para mantener tu racha:</Text>
        <Text style={styles.tipText}>• Registra tus comidas diariamente</Text>
        <Text style={styles.tipText}>• Alcanza tu meta de calorías</Text>
        <Text style={styles.tipText}>• Mantén una dieta equilibrada</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A2E",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
  },
  petContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  petImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  feedButton: {
    backgroundColor: "#FFE55C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  feedButtonText: {
    color: "#191A2E",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  streakText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  levelText: {
    color: "#fff",
    fontSize: 18,
  },
  tipsContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  tipsTitle: {
    color: "#FFE55C",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tipText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
})

export default PetScreen

