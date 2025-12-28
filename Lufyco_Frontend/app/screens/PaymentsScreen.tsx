import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator"; // Import RootStackParamList

const { width } = Dimensions.get("window");

// Type the navigation prop
type PaymentsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Payments">;

const PaymentsScreen = () => {
  const navigation = useNavigation<PaymentsScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      {/* Image */}
      <Image source={require("../../assets/images/payments.png")} style={styles.image} />

      {/* Title & Subtitle */}
      <Text style={styles.title}>Safe and secure {"\n"}payments</Text>
      <Text style={styles.subtitle}>
        QuickMart employs industry-leading encryption and trusted payment gateways to safeguard your financial information.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
      <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.getStartedButtonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
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
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  getStartedButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  getStartedButtonText: {
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
    backgroundColor: "#000",
  },
});

export default PaymentsScreen;
