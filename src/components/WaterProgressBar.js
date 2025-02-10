import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

const WaterProgressBar = ({ waterCount, onIncrement }) => {
  const maxWater = 8

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${(waterCount / maxWater) * 100}%` }]} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.countContainer}>
          <MaterialIcons name="local-drink" size={24} color="#3498DB" />
          <Text style={styles.countText}>
            {waterCount} / {maxWater}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onIncrement}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#2C2C2E",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3498DB",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#3498DB",
    borderRadius: 15,
    padding: 5,
  },
})

export default WaterProgressBar

