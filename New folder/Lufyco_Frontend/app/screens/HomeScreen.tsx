import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useShopStore } from "../store/useShopStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const { products, categories, setFilter, fetchProducts } = useShopStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("[HomeScreen] Fetching products...");
        setLoading(true);
        await fetchProducts();
      } catch (err) {
        console.log("[HomeScreen] Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchProducts]);

  useEffect(() => {
    console.log("[HomeScreen] Products updated, count:", products?.length || 0);
    if (products?.length > 0) {
      console.log("[HomeScreen] First product image:", products[0]?.images || products[0]?.image);
    }
  }, [products]);

  const banners = [
    {
      image: require("../../assets/images/categories/men/watches.jpg"),
      discount: "30% OFF",
      title: "On Watches",
      subtitle: "Exclusive Sales",
    },
    {
      image: require("../../assets/images/categories/men/jackets.jpg"),
      discount: "25% OFF",
      title: "On Jackets",
      subtitle: "Winter Collection",
    },
    {
      image: require("../../assets/images/categories/men/perfume.jpg"),
      discount: "40% OFF",
      title: "On Perfumes",
      subtitle: "Premium Fragrances",
    },
    {
      image: require("../../assets/images/categories/men/sports-shoes.jpg"),
      discount: "20% OFF",
      title: "On Sneakers",
      subtitle: "Trending Now",
    },
    {
      image: require("../../assets/images/categories/men/sweater.jpg"),
      discount: "35% OFF",
      title: "On Sweaters",
      subtitle: "Season Sale",
    },
  ];

  const [activeBanner, setActiveBanner] = useState(0);
  const bannerScrollRef = useRef<ScrollView>(null);
  const bannerWidth = screenWidth - 32;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => {
        const next = (prev + 1) % banners.length;
        bannerScrollRef.current?.scrollTo({ x: next * bannerWidth, animated: true });
        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleBannerScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setActiveBanner(index);
  };

  const latestProducts = Array.isArray(products)
    ? products.filter((p: any) => p?.isNewArrival)
    : [];

  const handleCategoryPress = (catId: string, name: string) => {
    setFilter({
      query: "",
      newArrivals: false,
      popularThisWeek: false,
      priceDropping: false,
      discountOnly: false,
      popularity: false,
      priceLowToHigh: false,
      priceHighToLow: false,
      priceMin: undefined,
      priceMax: undefined,
      categoryId: catId,
    });

    navigation.navigate("Categories", { c_id: catId, name });
  };

  const getImageUri = (item: any) => {
    if (!item) return "";

    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }

    if (typeof item.images === "string") {
      return item.images;
    }

    if (typeof item.image === "string") {
      return item.image;
    }

    return "";
  };

  const renderProductCard = ({ item }: { item: any }) => {
    const imageUri = getImageUri(item);

    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate("ProductDetails", { id: item.id, product: item })}
      >
        <View style={styles.imageWrapper}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={[styles.productImage, styles.noImageBox]}>
              <Text style={styles.noImageText}>No Image</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.wishlistBtn,
              {
                backgroundColor:
                  colors.card === "#1E1E1E"
                    ? "rgba(30, 30, 30, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist({
                id: item.id,
                productId: item.id,
                title: item.title || item.name,
                price: item.price,
                image: imageUri,
              });
            }}
          >
            <Feather
              name="heart"
              size={16}
              color={isInWishlist(item.id) ? "#ef4444" : "#000"}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.productInfo, { paddingBottom: 10 }]}>
          <View style={styles.cardColorRow}>
            <View style={[styles.colorCircle, { backgroundColor: "#000", borderColor: colors.card }]} />
            <View style={[styles.colorCircle, { backgroundColor: "#2ba", borderColor: colors.card }]} />
            <View style={[styles.colorCircle, { backgroundColor: "#0f0", borderColor: colors.card }]} />
            <Text style={[styles.moreColors, { color: colors.textSecondary }]}>All 5 Colors</Text>
          </View>

          <Text numberOfLines={1} style={[styles.productName, { color: colors.text }]}>
            {item.title || item.name}
          </Text>

          <Text style={[styles.productPrice, { color: colors.text }]}>
            LKR {item.price}.00
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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

        <TouchableOpacity
          style={[styles.searchBox, { backgroundColor: colors.searchBg }]}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.searchInput, { color: colors.textSecondary }]}>
            Search for brands and products
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ImageSearch")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="camera" size={20} color="#667eea" />
          </TouchableOpacity>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.tabContainer}>
            <View style={styles.tabsWrapper}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]} activeOpacity={1}>
                <Text style={[styles.tabText, styles.activeTabText]}>Fashion</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.gridIcon} onPress={() => navigation.navigate("Categories")}>
              <Ionicons name="grid-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 32 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 0 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((colIndex) => {
                const topItem = categories[colIndex];
                const bottomItem = categories[colIndex + 12];
                const colWidth = (screenWidth - 32) / 5.5;

                return (
                  <View key={colIndex} style={{ width: colWidth, paddingRight: 8, rowGap: 16 }}>
                    {topItem && (
                      <TouchableOpacity
                        style={{ alignItems: "center" }}
                        onPress={() => handleCategoryPress(topItem.id, topItem.name)}
                      >
                        <View
                          style={[
                            styles.categoryImageContainer,
                            { width: colWidth - 12, height: colWidth - 12 },
                          ]}
                        >
                          <Image
                            source={
                              typeof topItem.image === "string"
                                ? { uri: topItem.image }
                                : topItem.image
                            }
                            style={styles.categoryImage}
                            resizeMode="cover"
                          />
                        </View>
                        <Text
                          style={[styles.categoryName, { color: colors.text, fontSize: 9 }]}
                          numberOfLines={1}
                        >
                          {topItem.name.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {bottomItem && (
                      <TouchableOpacity
                        style={{ alignItems: "center" }}
                        onPress={() => handleCategoryPress(bottomItem.id, bottomItem.name)}
                      >
                        <View
                          style={[
                            styles.categoryImageContainer,
                            { width: colWidth - 12, height: colWidth - 12 },
                          ]}
                        >
                          <Image
                            source={
                              typeof bottomItem.image === "string"
                                ? { uri: bottomItem.image }
                                : bottomItem.image
                            }
                            style={styles.categoryImage}
                            resizeMode="cover"
                          />
                        </View>
                        <Text
                          style={[styles.categoryName, { color: colors.text, fontSize: 9 }]}
                          numberOfLines={1}
                        >
                          {bottomItem.name.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>

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
                  <Image source={banner.image} style={styles.banner} resizeMode="cover" />
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

            <View style={styles.paginationDots}>
              {banners.map((_, index) => (
                <View key={index} style={[styles.dot, index === activeBanner && styles.activeDot]} />
              ))}
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ShopNewStyles")}>
              <Text style={styles.seeAll}>SEE ALL</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#667eea" />
            </View>
          ) : (
            <FlatList
              key="2col"
              data={latestProducts}
              extraData={colors}
              scrollEnabled={false}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={renderProductCard}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No products found
                  </Text>
                </View>
              }
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  logo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 15,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tabsWrapper: {
    flexDirection: "row",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  activeTab: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
  },
  gridIcon: {
    padding: 8,
  },

  categoryImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: "#888",
  },

  bannerContainer: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 36,
    position: "relative",
  },
  bannerSlide: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: "center",
  },
  discountTag: {
    backgroundColor: "#111",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 5,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.9,
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  paginationDots: {
    position: "absolute",
    bottom: 15,
    right: 20,
    flexDirection: "row",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#3b82f6",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  seeAll: {
    color: "#2DD4BF",
    fontSize: 12,
    fontWeight: "600",
  },

  productCard: {
    width: (screenWidth - 48) / 2,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    marginBottom: 10,
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  noImageBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  noImageText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  cardColorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  colorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: -3,
    borderWidth: 1,
  },
  moreColors: {
    fontSize: 9,
    color: "#666",
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  productName: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "bold",
  },
  loaderBox: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});

export default HomeScreen;