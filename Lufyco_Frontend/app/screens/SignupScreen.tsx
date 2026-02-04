import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ScrollView, SafeAreaView, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { validateEmail } from '../utils/emailValidation';

interface Props {
  navigation: StackNavigationProp<any>;
}

const SignupScreen = ({ navigation }: Props) => {
  const { signup, loading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailBlur = () => {
    if (email) {
      const validation = validateEmail(email);
      if (!validation.valid) {
        setEmailError(validation.message || 'Invalid email');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSignup = async () => {
    // Validate all fields
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      Alert.alert("Error", emailValidation.message || "Invalid email");
      setEmailError(emailValidation.message || "Invalid email");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    const success = await signup({ name, email, password });
    if (success) {
      // Navigate to verification screen
      navigation.navigate('Verification', { email });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.brandName}>Fashion</Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Make your life More Smarter</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter Name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : {}]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            onBlur={handleEmailBlur}
            placeholder="Enter your Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your Password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={{ fontWeight: 'bold' }} onPress={() => navigation.navigate('Login')}>Login</Text>
          </Text>
        </View>

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.socialLoginText}>Sign up with Social Networks</Text>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity>
              <Image source={require('../../assets/images/facebook.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/images/instagram.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../assets/images/googlec.png')} style={styles.socialIcon} />
            </TouchableOpacity>
            {/* Assuming tiktok/twitter icon based on other assets or similar placeholder */}
            <TouchableOpacity>
              <Image source={require('../../assets/images/tiktok.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    padding: 24,
    paddingTop: 10,
    flexGrow: 1
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    marginTop: 10
  },
  backBtn: {
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 25,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#7dd3fc', // Light blue
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000'
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#7dd3fc', // Light blue matching input
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000'
  },
  eyeIcon: {
    padding: 4
  },
  signUpButton: {
    backgroundColor: '#0c0c0c',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 30 // Make button narrower as per design
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  footerText: {
    fontSize: 13,
    color: '#000'
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 30
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc'
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  socialLoginText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 15
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain'
  }
});

export default SignupScreen;
