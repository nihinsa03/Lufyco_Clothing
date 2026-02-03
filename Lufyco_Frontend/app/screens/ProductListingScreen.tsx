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
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import FilterSheet, { FilterKey } from "./FilterSheet";
import SearchOverlay from "./SearchOverlay";
import api from "../api/api"; // Keep for legacy if needed, but we prefer useApi
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { useApi } from "../hooks/useApi"; // ADDED

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

const ColorDots = ({ colors }: { colors: string[] }) => {
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
    const { gender, category, subCategory, type, search, isSale, title } = route.params || {};

    const { data: apiProducts, loading, error, get } = useApi<Product[]>();
    const [products, setProducts] = useState<Product[]>([]);

    // UI State
    const [filterVisible, setFilterVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<FilterKey | null>("whats_new");

    // Sync api data to local state if needed, or just use apiProducts
    useEffect(() => {
        if (apiProducts) {
            setProducts(apiProducts);
        }
    }, [apiProducts]);

    useEffect(() => {
        fetchProducts();
    }, [selectedFilter, search]);

    const fetchProducts = async () => {
        // Build query string
        const params: any = {};
        if (gender) params.gender = gender;
        if (category) params.category = category;
        if (subCategory) params.subCategory = subCategory;
        if (type) params.type = type;
        if (search) params.search = search;
        if (isSale) params.isSale = 'true';
        if (selectedFilter) params.sort = selectedFilter;

        // Call API
        await get("/products", params);
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
                    <Feather name="arrow-left" size={22} />
                </TouchableOpacity>
                <Text style={styles.title}>{displayName.toUpperCase()}</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.hIcon}>
                        <Feather name="sliders" size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSearchVisible(true)} style={styles.hIcon}>
                        <Feather name="search" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Grid */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#000" />
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
                                source={item.image && typeof item.image === 'string' && item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png")}
                                style={styles.image}
                            />
                            <TouchableOpacity style={styles.wishBtn}>
                                <Feather name="heart" size={18} color="#111" />
                            </TouchableOpacity>

                            <View style={styles.colorRowWrap}>
                                <ColorDots colors={item.colors} />
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
                            <Text>No products found.</Text>
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

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 8,
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#eee",
    },
    hIcon: { padding: 6 },
    headerRight: { flexDirection: "row", alignItems: "center" },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    card: { width: "48%", marginTop: 14 },
    image: { width: "100%", height: 180, borderRadius: 14, backgroundColor: '#f0f0f0' },
    wishBtn: {
        position: "absolute",
        right: 10,
        top: 10,
        backgroundColor: "#fff",
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
        borderColor: "#e5e5e5",
    },
    moreColors: { fontSize: 10, color: '#666' },
    pTitle: { fontSize: 14, fontWeight: "600", marginTop: 6 },
    priceRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
    price: { fontSize: 14, fontWeight: "700" },
    compare: {
        fontSize: 12,
        color: "#888",
        marginLeft: 8,
        textDecorationLine: "line-through",
    },
});

export default ProductListingScreen;
