import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import FilterSheet, { FilterKey } from "./FilterSheet";
import SearchOverlay from "./SearchOverlay";
import api from "../api/api";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useWishlistStore } from "../store/useWishlistStore";

type Props = NativeStackScreenProps<RootStackParamList, "ProductListing">;

type Product = {
    _id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image: string; // URL or base64
    colors: string[];
    reviewsCount: number;
    category?: string;
    subCategory?: string;
    gender?: string;
    type?: string;
};

const ColorDots = ({ colors, styles }: { colors: string[], styles: any }) => {
    if (!colors || colors.length === 0) return null;
    return (
        <View style={styles.colorRow}>
            {colors.slice(0, 3).map((c, i) => (
                <View key={`${c}-${i}`} style={[styles.dot, { backgroundColor: c }]} />
            ))}
            {colors.length > 3 && (
                <Text style={styles.moreColors}>+{colors.length - 3}</Text>
            )}
        </View>
    );
};

const ProductListingScreen: React.FC<Props> = ({ navigation, route }) => {
    const { colors, isDark: dark } = useTheme();
    const styles = getStyles(colors, dark);
    const { gender, category, subCategory, type, search, isSale, title } = route.params || {};

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [filterVisible, setFilterVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterKey | null>("whats_new");

    const { toggleWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        fetchProducts();
    }, [selectedFilter, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Build query string
            const params: any = {};
            if (gender) params.gender = gender;
            if (category) params.category = category;
            if (subCategory) params.subCategory = subCategory;
            if (type) params.type = type;
            if (search) params.search = search;
            if (isSale) params.isSale = 'true';
            if (selectedFilter) params.sort = selectedFilter;

            // Use MOCK_PRODUCTS for now
            let data = [...MOCK_PRODUCTS];

            // Client-side filtering
            if (params.gender) {
                data = data.filter((p: Product) => p.gender === params.gender || p.gender === 'Unisex');
            }
            if (params.category) {
                // For Shoes/Accessories which are main categories but also used as filter
                data = data.filter((p: Product) => p.category === params.category || p.subCategory === params.category);
            }
            // Add other filters as needed... currently just showing all for simplicity if no specific match

            // If the route has specific filters, try to respect them
            if (params.category === "Shoes") {
                data = MOCK_PRODUCTS.filter((p: Product) => p.category === "Shoes");
            } else if (params.category === "Accessories") {
                data = MOCK_PRODUCTS.filter((p: Product) => p.category === "Accessories");
            } else if (params.gender === "Men") {
                // Show Men + Shoes (Men) + Accessories (Men/Unisex)
                data = MOCK_PRODUCTS.filter((p: Product) => p.gender === "Men" || (p.gender === "Unisex" && p.category !== "Women"));
            } else if (params.gender === "Women") {
                data = MOCK_PRODUCTS.filter((p: Product) => p.gender === "Women" || (p.gender === "Unisex" && p.category !== "Men"));
            } else if (params.gender === "Kids") {
                data = MOCK_PRODUCTS.filter((p: Product) => p.gender === "Kids" || p.category === "Kids");
            }

            // Apply sorting & filtering from selectedFilter
            if (selectedFilter === "price_low_to_high") {
                data.sort((a, b) => a.price - b.price);
            } else if (selectedFilter === "price_high_to_low") {
                data.sort((a, b) => b.price - a.price);
            } else if (selectedFilter === "discount") {
                data = data.filter((p: any) => p.compareAtPrice && p.compareAtPrice > p.price);
            } else if (selectedFilter === "popularity") {
                data.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
            } else if (selectedFilter === "whats_new") {
                const newArrivals = data.filter((p: any) => p.isNewArrival);
                data = newArrivals.length > 0 ? newArrivals : data.reverse();
            }

            // Simulate delay
            setTimeout(() => {
                setProducts(data);
                setLoading(false);
            }, 500);

            // const response = await api.get("/products", { params });
            // setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const handleProductPress = (product: Product) => {
        // Pass both ID and product object to ProductDetails
        navigation.navigate("ProductDetails", { id: product._id, product: product });
    };

    const displayName = title || type || subCategory || category || "Products";

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.hIcon}>
                    <Feather name="arrow-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{displayName.toUpperCase()}</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.hIcon}>
                        <Feather name="sliders" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSearchVisible(true)} style={styles.hIcon}>
                        <Feather name="search" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Grid */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.text} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.card}
                            onPress={() => handleProductPress(item)}
                        >
                            {/* Image handling: check if it's http or require */}
                            <Image
                                source={item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png")}
                                style={styles.image}
                            />
                            <TouchableOpacity
                                style={styles.wishBtn}
                                onPress={() => {
                                    toggleWishlist({
                                        id: item._id,
                                        productId: item._id,
                                        title: item.name,
                                        price: item.price,
                                        image: item.image,
                                    });
                                }}
                            >
                                <Ionicons
                                    name={isInWishlist(item._id) ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isInWishlist(item._id) ? "red" : dark ? "#fff" : "#111"}
                                />
                            </TouchableOpacity>

                            <View style={styles.colorRowWrap}>
                                <ColorDots colors={item.colors} styles={styles} />
                            </View>

                            <Text numberOfLines={1} style={styles.pTitle}>
                                {item.name}
                            </Text>

                            <View style={styles.priceRow}>
                                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                                {item.compareAtPrice && item.compareAtPrice > item.price && (
                                    <Text style={styles.compare}>${item.compareAtPrice.toFixed(2)}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={{ color: colors.text }}>No products found.</Text>
                        </View>
                    }
                />
            )}

            {/* Filter Bottom Sheet */}
            <FilterSheet
                visible={filterVisible}
                selected={selectedFilter}
                onClose={() => setFilterVisible(false)}
                onApply={(k) => {
                    setSelectedFilter(k);
                    setFilterVisible(false);
                }}
            />

            {/* Search Overlay */}
            <SearchOverlay
                visible={searchVisible}
                onClose={() => setSearchVisible(false)}
                onOpenFilter={() => {
                    setSearchVisible(false);
                    setFilterVisible(true);
                }}
                onSearch={(q) => {
                    setSearchVisible(false);
                    // Navigate to same screen with new search param
                    navigation.push("ProductListing", { search: q, title: `Search: ${q}` });
                }}
            />
        </SafeAreaView>
    );
};

const getStyles = (colors: any, dark: boolean) => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 8,
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: dark ? "#333" : "#eee",
    },
    hIcon: { padding: 6 },
    headerRight: { flexDirection: "row", alignItems: "center" },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.3,
        color: colors.text,
    },
    card: { width: "48%", marginTop: 14 },
    image: { width: "100%", height: 180, borderRadius: 14, backgroundColor: '#f0f0f0' },
    wishBtn: {
        position: "absolute",
        right: 10,
        top: 10,
        backgroundColor: dark ? "#333" : "#fff",
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },
    colorRowWrap: { marginTop: 8, flexDirection: "row", alignItems: "center", height: 20 },
    colorRow: { flexDirection: "row", alignItems: "center", marginRight: 8 },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 4,
        borderWidth: 1,
        borderColor: dark ? "#333" : "#e5e5e5",
    },
    moreColors: { fontSize: 10, color: dark ? '#aaa' : '#666' },
    pTitle: { fontSize: 14, fontWeight: "600", marginTop: 6, color: colors.text },
    priceRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    price: { fontSize: 14, fontWeight: "700", color: colors.text },
    compare: {
        fontSize: 12,
        color: dark ? '#777' : "#888",
        marginLeft: 8,
        textDecorationLine: "line-through",
    },
});

export default ProductListingScreen;
