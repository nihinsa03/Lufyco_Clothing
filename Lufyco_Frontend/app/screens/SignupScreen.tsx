import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import api from "../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type the navigation prop
type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, "Signup">;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/users/register', { name, email, password });

      // Save user data (optional - maybe just navigate to login or auto-login)
      // await AsyncStorage.setItem('userInfo', JSON.stringify(data));

      if (Platform.OS === 'web') {
        alert("Account created successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Fashion</Text>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Make your life More Smarter</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>Sign up</Text>}
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </Text>


      <Text style={styles.orText}>────────  OR  ────────</Text>

      <Text style={styles.socialText}>Sign up with Social Networks</Text>

      {/* Social Icons */}
      <View style={styles.socialIcons}>
        <Image source={require("../../assets/images/facebook.png")} style={styles.icon} />
        <Image source={require("../../assets/images/instagram.png")} style={styles.icon} />
        <Image source={require("../../assets/images/googlec.png")} style={styles.icon} />
        <Image source={require("../../assets/images/tiktok.png")} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#777",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#777",
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",

  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#777",
  },
  socialText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  icon: {
    width: 41,
    height: 43,
    marginHorizontal: 10,
  },
});

export default SignupScreen;
