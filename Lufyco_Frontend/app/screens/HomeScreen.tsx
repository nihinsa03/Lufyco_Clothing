import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList,
  Dimensions, SafeAreaView, ActivityIndicator
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCart } from "../context/CartContext";
import { useShopStore } from "../store/useShopStore";
import { RootStackParamList } from "../navigation/AppNavigator";

const screenWidth = Dimensions.get("window").width;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const { products, categories, setCategory } = useShopStore();

  // Filter for Latest Products
  const latestProducts = products.filter(p => p.isLatest).slice(0, 4);

  const handleCategoryPress = (catId: string) => {
    setCategory(catId);
    navigation.navigate("Main", { screen: "Categories" } as any); // Or navigate to CategoryProducts directly if desired
    // But typically Home chips -> Listing of that category
    navigation.navigate("CategoryProducts");
  };

  const handleProductPress = (item: any) => {
    navigation.navigate("ProductDetails", { id: item.id, product: item });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Fashion</Text>
          <View style={styles.headerIcons}>
            <Feather name="bell" size={22} style={styles.icon} />
            <Feather name="heart" size={22} style={styles.icon} />
            <TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "Profile" } as any)}>
              <Feather name="user" size={22} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={20} />
          <Text style={styles.searchInput}>Search for brands and products</Text>
          <Feather name="camera" size={20} />
          <Feather name="mic" size={20} style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

          {/* Categories Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            <TouchableOpacity style={styles.chipActive} onPress={() => setCategory(undefined)}>
              <Text style={styles.chipTextActive}>All</Text>
            </TouchableOpacity>
            {categories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.chipInactive} onPress={() => handleCategoryPress(item.id)}>
                <Text style={styles.chipTextInactive}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Banner */}
          <View style={styles.bannerContainer}>
            <Image source={require("../../assets/images/banner.png")} style={styles.banner} resizeMode="cover" />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerText}>Exclusive Sales</Text>
              <Text style={styles.bannerSubText}>UP TO 50% OFF</Text>
            </View>
          </View>

          {/* Latest Products */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ShopNewStyles")}><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
          </View>

          <FlatList
            data={latestProducts}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
                <Image
                  source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]}
                  style={styles.productImage}
                />
                <TouchableOpacity style={styles.wishlistIcon}>
                  <Feather name="heart" size={18} color="#000" />
                </TouchableOpacity>
                <View style={styles.colorRow}>
                  {item.colors.slice(0, 3).map((color: string, idx: number) => (
                    <View key={idx} style={[styles.colorDot, { backgroundColor: color }]} />
                  ))}
                </View>
                <Text numberOfLines={1} style={styles.productName}>{item.title}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </TouchableOpacity>
            )}
          />

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 10 },
  logo: { fontSize: 24, fontWeight: "bold" },
  headerIcons: { flexDirection: "row" },
  icon: { marginHorizontal: 8 },

  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#f1f1f1",
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 12, marginBottom: 15,
  },
  searchInput: { flex: 1, marginLeft: 10, color: "#999" },

  categories: { marginBottom: 20 },
  chipActive: { backgroundColor: "#000", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10 },
  chipInactive: { backgroundColor: "#f3f3f3", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10 },
  chipTextActive: { color: "#fff", fontWeight: "bold" },
  chipTextInactive: { color: "#000", fontWeight: "bold" },

  bannerContainer: { marginBottom: 20, borderRadius: 10, overflow: 'hidden' },
  banner: { width: "100%", height: 160 },
  bannerOverlay: { position: 'absolute', bottom: 20, left: 20 },
  bannerText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  bannerSubText: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 5 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { color: "#666", fontSize: 13 },

  productCard: { backgroundColor: "#fff", width: screenWidth / 2 - 25, borderRadius: 10, marginBottom: 20 },
  productImage: { width: "100%", height: 180, borderRadius: 10, marginBottom: 10, backgroundColor: "#f9f9f9" },
  wishlistIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "#fff", padding: 6, borderRadius: 20 },
  colorRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5, borderWidth: 1, borderColor: "#eee" },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#333" },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#111" },
});

export default HomeScreen;
