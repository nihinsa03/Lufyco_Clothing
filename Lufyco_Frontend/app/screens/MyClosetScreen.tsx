// screens/MyClosetScreen.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import api from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "MyCloset">;

// Updated order as per Figma
const chips = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories", "Shoes"];

// Rich mock data to populate the view
const mockClosetItems = [
  { id: "1", name: "Blue Shirt", category: "Outerwear", color: "#0000FF", image: require("../../assets/images/categories/men/shirts.png") },
  { id: "2", name: "Red Dress", category: "Dresses", color: "#FF0000", image: require("../../assets/images/categories/women/dresses.jpg") },
  { id: "3", name: "Black Heels", category: "Shoes", color: "#000000", image: require("../../assets/images/categories/women/heels.jpg") },
  { id: "4", name: "Denim Jeans", category: "Bottoms", color: "#1F2937", image: require("../../assets/images/categories/men/jeans.jpg") },
  { id: "5", name: "White Top", category: "Tops", color: "#FFFFFF", image: require("../../assets/images/categories/women/tops.jpg") },
  { id: "6", name: "Leather Bag", category: "Accessories", color: "#8B4513", image: require("../../assets/images/categories/women/handbags.jpg") },
];

const MyClosetScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<any[]>(mockClosetItems);
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter Logic (Mock)
  useEffect(() => {
    let filtered = mockClosetItems;
    if (active !== "All") {
      filtered = filtered.filter(item => item.category === active || (active === "Outwear" && item.category === "Outerwear")); // Handle slight mismatch if any
    }
    if (q) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }
    setItems(filtered);
  }, [active, q]);


  const handleDelete = async (id: string) => {
    // Mock delete
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Closet</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#111" />
        <TextInput
          placeholder="Search for clothes..."
          style={styles.searchInput}
          value={q}
          onChangeText={setQ}
          placeholderTextColor="#6B7280"
        />
      </View>

      {/* Chips */}
      <View style={styles.chipsWrap}>
        {chips.map((c) => {
          const selected = c === active;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setActive(c)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Items */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemRow}>
              {/* Handle image source: if http, uri; else placeholder */}
              <Image
                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                style={styles.itemImage}
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.category}</Text>

                {/* Color Dot */}
                {item.color && (
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                )}
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Feather name="edit-2" size={18} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { marginLeft: 12 }]} onPress={() => handleDelete(item.id)}>
                <Feather name="trash-2" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("AddToCloset")}
      >
        <View style={styles.fabInner}>
          <Feather name="plus" size={32} color="#fff" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: '#000' },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14, color: '#000' },

  // --- Chips (compact pills) ---
  chipsWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12, // More squared rounded corners
    backgroundColor: "#D9D9D9", // Matches screenshot gray
    marginRight: 10,
    marginBottom: 10,
  },
  chipActive: {
    backgroundColor: "#7DD3FC", // Matches screenshot blue
  },
  chipText: { fontWeight: "600", fontSize: 13, color: "#333" },
  chipTextActive: { color: "#000" },

  // --- Item card ---
  itemCard: {
    backgroundColor: "#F3F4F6", // Light grey background like Figma
    borderRadius: 12,
    paddingTop: 12,
    marginTop: 15,
    overflow: "hidden",
  },
  itemRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 12 },
  itemImage: { width: 100, height: 110, borderRadius: 8, resizeMode: "cover" },
  itemTitle: { fontSize: 16, fontWeight: "700", color: '#000' },
  itemSub: { marginTop: 2, color: "#4B5563", fontSize: 13 },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fff' // subtle border
  },

  separator: { height: 1, backgroundColor: "#fff", marginHorizontal: 0 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB' // Match card background or slightly darker if needed
  },
  actionBtn: {
    // width: 34,
    // height: 34,
    padding: 4,
  },

  fab: { position: "absolute", right: 20, bottom: 40 },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 12, // Square-ish rounded corners like Figma
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MyClosetScreen;
