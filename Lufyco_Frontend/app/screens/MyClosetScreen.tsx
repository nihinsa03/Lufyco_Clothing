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

const chips = ["All", "Tops", "Dresses", "Shoes", "Bottoms", "Outwear", "Accessories"];

const closetItems = [
  {
    id: "1",
    name: "Blue Shirt",
    category: "Outwear",
    image: require("../../assets/images/men/casual/shirts.jpg"),
  },
];

const MyClosetScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<any[]>([]);
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch items from backend
  const fetchCloset = async () => {
    setLoading(true);
    try {
      // In a real app, retrieve userId from storage
      // const userId = await AsyncStorage.getItem('userId');
      const params: any = {};
      if (active !== "All") params.category = active;
      if (q) params.search = q;

      const res = await api.get("/closet", { params });
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloset();
  }, [active, q]);

  // Refresh when navigating back to this screen (e.g. after adding item)
  useEffect(() => {
    const unsub = navigation.addListener('focus', fetchCloset);
    return unsub;
  }, [navigation]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/closet/${id}`);
      fetchCloset(); // refresh
    } catch (e) {
      console.error(e);
      alert("Failed to delete item");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Closet</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#111" />
        <TextInput
          placeholder="Search for Closet"
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
          <View key={item._id} style={styles.itemCard}>
            <View style={styles.itemRow}>
              {/* Handle image source: if http, uri; else placeholder */}
              <Image
                source={item.image && item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png")}
                style={styles.itemImage}
              />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.category}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Feather name="edit-2" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { marginLeft: 12 }]} onPress={() => handleDelete(item._id)}>
                <Feather name="trash-2" size={18} />
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
          <Feather name="plus" size={26} color="#fff" />
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
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#93C5FD",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 14 },

  // --- Chips (compact pills) ---
  chipsWrap: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",          // ✅ allows multiple rows
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 19,
    paddingVertical: 6,        // ✅ small height
    borderRadius: 14,          // pill shape
    backgroundColor: "#D9D9D9",
    marginRight: 12,           // horizontal gap
    marginBottom: 10,          // vertical gap (second row)
  },
  chipActive: {
    backgroundColor: "#8EC9FF", // light blue like screenshot
  },
  chipText: { fontWeight: "700", fontSize: 16, color: "#111" },
  chipTextActive: { color: "#0B0B0B" },

  // --- Item card ---
  itemCard: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingTop: 12,
    marginTop: 10,
    overflow: "hidden",
  },
  itemRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12 },
  itemImage: { width: 110, height: 120, borderRadius: 10, resizeMode: "cover" },
  itemTitle: { fontSize: 16, fontWeight: "800" },
  itemSub: { marginTop: 4, color: "#444", fontSize: 14 },
  separator: { height: 1, backgroundColor: "#D1D5DB", marginTop: 10 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  fab: { position: "absolute", right: 18, bottom: 90 },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MyClosetScreen;
