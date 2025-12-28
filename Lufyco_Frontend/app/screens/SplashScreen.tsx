import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, "Splash">;

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Intro"); // Navigate to the second screen after 5 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/fashion.png")} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Fashion</Text>
        <Text style={styles.subtitle}>Explore the new world of clothing</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "cover",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    top: height * 0.25,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
});

export default SplashScreen;
