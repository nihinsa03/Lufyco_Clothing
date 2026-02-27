import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useWeather } from "../hooks/useWeather";
// import * as Location from 'expo-location'; // Removed
// import { useState, useEffect } from "react"; // Removed unnecessary imports

type RootStackParamList = {
  Home: undefined;
  AIStylist: undefined;
  Categories: undefined;
  MyCloset: undefined;
  PlanMyLook: undefined;
  ShopNewStyles: undefined;
  UpcomingEvents: undefined;
  // Optional future routes:
  MyCart?: undefined;
  Wishlist?: undefined;
  Profile?: undefined;
  Notifications?: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "AIStylist">;

const AIStylistScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth(); // <--- Get real user
  const { weather, loading, error } = useWeather();

  // Removed inline optional logic as it is now in useWeather hook
  // const [weather, setWeather] = useState<{ temp: number, condition: string } | null>(null);
  // const [locationError, setLocationError] = useState<string | null>(null); ...

  const upcomingLooks = [
    {
      title: "Office Meeting",
      date: "Fri, Aug 8",
      items: [
        { id: '1', name: "Blue Shirt", image: require("../../assets/images/shirt.png") },
        { id: '2', name: "Casual Shoe", image: require("../../assets/images/shoe.png") }
      ]
    },
    {
      title: "Weekend Party",
      date: "Sat, Aug 9",
      items: [
        { id: '3', name: "White Polo", image: { uri: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80" } },
        { id: '4', name: "Sneakers", image: { uri: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80" } }
      ]
    }
  ];

  const [currentLookIndex, setCurrentLookIndex] = React.useState(0);
  const handlePrev = () => setCurrentLookIndex(prev => (prev > 0 ? prev - 1 : upcomingLooks.length - 1));
  const handleNext = () => setCurrentLookIndex(prev => (prev < upcomingLooks.length - 1 ? prev + 1 : 0));
  const currentLook = upcomingLooks[currentLookIndex];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.greet}>Hello, {user?.name?.split(" ")[0] || "User"}</Text>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={22} style={styles.hIcon} onPress={() => navigation.navigate("Notifications")} />
          <Feather name="heart" size={22} style={styles.hIcon} onPress={() => navigation.navigate("Wishlist")} />
          <Feather name="user" size={22} style={styles.hIcon} onPress={() => navigation.navigate("Profile")} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Quick tiles */}
        <View style={styles.tileRow}>
          <Tile
            label="My Closet"
            icon={<Feather name="shopping-bag" size={22} color="#3B5BFF" />}
            onPress={() => navigation.navigate("MyCloset")}
          />
          <Tile
            label="Plan My Look"
            icon={<Ionicons name="sunny-outline" size={22} color="#FF4D4D" />}
            dim
            onPress={() => navigation.navigate("PlanMyLook")}
          />
        </View>

        <View style={styles.tileRow}>
          <Tile
            label="Shop New Styles"
            icon={<Feather name="briefcase" size={22} color="#1EA672" />}
            onPress={() => navigation.navigate("ShopNewStyles")}
          />

          <Tile
            label="Upcoming Events"
            icon={<Feather name="calendar" size={22} color="#7B61FF" />}
            onPress={() => navigation.navigate("UpcomingEvents")}
          />
        </View>

        {/* Upcoming looks */}
        <Text style={styles.sectionTitle}>Your Upcoming Looks</Text>
        <View style={styles.lookCard}>
          <TouchableOpacity style={styles.lookHeader} onPress={() => navigation.navigate("UpcomingEvents")}>
            <View>
              <Text style={styles.lookTitle}>{currentLook.title}</Text>
              <Text style={styles.lookSub}>{currentLook.date}</Text>
            </View>
            <Feather name="more-horizontal" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.lookItems} onPress={() => navigation.navigate("UpcomingEvents")}>
            {currentLook.items.map(item => (
              <LookItem key={item.id} image={item.image} label={item.name} />
            ))}
          </TouchableOpacity>

          <View style={styles.separator} />

          <View style={styles.lookFooter}>
            <TouchableOpacity style={styles.navBtn} onPress={handlePrev}>
              <Feather name="chevron-left" size={20} />
            </TouchableOpacity>

            <Text style={styles.pageText}>{currentLookIndex + 1} of {upcomingLooks.length}</Text>

            <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
              <Feather name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Today’s Weather</Text>
        <View style={styles.weatherCard}>
          <Ionicons
            name={weather?.condition === "Sunny" ? "sunny-outline" : "cloud-outline"}
            size={28}
            color={weather?.condition === "Sunny" ? "#FF4D4D" : "#555"}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.weatherMain}>
              {loading ? "Loading..." : (weather ? `${weather.temp}°F` : "N/A")}
            </Text>
            <Text style={styles.weatherSub}>
              {error || (loading ? "Fetching weather..." : (weather ? weather.condition : "Unknown"))}
            </Text>
          </View>
        </View>
      </ScrollView>


    </SafeAreaView>
  );
};

/* ---------- small components ---------- */

const Tile = ({
  label,
  icon,
  dim = false,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  dim?: boolean;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={[styles.tile, dim && styles.tileDim]} onPress={onPress}>
      <View style={styles.tileIconWrap}>{icon}</View>
      <Text style={styles.tileText}>{label}</Text>
    </TouchableOpacity>
  );
};

const LookItem = ({ image, label }: { image: any; label: string }) => {
  return (
    <View style={styles.lookItem}>
      <Image source={image} style={styles.lookImg} />
      <Text style={styles.lookItemText}>{label}</Text>
    </View>
  );
};

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    justifyContent: "space-between",
  },
  greet: { fontSize: 26, fontWeight: "700" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  hIcon: { marginLeft: 14 },

  tileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  tile: {
    flex: 1,
    backgroundColor: "#D9D9D9",
    marginRight: 10,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  tileDim: { opacity: 0.9 },
  tileIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tileText: { fontSize: 16, fontWeight: "600", flexShrink: 1 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C63FF",
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  lookCard: {
    marginHorizontal: 16,
    backgroundColor: "#E2E2E2",
    borderRadius: 14,
    padding: 12,
  },
  lookHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lookTitle: { fontSize: 18, fontWeight: "700" },
  lookSub: { marginTop: 2, color: "#444" },
  separator: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 10 },
  lookItems: { flexDirection: "row" },
  lookItem: { marginRight: 18, alignItems: "center" },
  lookImg: { width: 110, height: 100, borderRadius: 10, resizeMode: "cover" },
  lookItemText: { marginTop: 8, fontWeight: "600" },

  lookFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageText: { fontWeight: "600" },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  weatherCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#E2E2E2",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  weatherMain: { fontSize: 16, fontWeight: "700" },
  weatherSub: { color: "#333" },


});

export default AIStylistScreen;
