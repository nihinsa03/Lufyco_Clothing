import React from "react";
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
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greet}>Hello, Alex</Text>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={22} style={styles.hIcon} />
          <Feather name="heart" size={22} style={styles.hIcon} />
          <Feather name="user" size={22} style={styles.hIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Quick tiles */}
        <View style={styles.tileRow}>
          <Tile
            label="My Closet"
            icon={<Feather name="shopping-bag" size={22} color="#3B5BFF" />}
            onPress={() => navigation.navigate("MyCloset")}   // ✅ navigate
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
          <View style={styles.lookHeader}>
            <View>
              <Text style={styles.lookTitle}>Office Meeting</Text>
              <Text style={styles.lookSub}>Fri, Aug 8</Text>
            </View>
            <Feather name="more-horizontal" size={20} color="#999" />
          </View>

          <View style={styles.separator} />

          <View style={styles.lookItems}>
            <LookItem
              image={require("../../assets/images/shirt.png")}
              label="Blue Shirt"
            />
            <LookItem
              image={require("../../assets/images/shoe.png")}
              label="Casual Shoe"
            />
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
        </View>

        {/* Weather */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Today’s Weather</Text>
        <View style={styles.weatherCard}>
          <Ionicons name="sunny-outline" size={28} color="#FF4D4D" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.weatherMain}>72 F</Text>
            <Text style={styles.weatherSub}>Sunny</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab (AI Stylist active) */}
      <View style={styles.bottomBar}>
        {[
          { label: "Home", icon: "home", onPress: () => navigation.navigate("Home") },
          { label: "AI Stylist", icon: "grid", onPress: () => {}, active: true },
          { label: "My Cart", icon: "shopping-cart", onPress: () => {} },
          { label: "Wishlist", icon: "heart", onPress: () => {} },
          { label: "Profile", icon: "user", onPress: () => {} },
        ].map((t) => (
          <TouchableOpacity key={t.label} style={styles.tabBtn} onPress={t.onPress}>
            <Feather name={t.icon as any} size={22} color={t.active ? "#1E90FF" : "#777"} />
            <Text style={[styles.tabLabel, { color: t.active ? "#1E90FF" : "#777" }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingBottom: 8,
    paddingTop: 6,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabBtn: { alignItems: "center" },
  tabLabel: { fontSize: 11, marginTop: 2, fontWeight: "500" },
});

export default AIStylistScreen;
