import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import ProgressCircle from '../components/ProgressCircle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const firestoreDb = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('userData');
        if (cachedData) {
          setUserData(JSON.parse(cachedData));
        } else {
          const user = auth.currentUser;
          if (user) {
            const userDoc = await getDoc(doc(firestoreDb, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUserData(data);
              await AsyncStorage.setItem('userData', JSON.stringify(data));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const progressData = {
    calories: userData?.calories || 0,
    water: userData?.water || 0,
    exercise: userData?.exercise || 0,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${userData.name} ${userData.surname}`}</Text>
            <Text style={styles.userDetails}>{`${userData.edad} años / ${userData.estatura} cm / ${userData.peso} kg`}</Text>
          </View>
        )}
        <TouchableOpacity onPress={handleProfilePress} accessible={true} accessibilityLabel="User profile">
          <Image 
            source={userData?.profileImage ? { uri: userData.profileImage } : require('../../assets/user.jpg')} 
            style={styles.profileImage} 
            accessibilityLabel="User profile image"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Progress Circles */}
        <View style={styles.progressContainer}>
          <ProgressCircle 
            percentage={(progressData.calories / 500) * 100} 
            label="Calorías" 
            color="#FF5733" 
            iconName="local-fire-department" 
            value={progressData.calories}
            total={500}
          />
          <ProgressCircle 
            percentage={(progressData.water / 8) * 100} 
            label="Vasos de agua" 
            color="#3498DB" 
            iconName="local-drink" 
            value={progressData.water}
            total={8}
          />
          <ProgressCircle 
            percentage={(progressData.exercise / 30) * 100} 
            label="Ejercicio" 
            color="#2ECC71" 
            iconName="directions-run" 
            value={progressData.exercise}
            total={30}
          />
        </View>

        {/* Metrics Card */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <MaterialIcons name="local-fire-department" size={24} color="#FF5733" />
            <Text style={styles.metricValue}>{progressData.calories}</Text>
            <Text style={styles.metricLabel}>/500kcal</Text>
          </View>
          
          <View style={styles.metricItem}>
            <MaterialIcons name="directions-walk" size={24} color="#3498DB" />
            <Text style={styles.metricValue}>{progressData.water}</Text>
            <Text style={styles.metricLabel}>/8 vasos</Text>
          </View>
          
          <View style={styles.metricItem}>
            <MaterialIcons name="directions-run" size={24} color="#2ECC71" />
            <Text style={styles.metricValue}>{progressData.exercise}</Text>
            <Text style={styles.metricLabel}>/30mins</Text>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.weeklyCalendar}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <View 
              key={index} 
              style={[
                styles.dayCircle,
                index === 4 && styles.activeDayCircle
              ]}
            >
              <Text style={[
                styles.dayText,
                index === 4 && styles.activeDayText
              ]}>{day}</Text>
              <Text style={styles.dateText}>{index + 3}</Text>
            </View>
          ))}
        </View>

        {/* Macros Progress */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>kcal</Text>
            <Text style={styles.macroValue}>72 / 1,753</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '4%', backgroundColor: '#666' }]} />
            </View>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>6 / 138 g</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '10%', backgroundColor: '#FFE55C' }]} />
            </View>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>0 / 169 g</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%', backgroundColor: '#FFE55C' }]} />
            </View>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>5 / 58 g</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '8%', backgroundColor: '#FFE55C' }]} />
            </View>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.mealsContainer}>
          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <View style={styles.mealTitleContainer}>
                <Text style={styles.mealTitle}>Breakfast</Text>
                <Image source={require('../../assets/logo.jpeg')} style={styles.mealIcon} />
              </View>
              <Text style={styles.mealMacros}>72 kcal | 6 P | 0 C | 5 F</Text>
            </View>
            <View style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Image source={require('../../assets/logo.jpeg')} style={styles.foodIcon} />
                <View>
                  <Text style={styles.foodName}>Huevo</Text>
                  <Text style={styles.foodQuantity}>1 unidad (50 g)</Text>
                </View>
              </View>
              <Text style={styles.foodCalories}>72 kcal</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <View style={styles.mealTitleContainer}>
                <Text style={styles.mealTitle}>Lunch</Text>
                <Image source={require('../../assets/logo.jpeg')} style={styles.mealIcon} />
              </View>
              <Text style={styles.mealMacros}>0 kcal | 0 P | 0 C | 0 F</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <View style={styles.mealTitleContainer}>
                <Text style={styles.mealTitle}>Dinner</Text>
                <Image source={require('../../assets/logo.jpeg')} style={styles.mealIcon} />
              </View>
              <Text style={styles.mealMacros}>0 kcal | 0 P | 0 C | 0 F</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer activeScreen="Home" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191A2E',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191A2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 5,
    marginTop: 50,
  },
  logo: {
    width: 50,
    height: 50,
  },
  userInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
    color: 'gray',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1C1C1E',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  weeklyCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayCircle: {
    backgroundColor: '#FFE55C',
  },
  dayText: {
    color: '#666',
    fontSize: 12,
  },
  activeDayText: {
    color: '#000',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  macrosContainer: {
    padding: 20,
  },
  macroItem: {
    marginBottom: 15,
  },
  macroLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  macroValue: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  mealsContainer: {
    padding: 20,
  },
  mealSection: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    marginBottom: 10,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  mealIcon: {
    width: 20,
    height: 20,
  },
  mealMacros: {
    color: '#666',
    fontSize: 14,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
  },
  foodQuantity: {
    color: '#666',
    fontSize: 14,
  },
  foodCalories: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;