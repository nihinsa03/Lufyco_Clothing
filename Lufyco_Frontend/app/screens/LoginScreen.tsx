import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { AuthHeader, AuthInput, PrimaryButton, SocialRow } from '../components/AuthComponents';
import { useAuthStore } from '../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<any>;
}

const LoginScreen = ({ navigation }: Props) => {
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const success = await login({ email: email.trim(), password });
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } else {
      // Show error from store
      const { error } = useAuthStore.getState();
      Alert.alert("Login Failed", error || "Invalid credentials");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <AuthHeader
          title="Log in to your account"
          subtitle="Welcome back! Please enter your details."
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
          secureTextEntry={!isPasswordVisible}
          icon="lock"
          rightIcon={isPasswordVisible ? "eye" : "eye-off"}
          onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPass}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Login"
          onPress={handleLogin}
          loading={loading}
        />

        <Text style={styles.orText}>or continue with</Text>

        <SocialRow />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Sign up</Text>
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
  forgotPass: { textAlign: 'right', color: '#000', fontWeight: 'bold', marginBottom: 20 },
  orText: { textAlign: 'center', marginVertical: 20, color: '#666' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666' },
  link: { color: '#000', fontWeight: 'bold' }
});

export default LoginScreen;
