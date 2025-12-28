import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator"; // Import RootStackParamList

// Type the navigation prop
type ResetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, "ResetPassword">;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←   Create Password</Text>
      </TouchableOpacity>

      {/* Step Indicator */}
      <Text style={styles.stepIndicator}>03/03</Text>

      {/* Title */}
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.subtitle}>Enter your new password and remember it.</Text>

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Save Button */}
      <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
        if (password === confirmPassword && password !== "") {
         // Handle password reset logic here
        navigation.navigate("PasswordResetSuccess"); // Redirect to Success screen
        } else {
      alert("Passwords do not match. Please try again.");
    }
  }}
>
  <Text style={styles.saveButtonText}>Save</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 70,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stepIndicator: {
    alignSelf: "flex-end",
    fontSize: 14,
    color: "#777",
    marginTop: -20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    width: "100%",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;
