import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/useAuthStore";

const { width } = Dimensions.get("window");

type RouteParams = {
  ForgotPasswordVerification: {
    email: string;
  };
};

const ForgotPasswordVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'ForgotPasswordVerification'>>();
  const { verifyResetOTP, requestPasswordReset, loading } = useAuthStore();

  const email = route.params?.email || '';
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);  // 6-digit OTP
  const [resending, setResending] = useState(false);

  const handleKeyPress = (value: string) => {
    let newOtp = [...otp];

    if (value === "C") {
      setOtp(["", "", "", "", "", ""]); // Clear all fields
    } else if (value === "<-") {
      const lastFilledIndex = newOtp.reduce((lastIdx, num, idx) => num !== "" ? idx : lastIdx, -1);
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
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit verification code");
      return;
    }

    const success = await verifyResetOTP(email, otpString);

    if (success) {
      // Navigate to reset password screen, passing email and OTP for final verification
      navigation.navigate('ResetPassword', { email, otp: otpString });
    } else {
      Alert.alert("Verification Failed", "Invalid or expired verification code. Please try again.");
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    const success = await requestPasswordReset(email);
    setResending(false);

    if (success) {
      setOtp(["", "", "", "", "", ""]); // Clear OTP fields
      Alert.alert("Success", "A new 6-digit verification code has been sent to your email.");
    } else {
      Alert.alert("Error", "Failed to resend verification code. Please try again.");
    }
  };

  const isOtpComplete = !otp.includes("");

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>  Forgot Password</Text>
      </TouchableOpacity>

      {/* Step Indicator */}
      <Text style={styles.stepIndicator}>02/03</Text>

      {/* Title */}
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit verification code sent to your email address.
      </Text>

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
      <TouchableOpacity onPress={handleResendCode} disabled={resending}>
        {resending ? (
          <ActivityIndicator size="small" color="#3b82f6" style={{ marginBottom: 20 }} />
        ) : (
          <Text style={styles.resendCode}>Resend Code</Text>
        )}
      </TouchableOpacity>

      {/* Proceed Button */}
      <TouchableOpacity
        style={[styles.proceedButton, !isOtpComplete && styles.proceedButtonDisabled]}
        onPress={handleProceed}
        disabled={!isOtpComplete || loading}
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
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => handleKeyPress(key)}
            activeOpacity={0.7}
          >
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
  backButton: {
    alignSelf: "flex-start",
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  stepIndicator: {
    alignSelf: "flex-end",
    fontSize: 14,
    color: "#777",
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
  },
  otpBox: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    width: 45,
    height: 50,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  activeOtpBox: {
    borderColor: "#3b82f6",
    backgroundColor: "#fff",
  },
  resendCode: {
    color: "#3b82f6",
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "500",
  },
  proceedButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  proceedButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  key: {
    width: width / 3.5,
    padding: 18,
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 3,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  keyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});

export default ForgotPasswordVerificationScreen;
