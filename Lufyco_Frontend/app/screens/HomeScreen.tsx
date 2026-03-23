import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList, Dimensions, SafeAreaView, ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, Platform, StatusBar } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCart } from "../context/CartContext";
import { useShopStore } from "../store/useShopStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";

import api from "../api/api";

const screenWidth = Dimensions.get("window").width;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const { products, categories, setFilter, fetchProducts } = useShopStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { colors, isDark } = useTheme();

  // Live latest products from API
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [latestLoading, setLatestLoading] = useState(true);

  // Fetch live products + latest from MongoDB when HomeScreen loads
  useEffect(() => {
    fetchProducts();
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const res = await api.get('/products/latest');
      const data = res.data?.products || res.data || [];
      setLatestProducts(data);
    } catch (err) {
      console.warn('[HomeScreen] Failed to fetch latest products:', err);
      // Fallback: use store products
      setLatestProducts(products.slice(0, 10));
    } finally {
      setLatestLoading(false);
    }
  };

  // Banner carousel data
  const banners = [
    { image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", discount: "30% OFF", title: "On Watches", subtitle: "Exclusive Sales" },
    { image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop", discount: "25% OFF", title: "On Jackets", subtitle: "Winter Collection" },
    { image: "https://images.unsplash.com/photo-1523293115678-02a500e57ba5?q=80&w=600&auto=format&fit=crop", discount: "40% OFF", title: "On Perfumes", subtitle: "Premium Fragrances" },
    { image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop", discount: "20% OFF", title: "On Sneakers", subtitle: "Trending Now" },
    { image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop", discount: "35% OFF", title: "On Sweaters", subtitle: "Season Sale" },
  ];

  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const bannerWidth = screenWidth - 32; // account for padding

  // Auto-scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => {
        const next = (prev + 1) % banners.length;
        bannerScrollRef.current?.scrollTo({ x: next * bannerWidth, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setActiveBanner(index);
  };


  const handleCategoryPress = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    const searchableName = cat.name.toLowerCase().replace(/\s+/g, '');
    navigation.navigate("ProductListing", {
      search: searchableName,
      title: cat.name,
    });
  };

  const handleProductPress = (item: any) => {
    navigation.navigate("ProductDetails", { id: item.id, product: item });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.text }]}>Fashion</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => navigation.navigate("AIStylist" as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="sparkles-outline" size={24} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => navigation.navigate("Notifications" as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="bell" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => navigation.navigate("Main", { screen: "Wishlist" } as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="heart" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => navigation.navigate("Main", { screen: "Profile" } as any)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="user" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TouchableOpacity style={[styles.searchBox, { backgroundColor: colors.searchBg }]} onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.searchInput, { color: colors.textSecondary }]}>Search for brands and products</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("ImageSearch")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="camera" size={20} color="#667eea" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Tabs - Fashion Only */}
          <View style={styles.tabContainer}>
            <View style={styles.tabsWrapper}>
              {/* Only Fashion, always active style (Black pill) */}
              <TouchableOpacity
                style={[styles.tab, styles.activeTab]} // Use activeTab style directly
                activeOpacity={1}
              >
                <Text style={[styles.tabText, styles.activeTabText]}>Fashion</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.gridIcon} onPress={() => navigation.navigate("Categories")}>
              <Ionicons name="grid-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Categories - 2-row horizontal scrolling grid */}
          <View style={{ marginBottom: 32 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((colIndex) => {
                const topItem = categories[colIndex];
                const bottomItem = categories[colIndex + 12];
                const colWidth = (screenWidth - 32) / 5.5; // fits ~5.5 items in view to exactly show 6 columns gracefully
                return (
                  <View key={colIndex} style={{ width: colWidth, paddingRight: 8, rowGap: 16 }}>
                    {topItem && (
                      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleCategoryPress(topItem.id)}>
                        <View style={[styles.categoryImageContainer, { width: colWidth - 12, height: colWidth - 12 }]}>
                          <Image source={typeof topItem.image === 'string' ? { uri: topItem.image } : topItem.image} style={styles.categoryImage} resizeMode="cover" />
                        </View>
                        <Text style={[styles.categoryName, { color: colors.text, fontSize: 9 }]} numberOfLines={1}>{topItem.name.toUpperCase()}</Text>
                      </TouchableOpacity>
                    )}
                    {bottomItem && (
                      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleCategoryPress(bottomItem.id)}>
                        <View style={[styles.categoryImageContainer, { width: colWidth - 12, height: colWidth - 12 }]}>
                          <Image source={typeof bottomItem.image === 'string' ? { uri: bottomItem.image } : bottomItem.image} style={styles.categoryImage} resizeMode="cover" />
                        </View>
                        <Text style={[styles.categoryName, { color: colors.text, fontSize: 9 }]} numberOfLines={1}>{bottomItem.name.toUpperCase()}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Banner Carousel */}
          <View style={styles.bannerContainer}>
            <ScrollView
              ref={bannerScrollRef}
              horizontal
              pagingEnabled={false}
              snapToInterval={bannerWidth}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleBannerScroll}
              style={{ borderRadius: 20 }}
            >
              {banners.map((banner, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.bannerSlide, { width: bannerWidth }]}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate("Sale")}
                >
                  <Image source={{ uri: banner.image }} style={styles.banner} resizeMode="cover" />
                  <View style={styles.bannerOverlay}>
                    <View style={styles.discountTag}>
                      <Text style={styles.discountText}>{banner.discount}</Text>
                    </View>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Pagination Dots */}
            <View style={styles.paginationDots}>
              {banners.map((_, index) => (
                <View key={index} style={[styles.dot, index === activeBanner && styles.activeDot]} />
              ))}
            </View>
          </View>

          {/* Latest Products */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ShopNewStyles")}><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
          </View>

          {latestLoading ? (
            <ActivityIndicator size="small" color={colors.text} style={{ marginTop: 20 }} />
          ) : (
          <FlatList
            key={'2col'}
            data={latestProducts}
            extraData={colors}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            keyExtractor={(item) => item.id || item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.productCard, { backgroundColor: colors.card }]}
                onPress={() => navigation.navigate('ProductDetails', { id: item.id || item._id, product: item })}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={
                      item.images && item.images[0]
                        ? { uri: item.images[0] }
                        : typeof item.images?.[0] !== 'string' && item.images?.[0]
                          ? item.images[0]
                          : require('../../assets/images/clothing.png')
                    }
                    style={styles.productImage}
                  />
                  {(item.oldPrice || item.discountPercent) && (
                    <View style={styles.saleBadge}>
                      <Text style={styles.saleBadgeText}>
                        {item.discountPercent ? `-${item.discountPercent}%` : 'SALE'}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[styles.wishlistBtn, { backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)' }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleWishlist({
                        id: item.id || item._id,
                        productId: item.id || item._id,
                        title: item.title || item.name,
                        price: item.price,
                        image: item.images?.[0] || '',
                      });
                    }}
                  >
                    <Feather
                      name="heart"
                      size={16}
                      color={isInWishlist(item.id || item._id) ? "#ef4444" : colors.text}
                    />
                  </TouchableOpacity>
                </View>

                <View style={[styles.productInfo, { paddingBottom: 10 }]}>
                  <View style={styles.cardColorRow}>
                    {(item.colors || []).slice(0, 3).map((c: string, i: number) => (
                      <View key={i} style={[styles.colorCircle, { backgroundColor: c, borderColor: colors.card }]} />
                    ))}
                    {(item.colors?.length || 0) > 3 && (
                      <Text style={[styles.moreColors, { color: colors.textSecondary }]}>+{item.colors.length - 3}</Text>
                    )}
                  </View>
                  <Text numberOfLines={1} style={[styles.productName, { color: colors.text }]}>{item.title || item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.productPrice, { color: colors.text }]}>LKR {item.price.toFixed(2)}</Text>
                    {item.oldPrice && (
                      <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>LKR {item.oldPrice.toFixed(2)}</Text>
                    )}
                  </View>
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
  safeArea: { flex: 1, backgroundColor: "#fff" , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 16 , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 15 },
  logo: { fontSize: 26, fontWeight: "800", color: '#000' },
  headerIcons: { flexDirection: "row", alignItems: 'center' },
  iconBtn: { marginLeft: 15 },

  searchBox: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5",
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#666" },
  searchRightIcons: { flexDirection: 'row', alignItems: 'center' },

  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  tabsWrapper: { flexDirection: 'row' },
  tab: {
    paddingVertical: 8, paddingHorizontal: 24, borderRadius: 25,
    borderWidth: 1, borderColor: '#eee', marginRight: 10, backgroundColor: '#fff'
  },
  activeTab: { backgroundColor: '#000', borderColor: '#000' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#555' },
  activeTabText: { color: '#fff' },
  gridIcon: { padding: 8 },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  categoryItem: { width: '15%', alignItems: 'center', marginBottom: 15 },
  categoryImageContainer: {
    width: 50, height: 50, borderRadius: 12, overflow: 'hidden', marginBottom: 5, backgroundColor: '#f9f9f9',
    justifyContent: 'center', alignItems: 'center'
  },
  categoryImage: { width: '100%', height: '100%' },
  categoryName: { fontSize: 10, fontWeight: '600', textAlign: 'center', color: '#888' },

  // Slider categories (remaining items beyond 2 rows)
  sliderCategoryItem: { width: 65, alignItems: 'center', marginRight: 12 },
  sliderCategoryImageContainer: {
    width: 50, height: 50, borderRadius: 12, overflow: 'hidden', marginBottom: 5, backgroundColor: '#f9f9f9',
    justifyContent: 'center', alignItems: 'center'
  },
  sliderCategoryName: { fontSize: 10, fontWeight: '600', textAlign: 'center', color: '#333' },

  bannerContainer: { height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 36, position: 'relative' },
  bannerSlide: { height: 180, borderRadius: 20, overflow: 'hidden' },
  banner: { width: "100%", height: "100%" },
  bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, justifyContent: 'center' },
  discountTag: { backgroundColor: '#111', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 5 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  bannerTitle: { color: '#fff', fontSize: 14, fontWeight: '500', opacity: 0.9 },
  bannerSubtitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  paginationDots: { position: 'absolute', bottom: 15, right: 20, flexDirection: 'row' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#3b82f6' }, // Blue active dot to match image

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: '#000' }, // overridden inline with colors.text
  seeAll: { color: "#2DD4BF", fontSize: 12, fontWeight: '600' }, // Teal color matching image

  productCard: { width: (screenWidth - 48) / 2, marginBottom: 20, borderRadius: 16, overflow: 'hidden' },
  imageWrapper: {
    width: '100%', aspectRatio: 1, backgroundColor: "#E5E7EB", borderRadius: 16, marginBottom: 10,
    overflow: 'hidden', position: 'relative'
  },
  productImage: { width: "100%", height: "100%" },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  productInfo: { paddingHorizontal: 8, paddingTop: 4 },
  cardColorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  colorCircle: { width: 10, height: 10, borderRadius: 5, marginRight: -3, borderWidth: 1 },
  moreColors: { fontSize: 9, color: '#666', marginLeft: 8, textDecorationLine: 'underline' },
  productName: { fontSize: 13, fontWeight: "500", marginBottom: 4 },
  productPrice: { fontSize: 13, fontWeight: "bold" },
  oldPrice: { fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginLeft: 6 },
  saleBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, zIndex: 1
  },
  saleBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
});

export default HomeScreen;
