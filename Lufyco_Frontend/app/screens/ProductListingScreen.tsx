import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Platform, StatusBar } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import FilterSheet, { FilterKey } from "./FilterSheet";
import SearchOverlay from "./SearchOverlay";
import api from "../api/api";

import { useWishlistStore } from "../store/useWishlistStore";

type Props = NativeStackScreenProps<RootStackParamList, "ProductListing">;

type Product = {
    _id: string;
    id?: string;
    name?: string;
    title?: string;
    price: number;
    compareAtPrice?: number;
    oldPrice?: number;
    image?: string;
    images?: string[];
    colors: string[];
    reviewsCount?: number;
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
    const { colors, isDark } = useTheme();
    const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);
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
            const params: any = {};
            if (gender) params.gender = gender;
            if (category) params.category = category;
            if (subCategory) params.subCategory = subCategory;
            if (type) params.type = type;
            if (search) params.search = search;
            if (isSale) params.isSale = 'true';
            if (selectedFilter && selectedFilter !== 'whats_new') params.sort = selectedFilter;

            const response = await api.get("/products", { params });
            const data: any[] = response.data?.products || response.data || [];

            if (selectedFilter === 'whats_new') {
                data.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
            }

            setProducts(data);
        } catch (error) {
            console.error("Error fetching from API:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductPress = (product: Product) => {
        const productId = product.id || product._id;
        navigation.navigate("ProductDetails", { id: productId, product: product });
    };

    const displayName = title || type || subCategory || category || "Products";

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.hIcon}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Feather name="arrow-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{displayName.toUpperCase()}</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        onPress={() => setFilterVisible(true)} 
                        style={styles.hIcon}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                        <Feather name="sliders" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setSearchVisible(true)} 
                        style={styles.hIcon}
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
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
                    keyExtractor={(item) => item.id || item._id}
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
                            {/* Use images[] array from API, fallback to image string */}
                            <Image
                                source={
                                    item.images && item.images[0]
                                        ? { uri: item.images[0] }
                                        : item.image && item.image.startsWith('http')
                                            ? { uri: item.image }
                                            : require("../../assets/images/clothing.png")
                                }
                                style={styles.image}
                            />
                            <TouchableOpacity
                                style={styles.wishBtn}
                                onPress={() => {
                                    const productId = item.id || item._id;
                                    const imageUrl = (item.images && item.images[0]) || item.image || '';
                                    toggleWishlist({
                                        id: productId,
                                        productId: productId,
                                        title: item.name || item.title || "Product",
                                        price: item.price,
                                        image: imageUrl,
                                    });
                                }}
                            >
                                <Ionicons
                                    name={isInWishlist(item.id || item._id) ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isInWishlist(item.id || item._id) ? "red" : isDark ? "#fff" : "#111"}
                                />
                            </TouchableOpacity>

                            <View style={styles.colorRowWrap}>
                                <ColorDots colors={item.colors} styles={styles} />
                            </View>

                            <Text numberOfLines={1} style={styles.pTitle}>
                                {item.title || item.name || "Unknown Product"}
                            </Text>

                            <View style={styles.priceRow}>
                                <Text style={styles.price}>LKR {item.price.toFixed(2)}</Text>
                                {(item.compareAtPrice || item.oldPrice) && (item.compareAtPrice || item.oldPrice)! > item.price && (
                                    <Text style={styles.compare}>LKR {(item.compareAtPrice || item.oldPrice)!.toFixed(2)}</Text>
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

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 8,
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: isDark ? "#333" : "#eee",
        backgroundColor: colors.background
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
    card: { width: "48%", marginTop: 14, backgroundColor: colors.background },
    image: { width: "100%", height: 180, borderRadius: 14, backgroundColor: colors.iconBg },
    wishBtn: {
        position: "absolute",
        right: 10,
        top: 10,
        backgroundColor: isDark ? "#333" : "#fff",
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
        borderColor: isDark ? "#333" : "#e5e5e5",
    },
    moreColors: { fontSize: 10, color: isDark ? '#aaa' : '#666' },
    pTitle: { fontSize: 14, fontWeight: "600", marginTop: 6, color: colors.text },
    priceRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    price: { fontSize: 14, fontWeight: "700", color: colors.text },
    compare: {
        fontSize: 12,
        color: isDark ? '#777' : "#888",
        marginLeft: 8,
        textDecorationLine: "line-through",
    },
});

export default ProductListingScreen;
