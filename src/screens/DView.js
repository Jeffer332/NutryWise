import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView
} from "react-native"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { auth } from "../services/firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { Feather } from '@expo/vector-icons'

const ThreeDView = ({ navigation }) => {
  const [userData, setUserData] = useState(null)
  const [streakDays, setStreakDays] = useState(0)
  const bounceAnim = useState(new Animated.Value(0))[0]
  const screenWidth = Dimensions.get("window").width

  useEffect(() => {
    fetchUserData()
    animatePet()
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

  const animatePet = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start(() => animatePet())
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

  const achievements = [
    { text: "Registra una comida", completed: true },
    { text: "cumpleta tu circulo de calorias diaria", completed: true },
    { text: "Haz una consulta al chat", completed: true },
  ]

  const reactions = [
    { emoji: "❤️", count: 234 },
    { emoji: "👍", count: 120 },
    { emoji: "😊", count: 89 },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mascotaCard}>
          {/* Timer Display */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerValue}>Días de racha</Text>
            <Text style={styles.timerValue}>{streakDays}</Text>
          </View>

          {/* Current Pet */}
          <Animated.View style={[styles.petContainer, { transform: [{ scale: bounceAnim }] }]}>
            <Image 
              source={getPetImage(petLevel)}
              style={styles.mascotaImage}
            />
          </Animated.View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Día {streakDays} / 100</Text>
            <View style={styles.progressBarWrapper}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min((streakDays / 100) * 100, 100)}%`,
                    backgroundColor: streakDays < 40 ? "#32D74B" : streakDays < 80 ? "#FF9500" : "#FF3B30",
                  },
                ]}
              />
            </View>
            <View style={styles.milestones}>
              {[40, 80, 100].map((milestone) => (
                <View key={milestone} style={styles.milestone}>
                  <Text style={styles.milestoneText}>{milestone}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Haz crecer tu mascota</Text>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementRow}>
                <View style={styles.checkmarkContainer}>
                  <Feather name="check" size={16} color="#32D74B" />
                </View>
                <Text style={styles.achievementText}>{achievement.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Next Pets */}
          <Text style={styles.sectionTitle}>Próximas Evoluciones</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.nextPetsScroll}
          >
            {nextPets.map((level, index) => (
              <View key={index} style={styles.nextPetContainer}>
                <Image source={getPetImage(level)} style={styles.nextPetImage} />
                <Text style={styles.nextPetText}>Día {level * 40}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* Reactions */}
          <Text style={styles.reactionTitle}>Tus insignias de racha</Text>
          <View style={styles.reactionsContainer}>
            {reactions.map((reaction, index) => (
              <View key={index} style={styles.reactionItem}>
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                <Text style={styles.reactionCount}>{reaction.count}</Text>
              </View>
            ))}
          </View>

          {/* Feed Button */}
          <TouchableOpacity style={styles.feedButton}>
            <Text style={styles.feedButtonText}>Alimentar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer activeScreen="ThreeDView" navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    marginTop: -60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mascotaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  petContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mascotaImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  milestone: {
    alignItems: 'center',
  },
  milestoneText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5F9E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementText: {
    fontSize: 16,
    color: '#000000',
  },
  nextPetsScroll: {
    marginBottom: 24,
  },
  nextPetContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  nextPetImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  nextPetText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 24,
  },
  reactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  reactionItem: {
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  feedButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  feedButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
})

export default ThreeDView