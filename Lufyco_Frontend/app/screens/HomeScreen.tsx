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

import { useApi } from "../hooks/useApi";

const HomeScreen = ({ navigation }: Props) => {
  const { categories, setFilter } = useShopStore();
  const [activeTab, setActiveTab] = useState("Fashion");

  const { data: apiProducts, loading, error, get } = useApi<any[]>();
  const [latestProducts, setLatestProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    // Determine query based on tab or other logic if needed
    // For now, just fetch all products and filter locally for 'Latest' 
    // real app would use /products?sort=newest
    const data = await get('/products');
    if (data) {
      // Filter for 'isNewArrival' and limit to 4
      const newArrivals = data.filter((p: any) => p.isNewArrival || p.isNew).slice(0, 4);
      setLatestProducts(newArrivals.length > 0 ? newArrivals : data.slice(0, 4));
    }
  };

  const handleCategoryPress = (catId: string) => {
    setFilter({ categoryId: catId });
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
            <TouchableOpacity style={styles.iconBtn}><Feather name="bell" size={24} color="#000" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Feather name="heart" size={24} color="#000" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("Main", { screen: "Profile" } as any)}>
              <Feather name="user" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchInput}>Search for brands and products</Text>
          <View style={styles.searchRightIcons}>
            <Feather name="camera" size={20} color="#666" style={{ marginRight: 15 }} />
            <Feather name="mic" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <View style={styles.tabsWrapper}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "Fashion" && styles.activeTab]}
                onPress={() => setActiveTab("Fashion")}
              >
                <Text style={[styles.tabText, activeTab === "Fashion" && styles.activeTabText]}>Fashion</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "Beauty" && styles.activeTab]}
                onPress={() => setActiveTab("Beauty")}
              >
                <Text style={[styles.tabText, activeTab === "Beauty" && styles.activeTabText]}>Beauty</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.gridIcon}>
              <Ionicons name="grid-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Categories Grid */}
          <View style={styles.categoriesGrid}>
            {categories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategoryPress(item.id)}>
                <View style={styles.categoryImageContainer}>
                  <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Banner */}
          <View style={styles.bannerContainer}>
            <Image source={require("../../assets/images/categories/men/watches.jpg")} style={styles.banner} resizeMode="cover" />
            <View style={styles.bannerOverlay}>
              <View style={styles.discountTag}>
                <Text style={styles.discountText}>30% OFF</Text>
              </View>
              <Text style={styles.bannerTitle}>On Watches</Text>
              <Text style={styles.bannerSubtitle}>Exclusive Sales</Text>
            </View>
            {/* Pagination Dots */}
            <View style={styles.paginationDots}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Latest Products */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ShopNewStyles")}><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
          </View>

          {loading ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : error ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
              <TouchableOpacity onPress={fetchLatestProducts} style={{ padding: 10, backgroundColor: '#eee', borderRadius: 8 }}>
                <Text>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={latestProducts}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No new products found.</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={
                        item.images && item.images.length > 0
                          ? (typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0])
                          : require("../../assets/images/clothing.png")
                      }
                      style={styles.productImage}
                    />
                    <TouchableOpacity style={styles.wishlistBtn}>
                      <Feather name="heart" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.productInfo}>
                    <View style={styles.cardColorRow}>
                      {item.colors && Array.isArray(item.colors) && item.colors.length > 0 ? (
                        <>
                          {item.colors.slice(0, 3).map((color: string, index: number) => (
                            <View key={index} style={[styles.colorCircle, { backgroundColor: color.toLowerCase() }]} />
                          ))}
                          <Text style={styles.moreColors}>All {item.colors.length} Colors</Text>
                        </>
                      ) : (
                        <Text style={[styles.moreColors, { marginLeft: 0, textDecorationLine: 'none' }]}>{item.colors?.length ? "1 Color" : "No colors"}</Text>
                      )}
                    </View>
                    <Text numberOfLines={1} style={styles.productName}>{item.title || item.name}</Text>
                    <Text style={styles.productPrice}>LKR {item.price ? (item.price * 300).toFixed(2) : '0.00'}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 15 },
  logo: { fontSize: 26, fontWeight: "800", color: '#000' },
  headerIcons: { flexDirection: "row", alignItems: 'center' },
  iconBtn: { marginLeft: 15 },

  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderRadius: 30, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 20,
    borderWidth: 1, borderColor: '#3b82f6', // Blue outline style
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#333" },
  searchRightIcons: { flexDirection: 'row', alignItems: 'center' },

  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tabsWrapper: { flexDirection: 'row' },
  tab: {
    paddingVertical: 8, paddingHorizontal: 24, borderRadius: 25,
    borderWidth: 1, borderColor: '#3b82f6', marginRight: 10, backgroundColor: '#fff'
  },
  activeTab: { backgroundColor: '#001F54', borderColor: '#001F54' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#000' },
  activeTabText: { color: '#fff' },
  gridIcon: { padding: 8 },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  categoryItem: { width: '15%', alignItems: 'center', marginBottom: 15 },
  categoryImageContainer: {
    width: 50, height: 50, borderRadius: 12, overflow: 'hidden', marginBottom: 5, backgroundColor: '#f9f9f9',
    justifyContent: 'center', alignItems: 'center'
  },
  categoryImage: { width: '100%', height: '100%' },
  categoryName: { fontSize: 10, fontWeight: '600', textAlign: 'center', color: '#333' },

  bannerContainer: { height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 25, position: 'relative' },
  banner: { width: "100%", height: "100%" },
  bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, justifyContent: 'center' },
  discountTag: { backgroundColor: '#111', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 5 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: '#fff', fontSize: 14, fontWeight: '500', opacity: 0.9 },
  bannerSubtitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  paginationDots: { position: 'absolute', bottom: 15, right: 20, flexDirection: 'row' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#3b82f6' },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: '#000' },
  seeAll: { color: "#2DD4BF", fontSize: 12, fontWeight: '600' },

  productCard: { backgroundColor: "#fff", width: (screenWidth - 48) / 2, marginBottom: 20 },
  imageWrapper: {
    width: '100%', aspectRatio: 1, backgroundColor: "#F3F4F6", borderRadius: 16, marginBottom: 10,
    overflow: 'hidden', position: 'relative'
  },
  productImage: { width: "100%", height: "100%" },
  wishlistBtn: {
    position: "absolute", top: 10, right: 10,
    backgroundColor: '#000', // Black circle
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center'
  },
  productInfo: { paddingHorizontal: 4 },
  cardColorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  colorCircle: { width: 10, height: 10, borderRadius: 5, marginRight: -3, borderWidth: 1, borderColor: '#fff' },
  moreColors: { fontSize: 10, color: '#666', marginLeft: 8 },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#111" },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#000" },
});

export default HomeScreen;
