// AppNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import IntroScreen from "../screens/IntroScreen";
import OffersScreen from "../screens/OffersScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import SignupScreen from "../screens/SignupScreen";
import VerificationScreen from "../screens/VerificationScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ForgotPasswordVerificationScreen from "../screens/ForgotPasswordVerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import PasswordResetSuccessScreen from "../screens/PasswordResetSuccessScreen";
import HomeScreen from "../screens/HomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import MensWearScreen from "../screens/MensWearScreen";
import MenCasualShirtsScreen from "../screens/MenCasualShirtsScreen";
import AIStylistScreen from "../screens/AIStylistScreen";
import MyClosetScreen from "../screens/MyClosetScreen";
import PlanMyLookScreen from "../screens/PlanMyLookScreen";
import SuggestedOutfitScreen from "../screens/SuggestedOutfitScreen";
import ShopNewStylesScreen from "../screens/ShopNewStylesScreen";
import UpcomingEventsScreen from "../screens/UpcomingEventsScreen";
import AddToClosetScreen from "../screens/AddToClosetScreen";
import AddToClosetPreviewScreen from "../screens/AddToClosetPreviewScreen";
import WomensWearScreen from "../screens/WomensWearScreen";
import WomenTopsScreen from "../screens/WomenTopsScreen";
import WomenTopDetailsScreen from "../screens/WomenTopDetailsScreen";
import MyCartScreen from "../screens/MyCartScreen";


export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Offers: undefined;
  Payments: undefined;
  Signup: undefined;
  Verification: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ForgotPasswordVerification: undefined;
  ResetPassword: undefined;
  PasswordResetSuccess: undefined;
  Home: undefined;
  Categories: undefined; // ✅ Updated to PascalCase
  MensWear: undefined;
  MenCasualShirts: undefined;
  AIStylist: undefined;
  MyCloset: undefined;
  PlanMyLook: undefined;
  SuggestedOutfit: { mood: string; occasion: string; weather: string };
  ShopNewStyles: undefined;
  UpcomingEvents: undefined;
  AddToCloset: undefined;
  AddToClosetPreview: { uri: string };
  WomensWear: undefined;
  WomenTops: undefined;
  WomenTopDetails: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    image: any;
    colors: string[];
    rating?: number;
    reviewsCount?: number;

  };
  MyCart: undefined;

};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ForgotPasswordVerification" component={ForgotPasswordVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="MensWear" component={MensWearScreen} />
      <Stack.Screen name="MenCasualShirts" component={MenCasualShirtsScreen} />
      <Stack.Screen name="AIStylist" component={AIStylistScreen} />
      <Stack.Screen name="MyCloset" component={MyClosetScreen} />
      <Stack.Screen name="PlanMyLook" component={PlanMyLookScreen} />
      <Stack.Screen name="SuggestedOutfit" component={SuggestedOutfitScreen} />
      <Stack.Screen name="ShopNewStyles" component={ShopNewStylesScreen} />
      <Stack.Screen name="UpcomingEvents" component={UpcomingEventsScreen} />
      <Stack.Screen name="AddToCloset" component={AddToClosetScreen} />
      <Stack.Screen name="AddToClosetPreview" component={AddToClosetPreviewScreen} />
      <Stack.Screen name="WomensWear" component={WomensWearScreen} />
      <Stack.Screen name="WomenTops" component={WomenTopsScreen} />
      <Stack.Screen name="WomenTopDetails" component={WomenTopDetailsScreen} />
      <Stack.Screen name="MyCart" component={MyCartScreen} />


    </Stack.Navigator>
  );
}
