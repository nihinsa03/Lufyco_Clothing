import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuthStore } from "../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type RouteParams = {
  Verification: {
    email: string;
  };
};

const VerificationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'Verification'>>();
  const { verifyEmail, resendOTP, loading } = useAuthStore();

  const email = route.params?.email || '';
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
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

    const success = await verifyEmail(email, otpString);

    if (success) {
      Alert.alert(
        "Success!",
        "Email verified successfully! You can now login.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } else {
      Alert.alert("Verification Failed", "Invalid or expired verification code. Please try again.");
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    const success = await resendOTP(email);
    setResending(false);

    if (success) {
      setOtp(["", "", "", "", "", ""]); // Clear OTP fields
      Alert.alert("Success", "A new verification code has been sent to your email.");
    } else {
      Alert.alert("Error", "Failed to resend verification code. Please try again.");
    }
  };

  const isOtpComplete = !otp.includes("");
  const currentInputIndex = otp.findIndex(digit => digit === "");

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>  Signup-Email Verification</Text>
      </TouchableOpacity>

      {/* Notification Box */}
      <View style={styles.notification}>
        <Ionicons name="information-circle" size={20} color="#3b82f6" style={{ marginRight: 8 }} />
        <Text style={styles.notificationText}>
          6-digit Verification code has been send to your email address.
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit verification code sent to your email address.
      </Text>

      {/* OTP Input Boxes */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View
            key={index}
            style={[
              styles.otpBox,
              digit !== "" && styles.filledOtpBox,
              currentInputIndex === index && styles.activeOtpBox
            ]}
          >
            <Text style={[styles.otpText, digit !== "" && styles.filledOtpText]}>
              {digit}
            </Text>
            {currentInputIndex === index && (
              <View style={styles.cursor} />
            )}
          </View>
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
  notification: {
    backgroundColor: "#e0f2fe",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 13,
    color: "#0369a1",
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
    justifyContent: "center",
  },
  otpBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filledOtpBox: {
    borderColor: "#3b82f6",
    borderWidth: 2,
  },
  activeOtpBox: {
    borderColor: "#3b82f6",
    borderWidth: 2,
    backgroundColor: "#f0f9ff",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  filledOtpText: {
    color: "#000",
  },
  cursor: {
    position: "absolute",
    width: 2,
    height: 24,
    backgroundColor: "#3b82f6",
    opacity: 0.8,
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
    gap: 10,
  },
  key: {
    width: (width - 80) / 3,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  keyText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
});

export default VerificationScreen;
