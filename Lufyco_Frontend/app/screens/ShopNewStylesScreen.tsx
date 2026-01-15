import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "ShopNewStyles">;

type StyleItem = {
  id: string;
  title: string;
  subtitle: string;
  image: any;
};

const DATA: StyleItem[] = [
  {
    id: "watch",
    title: "Brown Leather Watch",
    subtitle: "Complements casual style",
    image: require("../../assets/images/categories/men/watches.jpg"),
  },
  {
    id: "perfume",
    title: "Black Night Perfume",
    subtitle: "Complements casual style",
    image: require("../../assets/images/categories/men/perfume.jpg"),
  },
];

const ShopNewStylesScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DATA;
    return DATA.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

  // IMPORTANT: Use the exact route name from your RootStackParamList.
  // Your type error shows the route is spelled "AISylist".
  type RouteName = keyof RootStackParamList;
  const stylistRouteName = "AISylist" as RouteName; // <- matches your navigator

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop New Styles</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#111" />
        <TextInput
          placeholder="Search for Items"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={item.image} style={styles.thumb} />
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              <TouchableOpacity
                onPress={() => { }}
                style={styles.cartBtn}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.title} to cart`}
              >
                <Feather name="shopping-cart" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No items match “{query}”.</Text>
        }
      />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {[
          { key: "home", label: "Home", icon: "home", onPress: () => navigation.navigate("Home") },
          { key: "stylist", label: "AI Stylist", icon: "grid", onPress: () => navigation.navigate("AIStylist") },
          { key: "cart", label: "My Cart", icon: "shopping-cart", onPress: () => navigation.navigate("MyCart") },
          { key: "wish", label: "Wishlist", icon: "heart", onPress: () => navigation.navigate("Wishlist") },
          { key: "profile", label: "Profile", icon: "user", onPress: () => navigation.navigate("Profile") },
        ].map((t) => (
          <TouchableOpacity key={t.key} style={styles.tabBtn} onPress={t.onPress}>
            <Feather
              name={t.icon as any}
              size={22}
              color={t.key === 'stylist' ? "#1E90FF" : "#777"}
            />
            <Text style={[styles.tabLabel, { color: t.key === 'stylist' ? "#1E90FF" : "#777" }]}>
              {t.label}
            </Text>
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
  hIcon: { padding: 4 },
  headerTitle: { fontSize: 28, fontWeight: "700" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#60A5FA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchInput: { marginLeft: 10, flex: 1, color: "#111" },

  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 14,
    padding: 12,
  },
  row: { flexDirection: "row", alignItems: "center" },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  subtitle: { marginTop: 4, color: "#333" },

  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1550FF",
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontStyle: "italic",
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

export default ShopNewStylesScreen;
