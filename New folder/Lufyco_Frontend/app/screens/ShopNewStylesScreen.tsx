import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, Platform, StatusBar } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useShopStore } from "../store/useShopStore";
import { useTheme } from "../context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "ShopNewStyles">;

const ShopNewStylesScreen: React.FC<Props> = ({ navigation }) => {
  const { products } = useShopStore();
  const [query, setQuery] = useState("");
  const { colors, isDark: dark } = useTheme();

  const list = useMemo(() => {
    // Filter for new arrivals
    let data = products.filter(p => p.isNewArrival);

    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (i) => {
          const itemText = (i.name || i.title || "").toLowerCase();
          const descText = (i.description || "").toLowerCase();
          return itemText.includes(q) || descText.includes(q);
        }
      );
    }
    return data;
  }, [products, query]);

  // IMPORTANT: Use the exact route name from your RootStackParamList.
  // Your type error shows the route is spelled "AISylist".
  type RouteName = keyof RootStackParamList;
  const stylistRouteName = "AISylist" as RouteName; // <- matches your navigator

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: dark ? "#333" : "transparent", borderBottomWidth: dark ? 1 : 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shop New Styles</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { borderColor: dark ? colors.border : "#60A5FA", backgroundColor: dark ? colors.card : "#fff" }]}>
        <Ionicons name="search" size={20} color={colors.text} />
        <TextInput
          placeholder="Search for Items"
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { color: colors.text }]}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: dark ? colors.border : '#4A90D9' }]}
            onPress={() => navigation.navigate("ProductDetails", { id: item.id, product: item })}
          >
            <View style={[styles.row, { padding: dark ? 8 : 0 }]}>
              <Image
                source={item.images && item.images[0] ? (typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]) : require("../../assets/images/clothing.png")}
                style={[styles.thumb, { backgroundColor: colors.iconBg }]}
              />
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title || item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>${item.price?.toFixed(2)}</Text>
              </View>

              <View
                style={styles.cartBtn}
              >
                <Feather name="chevron-right" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>No items match “{query}”.</Text>
        }
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },

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
    backgroundColor: "transparent",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginVertical: 4
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
});

export default ShopNewStylesScreen;
