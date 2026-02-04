import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const { width } = Dimensions.get("window");

const VerificationScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const handleKeyPress = (value: string) => {
    let newOtp = [...otp];

    if (value === "C") {
      setOtp(["", "", "", "", "", ""]); // Clear all fields
    } else if (value === "<-") {
      const lastFilledIndex = newOtp.lastIndexOf(newOtp.find((num) => num !== "") || ""); // Ensure it never returns undefined
      if (lastFilledIndex >= 0) {
        newOtp[lastFilledIndex] = "";
        setOtp(newOtp);
      }
    } else if (otp.includes("")) {
      const emptyIndex = otp.indexOf("");
      if (emptyIndex !== -1) {
        newOtp[emptyIndex] = value;
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←    Verification Code</Text>
      </TouchableOpacity>

      {/* Notification Box */}
      <View style={styles.notification}>
        <Text style={styles.notificationText}>✅ 6-digit Verification code has been sent to your email.</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>Enter the 6-digit verification code sent to your email address.</Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpBox, digit !== "" ? styles.activeOtpBox : {}]}
            value={digit}
            keyboardType="numeric"
            maxLength={1}
            editable={false}
          />
        ))}
      </View>

      {/* Resend Code */}
      <TouchableOpacity>
        <Text style={styles.resendCode}>Resend Code</Text>
      </TouchableOpacity>

      {/* Proceed Button */}
      <TouchableOpacity style={styles.proceedButton} disabled={otp.includes("")}>
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>

      {/* Numeric Keypad */}
      <View style={styles.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "<-", "0", "C"].map((key) => (
          <TouchableOpacity key={key} style={styles.key} onPress={() => handleKeyPress(key)}>
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  notification: {
    backgroundColor: "#eef5ff",
    padding: 10,
    borderRadius: 10,
    marginTop: 30,
    width: "100%",
  },
  notificationText: {
    fontSize: 14,
    color: "#007BFF",
    textAlign: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 70,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  otpBox: {
    borderWidth: 2,
    borderColor: "#ccc",
    width: 40,
    height: 40,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeOtpBox: {
    borderColor: "#007BFF",
  },
  resendCode: {
    color: "#007BFF",
    marginBottom: 20,
  },
  proceedButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  key: {
    width: width / 4,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f2f8f3",
    borderRadius: 5,
  },
  keyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VerificationScreen;
