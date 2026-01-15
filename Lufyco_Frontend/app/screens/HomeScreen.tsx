import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList,
  Dimensions, SafeAreaView, ActivityIndicator
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCart } from "../context/CartContext";
import api from "../api/api";

const screenWidth = Dimensions.get("window").width;

import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const { count } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryPress = (name: string, gender: 'men' | 'women') => {
    if (gender === 'men') {
      if (name === "SHIRTS") {
        navigation.navigate("MenCasualShirts");
      } else {
        navigation.navigate("MensWear");
      }
    } else if (gender === 'women') {
      if (name === "TOPS") {
        navigation.navigate("WomenTops");
      } else {
        navigation.navigate("WomensWear");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      // Adding colors locally for visual demo as DB doesn't have them yet
      const productsWithColors = data.map((p: any) => ({
        ...p,
        id: p._id, // Map _id to id
        colors: ["#000", "#00f", "#f00"], // Dummy colors
        image: { uri: "https://via.placeholder.com/150" } // Dummy image since db has "url" string
      }));
      setProducts(productsWithColors);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const menCategories = [
    { name: "SHIRTS", image: require("../../assets/images/categories/men/shirts.png") },
    { name: "JEANS", image: require("../../assets/images/categories/men/jeans.jpg") },
    { name: "TSHIRTS", image: require("../../assets/images/categories/men/tshirts.jpg") },
    { name: "CASUAL SHOES", image: require("../../assets/images/categories/men/casual-shoes.jpg") },
    { name: "SWEATER", image: require("../../assets/images/categories/men/sweater.jpg") },
    { name: "SPORTS SHOES", image: require("../../assets/images/categories/men/sports-shoes.jpg") },
    { name: "TROUSERS", image: require("../../assets/images/categories/men/trousers.jpg") },
    { name: "KURTAS", image: require("../../assets/images/categories/men/kurtas.jpg") },
    { name: "JACKETS", image: require("../../assets/images/categories/men/jackets.jpg") },
    { name: "WATCHES", image: require("../../assets/images/categories/men/watches.jpg") },
    { name: "BOTTLES", image: require("../../assets/images/categories/men/bottles.jpg") },
    { name: "PERFUME", image: require("../../assets/images/categories/men/perfume.jpg") },
  ];

  const womenCategories = [
    { name: "DRESSES", image: require("../../assets/images/categories/women/dresses.jpg") },
    { name: "TOPS", image: require("../../assets/images/categories/women/tops.jpg") },
    { name: "TROUSERS", image: require("../../assets/images/categories/women/trousers.jpg") },
    { name: "HEELS", image: require("../../assets/images/categories/women/heels.jpg") },
    { name: "JACKETS", image: require("../../assets/images/categories/women/jackets.jpg") },
    { name: "KURTAS", image: require("../../assets/images/categories/women/kurtas.jpg") },
    { name: "SAREES", image: require("../../assets/images/categories/women/sarees.jpg") },
    { name: "JEANS", image: require("../../assets/images/categories/women/jeans.jpg") },
    { name: "HANDBAGS", image: require("../../assets/images/categories/women/handbags.jpg") },
    { name: "PERFUME", image: require("../../assets/images/categories/women/perfume.jpg") },
    { name: "SPORTS SHOES", image: require("../../assets/images/categories/women/sports-shoes.jpg") },
    { name: "BOTTLES", image: require("../../assets/images/categories/women/bottles.jpg") },
  ];

  const bottomTabs = [
    { key: "home", label: "Home", type: "feather" as const, icon: "home" },
    { key: "stylist", label: "AI Stylist", type: "ion" as const, icon: "shirt-outline" },
    { key: "cart", label: "My Cart", type: "feather" as const, icon: "shopping-cart" },
    { key: "wish", label: "Wishlist", type: "feather" as const, icon: "heart" },
    { key: "profile", label: "Profile", type: "feather" as const, icon: "user" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Fashion</Text>
          <View style={styles.headerIcons}>
            <Feather name="bell" size={22} style={styles.icon} />
            <Feather name="heart" size={22} style={styles.icon} />
            <Feather name="user" size={22} style={styles.icon} />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} />
          <TextInput placeholder="Search for brands and products" style={styles.searchInput} />
          <Feather name="camera" size={20} />
          <Feather name="mic" size={20} style={{ marginLeft: 10 }} />
        </View>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
          {/* Top tabs + categories icon */}
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabTextActive}>Fashion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabInactive}>
              <Text style={styles.tabTextInactive}>Beauty</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Categories")}
              style={{ marginLeft: 160, padding: 6 }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityRole="button"
              accessibilityLabel="Open categories"
            >
              <Feather name="grid" size={20} />
            </TouchableOpacity>
          </View>

          {/* Men categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            {menCategories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategoryPress(item.name, 'men')}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Women categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            {womenCategories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategoryPress(item.name, 'women')}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Banner */}
          <Image source={require("../../assets/images/banner.png")} style={styles.banner} resizeMode="cover" />

          {/* Latest Products */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Products</Text>
            <TouchableOpacity><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={products}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => (
                <View style={styles.productCard}>
                  <Image source={item.image} style={styles.productImage} />
                  <TouchableOpacity style={styles.wishlistIcon}>
                    <Feather name="heart" size={18} color="#000" />
                  </TouchableOpacity>
                  <View style={styles.colorRow}>
                    {item.colors.slice(0, 3).map((color: string, idx: number) => (
                      <View key={idx} style={[styles.colorDot, { backgroundColor: color }]} />
                    ))}
                    {item.colors.length > 3 && (
                      <Text style={styles.colorLabel}>All {item.colors.length} Colors</Text>
                    )}
                  </View>
                  <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>{item.price}</Text>
                </View>
              )}
            />
          )}
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomTab}>
          {bottomTabs.map((tab, idx) => {
            const active = idx === 0;
            const handlePress = () => {
              if (tab.key === "stylist") return navigation.navigate("AIStylist");
              if (tab.key === "cart") return navigation.navigate("MyCart");
              if (tab.key === "wish") return navigation.navigate("Wishlist");
              if (tab.key === "home") return;
              // Profile -> Login for now if not authenticated, or Profile scren
              if (tab.key === "profile") {
                navigation.navigate("Profile");
              }
            };
            const IconComp = tab.type === "ion" ? Ionicons : Feather;

            return (
              <TouchableOpacity key={tab.key} style={styles.tabButton} onPress={handlePress}>
                <View>
                  <IconComp name={tab.icon as any} size={22} color={active ? "#000" : "#777"} />
                  {tab.key === "cart" && count > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeTxt}>{count}</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 12, color: active ? "#000" : "#777" }}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 0 },
  logo: { fontSize: 24, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  icon: { marginHorizontal: 8 },

  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#f1f1f1",
    borderRadius: 10, paddingHorizontal: 10, marginVertical: 15,
  },
  searchInput: { flex: 1, marginLeft: 10 },

  tabs: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tabActive: { backgroundColor: "#000", paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20, marginRight: 10 },
  tabInactive: { borderColor: "#000", borderWidth: 1, paddingVertical: 6, paddingHorizontal: 20, borderRadius: 20 },
  tabTextActive: { color: "#fff", fontWeight: "bold" },
  tabTextInactive: { color: "#000", fontWeight: "bold" },

  categories: { marginBottom: 15 },
  categoryItem: { alignItems: "center", marginRight: 15, width: 70 },
  categoryImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#eee", marginBottom: 5 },
  categoryLabel: { fontSize: 10, textAlign: "center", fontWeight: "500" },

  banner: { width: "100%", height: 160, borderRadius: 10, marginBottom: 15 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  seeAll: { color: "#007BFF", fontSize: 13 },

  productCard: { backgroundColor: "#fff", width: screenWidth / 2 - 25, borderRadius: 10, marginBottom: 20, padding: 10 },
  productImage: { width: "100%", height: 100, borderRadius: 10, marginBottom: 10 },
  wishlistIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#fff", padding: 4, borderRadius: 15 },
  colorRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 5 },
  colorLabel: { fontSize: 10, color: "#333" },
  productName: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  productPrice: { fontSize: 13, fontWeight: "bold" },

  bottomTab: {
    position: "absolute", bottom: 35, left: 0, right: 0, height: 80, backgroundColor: "#fff",
    flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderColor: "#eee",
    zIndex: 10, elevation: 10,
  },
  tabButton: { alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", right: -10, top: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: "#EF4444", justifyContent: "center", alignItems: "center", paddingHorizontal: 3 },
  badgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
});

export default HomeScreen;
