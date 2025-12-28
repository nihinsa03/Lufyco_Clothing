import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "UpcomingEvents">;

type OutfitItem = {
  label: string;
  image: any;
};

type EventCard = {
  id: string;
  title: string;          // e.g. "Office"
  dateLine: string;       // e.g. "Fri, Aug 8"
  time: string;           // e.g. "10.20 PM"
  outfit: OutfitItem[];
};

// demo content
const EVENTS: EventCard[] = [
  {
    id: "1",
    title: "Office",
    dateLine: "Fri, Aug 8",
    time: "10.20 PM",
    outfit: [
      { label: "Blue Shirt", image: require("../../assets/images/shirt.png") },
      { label: "Casual Shoe", image: require("../../assets/images/shoe.png") },
    ],
  },
  {
    id: "2",
    title: "Party",
    dateLine: "Fri, Aug 8",
    time: "10.20 PM",
    outfit: [
      { label: "Blue Shirt", image: require("../../assets/images/shirt.png") },
      { label: "Casual Shoe", image: require("../../assets/images/shoe.png") },
    ],
  },
];

const UpcomingEventsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.hBtn}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Events */}
      <FlatList
        data={EVENTS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Top row */}
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDate}>{item.dateLine}</Text>
              </View>
              <Text style={styles.eventTime}>{item.time}</Text>
            </View>

            <View style={styles.divider} />

            {/* Planned Outfit row header + edit */}
            <View style={styles.rowHeader}>
              <Text style={styles.planLabel}>Planned Outfit</Text>
              <TouchableOpacity onPress={() => { /* open edit flow */ }}>
                <Feather name="edit-3" size={20} color="#444" />
              </TouchableOpacity>
            </View>

            {/* Outfit items */}
            <View style={styles.outfitRow}>
              {item.outfit.map((o) => (
                <View key={o.label} style={styles.outfitItem}>
                  <Image source={o.image} style={styles.outfitImg} />
                  <Text style={styles.outfitText}>{o.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // open add-event flow
        }}
        accessibilityRole="button"
        accessibilityLabel="Add event"
      >
        <View style={styles.fabInner}>
          <Feather name="plus" size={30} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Bottom Tab (matches your AI Stylist flow) */}
      <View style={styles.bottomBar}>
        {[
          { label: "Home", icon: "home", onPress: () => navigation.navigate("Home") },
          { label: "AI Stylist", icon: "grid", onPress: () => navigation.navigate("AISylist" as any) },
          { label: "My Cart", icon: "shopping-cart", onPress: () => {} },
          { label: "Wishlist", icon: "heart", onPress: () => {} },
          { label: "Profile", icon: "user", onPress: () => {} },
        ].map((t, i) => (
          <TouchableOpacity key={t.label} style={styles.tabBtn} onPress={t.onPress}>
            <Feather name={t.icon as any} size={22} color={i === 0 ? "#000" : "#777"} />
            <Text style={[styles.tabLabel, { color: i === 0 ? "#000" : "#777" }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  hBtn: { padding: 4 },
  headerTitle: { fontSize: 28, fontWeight: "700" },

  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  eventDate: { marginTop: 2, color: "#333", fontWeight: "600" },
  eventTime: { fontWeight: "700", color: "#111" },

  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.15)", marginVertical: 10 },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planLabel: { fontWeight: "800", color: "#333" },

  outfitRow: { flexDirection: "row" },
  outfitItem: { alignItems: "center", marginRight: 18 },
  outfitImg: { width: 96, height: 96, borderRadius: 12, backgroundColor: "#eee" },
  outfitText: { marginTop: 8, fontWeight: "700", color: "#111" },

  fab: { position: "absolute", right: 18, bottom: 96 },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#0A58FF",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  tabBtn: { alignItems: "center" },
  tabLabel: { fontSize: 12, marginTop: 2, fontWeight: "500" },
});

export default UpcomingEventsScreen;
