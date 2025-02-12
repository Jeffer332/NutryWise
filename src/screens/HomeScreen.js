"use client"

import { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  Easing,
} from "react-native"
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore"
import { auth } from "../services/firebase"
import { useNavigation } from "@react-navigation/native"
import ProgressCircle from "../components/ProgressCircle"
import { MaterialIcons } from "@expo/vector-icons"
import WaterProgressBar from "../components/WaterProgressBar"

const HomeScreen = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [currentMeal, setCurrentMeal] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [waterCount, setWaterCount] = useState(0)
  const [celebrationAnim] = useState(new Animated.Value(0))
  const firestoreDb = getFirestore()
  const navigation = useNavigation()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(firestoreDb, "users", user.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setUserData(data)
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [firestoreDb])

  const handleProfilePress = useCallback(() => {
    navigation.navigate("Profile")
  }, [navigation])

  const handleAddFood = (meal) => {
    setCurrentMeal(meal)
    setSearchModalVisible(true)
  }

  const handleProductSelect = async (product) => {
    setSearchModalVisible(false)

    const user = auth.currentUser
    if (!user) return

    const userRef = doc(firestoreDb, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const userData = userDoc.data()
      const dateString = selectedDate.toISOString().split("T")[0]
      const meals = userData.meals || {}
      const dailyMeals = meals[dateString] || {}
      const mealItems = dailyMeals[currentMeal] || []

      const newMealItem = {
        id: Date.now().toString(),
        name: product.product_name,
        calories: product.unit_calories,
        protein: product.protein,
        carbs: product.carbohydrates,
        fat: product.fat,
      }

      mealItems.push(newMealItem)

      const updatedMeals = {
        ...meals,
        [dateString]: {
          ...dailyMeals,
          [currentMeal]: mealItems,
        },
      }

      await updateDoc(userRef, { meals: updatedMeals })

      // Update local state
      setUserData((prevData) => ({
        ...prevData,
        meals: updatedMeals,
      }))

      // Recalcular los totales y verificar si se alcanzó el objetivo
      const newTotals = calculateDailyTotals(updatedMeals[dateString])
      if (newTotals.calories >= 2000) {
        triggerCelebrationAnimation()
      }
    }
  }

  const searchProducts = async (term) => {
    const productsRef = collection(firestoreDb, "nutryproducts")
    const q = query(productsRef, where("product_name", ">=", term), where("product_name", "<=", term + "\uf8ff"))
    const querySnapshot = await getDocs(q)
    const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setSearchResults(results)
  }

  const calculateDailyTotals = (dailyMeals = userData?.meals?.[selectedDate.toISOString().split("T")[0]] || {}) => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

    Object.values(dailyMeals).forEach((meal) => {
      meal.forEach((item) => {
        totals.calories += item.calories || 0
        totals.protein += item.protein || 0
        totals.carbs += item.carbs || 0
        totals.fat += item.fat || 0
      })
    })

    // Only limit protein and fat
    totals.protein = Math.min(totals.protein, 100)
    totals.fat = Math.min(totals.fat, 65)

    return totals
  }

  const updateUserData = async (newData) => {
    const user = auth.currentUser
    if (user) {
      const userRef = doc(firestoreDb, "users", user.uid)
      await updateDoc(userRef, newData)
      setUserData((prevData) => ({ ...prevData, ...newData }))
    }
  }

  const incrementWaterCount = useCallback(() => {
    setWaterCount((prevCount) => Math.min(prevCount + 1, 8))
  }, [])

  const triggerCelebrationAnimation = useCallback(() => {
    Animated.timing(celebrationAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      celebrationAnim.setValue(0)
    })
  }, [])

  useEffect(() => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const dailyTotals = calculateDailyTotals(userData?.meals?.[dateString])
    if (dailyTotals.calories >= 1000) {
      if (!userData?.achievementDays?.includes(dateString)) {
        const updatedAchievementDays = [...(userData?.achievementDays || []), dateString]
        updateUserData({ achievementDays: updatedAchievementDays })
      }
      triggerCelebrationAnimation()
    } else {
      // Remove the date from achievementDays if calories are below 2000
      if (userData?.achievementDays?.includes(dateString)) {
        const updatedAchievementDays = userData.achievementDays.filter((day) => day !== dateString)
        updateUserData({ achievementDays: updatedAchievementDays })
      }
    }
  }, [selectedDate, userData, calculateDailyTotals, triggerCelebrationAnimation])

  const renderWeekCalendar = () => {
    const days = ["D", "L", "M", "M", "J", "V", "S"]
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))

    return (
      <View style={styles.weeklyCalendar}>
        {days.map((day, index) => {
          const date = new Date(weekStart)
          date.setDate(date.getDate() + index)
          const dateString = date.toISOString().split("T")[0]
          const isSelected = date.toDateString() === selectedDate.toDateString()
          const isAchievement = userData?.achievementDays?.includes(dateString)

          const animatedStyle = {
            transform: [
              {
                scale: celebrationAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.2, 1],
                }),
              },
            ],
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayCircle, isSelected && styles.activeDayCircle]}
              onPress={() => setSelectedDate(date)}
            >
              <Animated.View style={[styles.dayContent, isAchievement && animatedStyle]}>
                {isAchievement ? (
                  <>
                    <MaterialIcons
                      name="local-fire-department"
                      size={36}
                      color="#FF5733"
                      style={styles.achievementIcon}
                    />
                    <Text style={styles.achievementDateText}>{date.getDate()}</Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.dayText, isSelected && styles.activeDayText]}>{day}</Text>
                    <Text style={[styles.dateText, isSelected && styles.activeDateText]}>{date.getDate()}</Text>
                  </>
                )}
              </Animated.View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const handleDeleteFood = async (meal, itemId) => {
    const user = auth.currentUser
    if (!user) return

    const userRef = doc(firestoreDb, "users", user.uid)
    const dateString = selectedDate.toISOString().split("T")[0]

    const updatedMeals = { ...userData.meals }
    updatedMeals[dateString][meal] = updatedMeals[dateString][meal].filter((item) => item.id !== itemId)

    await updateDoc(userRef, { meals: updatedMeals })
    setUserData((prevData) => ({
      ...prevData,
      meals: updatedMeals,
    }))

    // Check if achievement status needs to be updated
    const newTotals = calculateDailyTotals(updatedMeals[dateString])
    if (newTotals.calories < 2000 && userData?.achievementDays?.includes(dateString)) {
      const updatedAchievementDays = userData.achievementDays.filter((day) => day !== dateString)
      updateUserData({ achievementDays: updatedAchievementDays })
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  const dailyTotals = calculateDailyTotals()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../assets/logo.jpeg")} style={styles.logo} />
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
            <Text
              style={styles.userDetails}
            >{`${userData.edad} años / ${userData.estatura} cm / ${userData.peso} kg`}</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleProfilePress} accessible={true} accessibilityLabel="User profile">
          <Image
            source={userData?.profileImage ? { uri: userData.profileImage } : require("../../assets/user.jpg")}
            style={styles.profileImage}
            accessibilityLabel="User profile image"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Weekly Calendar */}
        {renderWeekCalendar()}

        {/* Progress Circles */}
        <View style={styles.progressContainer}>
          <ProgressCircle
            percentage={(dailyTotals.calories / 1000) * 100}
            label="Calorías"
            color="#FF5733"
            iconName="local-fire-department"
            value={dailyTotals.calories}
            total={1000}
          />
          <ProgressCircle
            percentage={(dailyTotals.protein / 100) * 100}
            label="Proteína"
            color="#3498DB"
            iconName="fitness-center"
            value={dailyTotals.protein}
            total={100}
          />
          <ProgressCircle
            percentage={(dailyTotals.fat / 30) * 100}
            label="Grasas"
            color="#2ECC71"
            iconName="opacity"
            value={dailyTotals.fat}
            total={30}
          />
        </View>

        {/* Water Progress Bar */}
        <WaterProgressBar waterCount={waterCount} onIncrement={incrementWaterCount} />

        {/* Meals */}
        <View style={styles.mealsContainer}>
          {["Desayuno", "Almuerzo", "Cena", "Snacks"].map((meal, index) => {
            const dateString = selectedDate.toISOString().split("T")[0]
            const mealItems = userData?.meals?.[dateString]?.[meal] || []
            const mealTotals = mealItems.reduce(
              (acc, item) => ({
                calories: acc.calories + (item.calories || 0),
                protein: acc.protein + (item.protein || 0),
                carbs: acc.carbs + (item.carbs || 0),
                fat: acc.fat + (item.fat || 0),
              }),
              { calories: 0, protein: 0, carbs: 0, fat: 0 },
            )

            return (
              <View key={index} style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealTitleContainer}>
                    <Text style={styles.mealTitle}>{meal}</Text>
                    <MaterialIcons name="restaurant" size={24} color="#FFE55C" />
                  </View>
                  <Text style={styles.mealMacros}>
                    {`${mealTotals.calories} kcal | ${mealTotals.protein}P | ${mealTotals.carbs}C | ${mealTotals.fat}F`}
                  </Text>
                </View>
                {mealItems.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.foodItem}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <View style={styles.foodItemRight}>
                      <Text style={styles.foodCalories}>{item.calories} kcal</Text>
                      <TouchableOpacity onPress={() => handleDeleteFood(meal, item.id)}>
                        <MaterialIcons name="delete" size={20} color="#FF5733" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddFood(meal)}>
                  <MaterialIcons name="add" size={24} color="#fff" />
                  <Text style={styles.addButtonText}>Agregar alimento</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* Product Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buscar Alimento</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSearchModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar producto..."
                placeholderTextColor="#666"
                onChangeText={(text) => searchProducts(text)}
              />
            </View>
            <ScrollView style={styles.searchResultsContainer}>
              {searchResults.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.searchResultItem}
                  onPress={() => handleProductSelect(product)}
                >
                  <Text style={styles.productName}>{product.product_name}</Text>
                  <Text
                    style={styles.productDetails}
                  >{`${product.unit_calories} cal / ${product.unit_weight}${product.weight_unit}`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A2E",
    marginTop: 50,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191A2E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#1C1C1E",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  userDetails: {
    fontSize: 12,
    color: "#666",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  weeklyCalendar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1C1C1E",
    marginBottom: 10,
  },
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
  },
  dayContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  activeDayCircle: {
    backgroundColor: "#FFE55C",
  },
  dayText: {
    color: "#fff",
    fontSize: 12,
  },
  dateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeDayText: {
    color: "#000",
  },
  activeDateText: {
    color: "#000",
  },
  achievementIcon: {
    position: "absolute",
  },
  achievementDateText: {
    position: "absolute",
    top: 36,
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  mealsContainer: {
    padding: 15,
  },
  mealSection: {
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  mealMacros: {
    color: "#666",
    fontSize: 12,
  },
  foodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  foodItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodName: {
    color: "#fff",
    fontSize: 14,
  },
  foodCalories: {
    color: "#666",
    fontSize: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#191A2E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  searchResultsContainer: {
    flex: 1,
  },
  searchResultItem: {
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

export default HomeScreen