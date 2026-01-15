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
import * as Location from 'expo-location';
import { useState, useEffect } from "react";

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
};

type Props = NativeStackScreenProps<RootStackParamList, "AIStylist">;

const AIStylistScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth(); // <--- Get real user
  const [weather, setWeather] = useState<{ temp: number, condition: string } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
      );
      const data = await response.json();
      const code = data.current_weather.weathercode;
      const condition = getWeatherCondition(code);
      setWeather({
        temp: Math.round(data.current_weather.temperature),
        condition
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const getWeatherCondition = (code: number) => {
    if (code === 0) return "Sunny";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Cloudy";
  };

  // Mock upcoming look data
  const upcomingLook = {
    title: "Office Meeting",
    date: "Fri, Aug 8",
    items: [
      { id: '1', name: "Blue Shirt", image: require("../../assets/images/shirt.png") },
      { id: '2', name: "Casual Shoe", image: require("../../assets/images/shoe.png") }
    ]
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greet}>Hello, {user?.name?.split(" ")[0] || "User"}</Text>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={22} style={styles.hIcon} />
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
        <TouchableOpacity style={styles.lookCard} onPress={() => navigation.navigate("UpcomingEvents")}>
          <View style={styles.lookHeader}>
            <View>
              <Text style={styles.lookTitle}>{upcomingLook.title}</Text>
              <Text style={styles.lookSub}>{upcomingLook.date}</Text>
            </View>
            <Feather name="more-horizontal" size={20} color="#999" />
          </View>

          <View style={styles.separator} />

          <View style={styles.lookItems}>
            {upcomingLook.items.map(item => (
              <LookItem key={item.id} image={item.image} label={item.name} />
            ))}
          </View>

          <View style={styles.separator} />

          <View style={styles.lookFooter}>
            <TouchableOpacity style={styles.navBtn}>
              <Feather name="chevron-left" size={20} />
            </TouchableOpacity>

            <Text style={styles.pageText}>1 of 2</Text>

            <TouchableOpacity style={styles.navBtn}>
              <Feather name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

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
              {weather ? `${weather.temp}°F` : "Loading..."}
            </Text>
            <Text style={styles.weatherSub}>
              {locationError || (weather ? weather.condition : "Fetching weather...")}
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
