import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthStore } from "../store/useAuthStore";
import BottomTabNavigator from "./BottomTabNavigator";

import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/Auth/OnboardingScreen";
import SignupScreen from "../screens/SignupScreen";
import EmailVerificationScreen from "../screens/Auth/EmailVerificationScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordEmailScreen from "../screens/Auth/ForgotPasswordEmailScreen";
import ForgotPasswordOtpScreen from "../screens/Auth/ForgotPasswordOtpScreen";
import NewPasswordScreen from "../screens/Auth/NewPasswordScreen";
import PasswordResetSuccessScreen from "../screens/Auth/PasswordResetSuccessScreen";

// ... Keep existing App screens ...
import IntroScreen from "../screens/IntroScreen";
import OffersScreen from "../screens/OffersScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ForgotPasswordVerificationScreen from "../screens/ForgotPasswordVerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
// import PasswordResetSuccessScreen from "../screens/PasswordResetSuccessScreen"; // Replaced
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
  Onboarding: undefined;
  Signup: undefined;
  EmailVerification: { email: string };
  Login: undefined;
  ForgotPassword: undefined; // To flow start
  ForgotPasswordVerification: { email: string }; // OTP
  ResetPassword: undefined;
  PasswordResetSuccess: undefined;

  // Existing...
  Intro: undefined;
  Offers: undefined;
  Payments: undefined;
  Verification: undefined;
  // ForgotPassword: undefined; // types conflict if duplicate, using new flow one
  // ForgotPasswordVerification: undefined;
  // ResetPassword: undefined;

  Home: undefined;
  Main: undefined;
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
  CategoryProducts: undefined;
  Search: undefined;
  Filter: undefined;

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
  const { isAuthenticated, loading } = useAuthStore();

  // Optional: Show global loading if Hydration is slow
  if (loading) {
    // return <Loading />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Flow
        <Stack.Group>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />

          <Stack.Screen name="ForgotPassword" component={ForgotPasswordEmailScreen} />
          <Stack.Screen name="ForgotPasswordVerification" component={ForgotPasswordOtpScreen} />
          <Stack.Screen name="ResetPassword" component={NewPasswordScreen} />
          <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />

          {/* Legacy/Other screens if still needed accessible */}
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Offers" component={OffersScreen} />
        </Stack.Group>
      ) : (
        // App Flow
        <Stack.Group>
          <Stack.Screen name="Main" component={BottomTabNavigator} />

          {/* Screens NOT in Tabs, pushed on top */}
          <Stack.Screen name="CategoryProducts" component={require('../screens/Shop/CategoryProductsScreen').default} />
          <Stack.Screen name="Search" component={require('../screens/Shop/SearchScreen').default} />
          <Stack.Screen name="Filter" component={require('../screens/Shop/FilterModal').default} options={{ presentation: 'modal' }} />

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
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

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
