import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
  route: RouteProp<RootStackParamList, 'Splash'>;
};

const SplashScreen = ({ navigation }: Props) => {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    // Optional: Auto-redirect logic if desired
    // if (isAuthenticated) navigation.replace('Main');
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/splash-bg.png')}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Fashion</Text>
        <Text style={styles.subtitle}>Explore the new world of clothing</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Onboarding')}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryBtnText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  content: {
    padding: 30,
    paddingBottom: 50,
    width: '100%',
    alignItems: 'center'
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 40
  },
  primaryBtn: {
    backgroundColor: '#fff',
    width: '100%',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  btnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  secondaryBtn: {
    padding: 10
  },
  secondaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default SplashScreen;
