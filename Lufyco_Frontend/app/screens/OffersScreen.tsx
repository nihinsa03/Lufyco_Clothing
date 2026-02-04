import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator"; // Import RootStackParamList

const { width } = Dimensions.get("window");

// Type the navigation prop
type OffersScreenNavigationProp = StackNavigationProp<RootStackParamList, "Offers">;

const OffersScreen = () => {
  const navigation = useNavigation<OffersScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Back Button - Optional if you want to keep it consistent with Intro, usually page 2 implies back is possible, but if 'like first one' means exactly, maybe remove? keeping for UX */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Image source={require("../../assets/images/2.png")} style={styles.image} />
      <Text style={styles.title}>Unlock exclusive offers {"\n"}and discounts</Text>
      <Text style={styles.subtitle}>
        Get access to limited-time deals and special promotions available only to our valued customers.
      </Text>
      {/* Next Button to Navigate to Payments Screen */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Payments")}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: width * 0.8,
    height: 440,
    borderRadius: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#777", // Matched Intro
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30, // Matched Intro
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15, // Matched Intro
    width: "100%", // Matched Intro
    alignItems: "center", // Matched Intro
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007BFF", // Matched Intro (Blue)
  },
});

export default OffersScreen;
