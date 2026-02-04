import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuthStore } from "../store/useAuthStore";

const { width } = Dimensions.get("window");

type VerificationScreenRouteProp = RouteProp<{ params: { email: string } }, 'params'>;

const VerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<VerificationScreenRouteProp>();
  const { verifyEmail, resendOTP, loading } = useAuthStore();

  const email = route.params?.email || '';

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const handleKeyPress = (value: string) => {
    let newOtp = [...otp];

    if (value === "C") {
      setOtp(["", "", "", "", "", ""]); // Clear all fields
    } else if (value === "<-") {
      const lastFilledIndex = newOtp.lastIndexOf(newOtp.find((num) => num !== "") || "");
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

  const handleProceed = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter complete 6-digit code");
      return;
    }

    const success = await verifyEmail(email, otpCode);

    if (success) {
      Alert.alert(
        "Success",
        "Email verified successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login" as never)
          }
        ]
      );
    } else {
      // Error is already shown in the store or we can show it here
      Alert.alert("Error", "Invalid or expired verification code");
    }
  };

  const handleResendCode = async () => {
    const success = await resendOTP(email);

    if (success) {
      Alert.alert("Success", "Verification code has been resent to your email");
      setOtp(["", "", "", "", "", ""]); // Clear current OTP
    } else {
      Alert.alert("Error", "Failed to resend verification code");
    }
  };

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←    Email Verification</Text>
      </TouchableOpacity>

      {/* Notification Box */}
      <View style={styles.notification}>
        <Text style={styles.notificationText}>✅ 6-digit Verification code has been sent to your email address.</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>Enter the 6-digit verification code sent to your email address.</Text>

      {/* Email Display */}
      <Text style={styles.emailText}>{email}</Text>

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
      <TouchableOpacity onPress={handleResendCode} disabled={loading}>
        <Text style={styles.resendCode}>Resend Code</Text>
      </TouchableOpacity>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[styles.proceedButton, (otp.includes("") || loading) && styles.proceedButtonDisabled]}
        onPress={handleProceed}
        disabled={otp.includes("") || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.proceedButtonText}>Proceed</Text>
        )}
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
    marginBottom: 10,
  },
  emailText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
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
    fontWeight: "600",
  },
  proceedButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  proceedButtonDisabled: {
    backgroundColor: "#ccc",
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
