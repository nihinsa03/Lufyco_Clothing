import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Dimensions,
    ToastAndroid,
    Platform,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useProductsStore } from "../store/useProductsStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetails">;

const { width } = Dimensions.get("window");

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    // Params
    const { id, product: paramProduct } = route.params;

    // Store Hooks
    const getProductById = useProductsStore((state) => state.getProductById);
    const addItemToCart = useCartStore((state) => state.addItem);
    const { toggleWishlist, isInWishlist } = useWishlistStore();

    // Local State
    // Try to find full product details from store if ID passed, else use param object
    const fullProduct = getProductById(id) || paramProduct;

    // Safe fallback if product not found
    if (!fullProduct) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={{ padding: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                        <Feather name="arrow-left" size={24} />
                    </TouchableOpacity>
                </View>
                <Text style={{ padding: 20, textAlign: 'center' }}>Product not found</Text>
            </SafeAreaView>
        )
    }

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [qty, setQty] = useState(1);

    // Wishlist state
    const isWishlisted = isInWishlist(fullProduct.id || fullProduct._id);

    const handleAddToCart = () => {
        // Validation
        if ((fullProduct.sizes?.length > 0 && !selectedSize)) {
            if (Platform.OS === 'android') {
                ToastAndroid.show("Please select a size", ToastAndroid.SHORT);
            } else {
                Alert.alert("Required", "Please select a size");
            }
            return;
        }
        if ((fullProduct.colors?.length > 0 && !selectedColor)) {
            if (Platform.OS === 'android') {
                ToastAndroid.show("Please select a color", ToastAndroid.SHORT);
            } else {
                Alert.alert("Required", "Please select a color");
            }
            return;
        }

        // Add to Cart
        addItemToCart({
            productId: fullProduct.id || fullProduct._id,
            title: fullProduct.title || fullProduct.name,
            price: fullProduct.price,
            image: fullProduct.images ? fullProduct.images[0] : (fullProduct.image || ""),
            size: selectedSize || undefined,
            color: selectedColor || undefined,
        });

        // Feedback
        if (Platform.OS === 'android') {
            ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
        } else {
            Alert.alert("Success", "Added to cart!");
        }
    };

    const handleWishlist = () => {
        toggleWishlist({
            id: fullProduct.id || fullProduct._id,
            productId: fullProduct.id || fullProduct._id,
            title: fullProduct.title || fullProduct.name,
            price: fullProduct.price,
            image: fullProduct.images ? fullProduct.images[0] : (fullProduct.image || ""),
        });
    };

    const renderRating = (rating: number, count: number) => (
        <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                    key={star}
                    name={star <= Math.round(rating) ? "star" : "star-outline"}
                    size={14}
                    color="#FBBF24"
                />
            ))}
            <Text style={styles.reviewCount}>({count} Reviews)</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header Back Button Overlay */}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>

                {/* Main Image */}
                <Image
                    source={
                        fullProduct.images && fullProduct.images[0]
                            ? (typeof fullProduct.images[0] === 'string' ? { uri: fullProduct.images[0] } : fullProduct.images[0])
                            : (fullProduct.image ? (typeof fullProduct.image === 'string' ? { uri: fullProduct.image } : fullProduct.image) : require("../../assets/images/clothing.png"))
                    }
                    style={styles.heroImage}
                />

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.categoryTag}>New Arrival</Text>
                        <View style={styles.freeShipTag}>
                            <Text style={styles.freeShipText}>Free Shipping</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{fullProduct.title || fullProduct.name}</Text>

                    <View style={styles.priceRow}>
                        {renderRating(fullProduct.rating || 4.5, fullProduct.reviewsCount || fullProduct.reviews || 88)}
                        <Text style={styles.price}>${fullProduct.price?.toFixed(2)}</Text>
                        {fullProduct.oldPrice && (
                            <Text style={styles.oldPrice}>${fullProduct.oldPrice?.toFixed(2)}</Text>
                        )}
                    </View>

                    <Text style={styles.description}>
                        {fullProduct.description || "A stylish comfortable piece for your wardrobe. Made from premium materials designed to last."}
                        <Text style={styles.readMore}> Read more</Text>
                    </Text>

                    <View style={styles.divider} />

                    {/* Colors */}
                    {fullProduct.colors && fullProduct.colors.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Color</Text>
                            <View style={styles.optionsRow}>
                                {fullProduct.colors.map((c: string) => (
                                    <TouchableOpacity
                                        key={c}
                                        onPress={() => setSelectedColor(c)}
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: c },
                                            selectedColor === c && styles.colorSelected
                                        ]}
                                    >
                                        {selectedColor === c && <Feather name="check" size={14} color="#fff" />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Sizes */}
                    {(fullProduct.sizes || ['S', 'M', 'L', 'XL']).length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sizeHeader}>
                                <Text style={styles.label}>Size</Text>
                                <Text style={styles.sizeGuide}>Size Guide</Text>
                            </View>
                            <View style={styles.optionsRow}>
                                {(fullProduct.sizes || ['S', 'M', 'L', 'XL']).map((s: string) => (
                                    <TouchableOpacity
                                        key={s}
                                        onPress={() => setSelectedSize(s)}
                                        style={[
                                            styles.sizeChip,
                                            selectedSize === s && styles.sizeChipSelected
                                        ]}
                                    >
                                        <Text style={[styles.sizeText, selectedSize === s && styles.sizeTextSelected]}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Quantity */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Quantity</Text>
                        <View style={styles.stepper}>
                            <TouchableOpacity
                                style={styles.stepBtn}
                                onPress={() => setQty(Math.max(1, qty - 1))}
                            >
                                <Feather name="minus" size={18} />
                            </TouchableOpacity>
                            <Text style={styles.stepVal}>{qty}</Text>
                            <TouchableOpacity
                                style={styles.stepBtn}
                                onPress={() => setQty(qty + 1)}
                            >
                                <Feather name="plus" size={18} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.wishBtn} onPress={handleWishlist}>
                    <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={26} color={isWishlisted ? "red" : "#111"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyBtn}>
                    <Text style={[styles.btnText, { color: '#111' }]}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
                    <Feather name="shopping-bag" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    backBtn: {
        position: 'absolute', top: 50, left: 16, zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 20
    },
    heroImage: {
        width: width,
        height: 480,
        resizeMode: 'cover',
    },
    content: {
        padding: 24,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        marginTop: -40,
        backgroundColor: '#fff',
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    categoryTag: {
        backgroundColor: '#E0F2FE', color: '#0284C7',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
        fontSize: 11, fontWeight: '700', marginRight: 8
    },
    freeShipTag: {
        backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6
    },
    freeShipText: { color: '#16A34A', fontSize: 11, fontWeight: '700' },

    title: { fontSize: 26, fontWeight: '800', color: '#111', marginBottom: 8, lineHeight: 32 },
    priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    reviewCount: { color: '#666', fontSize: 13, marginLeft: 6, fontWeight: '500' },
    price: { fontSize: 24, fontWeight: '700', color: '#111' },
    oldPrice: { fontSize: 18, color: '#999', textDecorationLine: 'line-through', marginLeft: 12 },

    description: { color: '#4B5563', lineHeight: 22, fontSize: 14 },
    readMore: { color: '#111', fontWeight: '700' },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 },

    section: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '700', marginBottom: 16, color: '#111' },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap' },

    // Colors
    colorDot: {
        width: 40, height: 40, borderRadius: 20, marginRight: 16,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#eee'
    },
    colorSelected: { borderWidth: 2, borderColor: '#111' },

    // Sizes
    sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sizeGuide: { color: '#666', textDecorationLine: 'underline', fontSize: 13 },
    sizeChip: {
        width: 50, height: 50, borderRadius: 25,
        borderWidth: 1, borderColor: '#E5E7EB',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    sizeChipSelected: { backgroundColor: '#111', borderColor: '#111' },
    sizeText: { fontSize: 15, fontWeight: '600', color: '#111' },
    sizeTextSelected: { color: '#fff' },

    // Stepper
    stepper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F3F4F6', alignSelf: 'flex-start',
        borderRadius: 16, padding: 6
    },
    stepBtn: {
        width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
    },
    stepVal: { width: 48, textAlign: 'center', fontSize: 18, fontWeight: '700' },

    // Bottom Bar
    bottomBar: {
        position: 'absolute', bottom: 0, width: '100%',
        backgroundColor: '#fff', padding: 20, paddingBottom: 30,
        borderTopWidth: 1, borderColor: '#F3F4F6',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 10
    },
    wishBtn: {
        width: 56, height: 56, borderRadius: 18,
        borderWidth: 1, borderColor: '#E5E7EB',
        alignItems: 'center', justifyContent: 'center', marginRight: 12
    },
    buyBtn: {
        flex: 1, height: 56, borderRadius: 18,
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#111',
        alignItems: 'center', justifyContent: 'center', marginRight: 12
    },
    addBtn: {
        flex: 1.5, height: 56, borderRadius: 18,
        backgroundColor: '#111',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    btnText: { fontWeight: '700', fontSize: 16, color: '#fff' }
});

export default ProductDetailsScreen;
