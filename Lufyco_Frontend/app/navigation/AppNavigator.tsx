// AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
// BottomTabNavigator is not implemented yet, using Home as main
// import BottomTabNavigator from "./BottomTabNavigator";

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
import ProductListingScreen from "../screens/ProductListingScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import WishlistScreen from "../screens/WishlistScreen";
import ProfileScreen from "../screens/ProfileScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

// Checkout Flow
import CheckoutShippingScreen from "../screens/Checkout/CheckoutShippingScreen";
import CheckoutPaymentScreen from "../screens/Checkout/CheckoutPaymentScreen";
import CheckoutReviewScreen from "../screens/Checkout/CheckoutReviewScreen";
import OrderSuccessScreen from "../screens/Checkout/OrderSuccessScreen";
import OrderDetailsScreen from "../screens/Checkout/OrderDetailsScreen";

// Profile Flow
import ShippingAddressScreen from "../screens/Profile/ShippingAddressScreen";
import PaymentMethodScreen from "../screens/Profile/PaymentMethodScreen";
import PrivacyPolicyScreen from "../screens/Profile/PrivacyPolicyScreen";
import TermsConditionsScreen from "../screens/Profile/TermsConditionsScreen";
import FAQScreen from "../screens/Profile/FAQScreen";


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
  Main: undefined; // Added Main for BottomTabs
  Categories: undefined;
  Profile: undefined;
  OrderHistory: undefined;
  ChangePassword: undefined;
  MensWear: undefined;
  MenCasualShirts: undefined;
  AIStylist: undefined;
  ProductListing: {
    gender?: string;
    category?: string;
    subCategory?: string;
    type?: string;
    search?: string;
    isSale?: boolean;
    title?: string;
  };
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
  ProductDetails: {
    id: string;
    product?: any;
  };
  Wishlist: undefined;
  MyCart: undefined;

  // Checkout
  CheckoutShipping: undefined;
  CheckoutPayment: undefined;
  CheckoutReview: undefined;
  OrderSuccess: undefined;
  OrderDetails: { orderId: string };

  // Profile
  ShippingAddress: undefined;
  PaymentMethod: undefined;
  PrivacyPolicy: undefined;
  TermsConditions: undefined;
  FAQ: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Flow
        <Stack.Group>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Offers" component={OffersScreen} />
          {/* Add other auth screens if needed to be accessible without login */}
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ForgotPasswordVerification" component={ForgotPasswordVerificationScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
        </Stack.Group>
      ) : (
        // App Flow
        <Stack.Group>
          {/* <Stack.Screen name="Main" component={BottomTabNavigator} /> */}
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
          <Stack.Screen name="ProductListing" component={ProductListingScreen} />
          <Stack.Screen name="WomenTops" component={WomenTopsScreen} />
          <Stack.Screen name="WomenTopDetails" component={WomenTopDetailsScreen} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="MyCart" component={MyCartScreen} />

          {/* Checkout Flow */}
          <Stack.Screen name="CheckoutShipping" component={CheckoutShippingScreen} />
          <Stack.Screen name="CheckoutPayment" component={CheckoutPaymentScreen} />
          <Stack.Screen name="CheckoutReview" component={CheckoutReviewScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />

          {/* Profile Flow */}
          <Stack.Screen name="ShippingAddress" component={ShippingAddressScreen} />
          <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
