import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { AuthHeader, AuthInput, PrimaryButton, SocialRow } from '../components/AuthComponents';
import { useAuthStore } from '../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<any>;
}

const SignupScreen = ({ navigation }: Props) => {
  const { signup, loading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await signup({ name, email, password });
    if (success) {
      // User created successfully, redirect to login
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <AuthHeader title="Create your account" />

        <AuthInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          icon="user"
        />

        <AuthInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          icon="mail"
          keyboardType="email-address"
        />

        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          icon="lock"
        />

        <AuthInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
          icon="lock"
        />

        <PrimaryButton
          title="Sign Up"
          onPress={handleSignup}
          loading={loading}
        />

        <Text style={styles.orText}>or continue with</Text>

        <SocialRow />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, paddingBottom: 50 },
  backBtn: { marginBottom: 20 },
  backArrow: { fontSize: 24, fontWeight: 'bold' },
  orText: { textAlign: 'center', marginVertical: 20, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666' },
  link: { color: '#000', fontWeight: 'bold' }
});

export default SignupScreen;
