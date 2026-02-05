import React, { useState, useRef } from "react";
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
    Platform,
    Animated,
    Modal
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
    const fullProduct = getProductById(id) || paramProduct;
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [qty, setQty] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("Successfully Added to Cart");

    // Animation Values
    const buttonScale = useRef(new Animated.Value(1)).current;
    const successOpacity = useRef(new Animated.Value(0)).current;

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


    const isWishlisted = isInWishlist(fullProduct.id || fullProduct._id);

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start();
    };

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        Animated.sequence([
            Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(successOpacity, { toValue: 0, duration: 300, useNativeDriver: true })
        ]).start(() => setShowSuccess(false));
    };

    const handleBuyNow = () => {
        if (validateSelection()) {
            addToCart();
            // @ts-ignore
            navigation.navigate("CheckoutShipping");
        }
    };

    const handleAddToCart = () => {
        animateButton();
        if (validateSelection()) {
            addToCart();
            showSuccessMessage("Successfully Added to Cart");
        }
    };

    const handleToggleWishlist = () => {
        const item = {
            id: fullProduct.id || fullProduct._id,
            productId: fullProduct.id || fullProduct._id,
            title: fullProduct.title || fullProduct.name,
            price: fullProduct.price,
            image: fullProduct.images ? fullProduct.images[0] : (fullProduct.image || ""),
            size: selectedSize || undefined,
            color: selectedColor || undefined
        };

        if (!isWishlisted) {
            showSuccessMessage("Successfully Added to Wishlist");
        }
        toggleWishlist(item);
    };

    const validateSelection = () => {
        if (fullProduct.sizes?.length > 0 && !selectedSize) {
            Alert.alert("Required", "Please select a size");
            return false;
        }
        if (fullProduct.colors?.length > 0 && !selectedColor) {
            Alert.alert("Required", "Please select a color");
            return false;
        }
        return true;
    };

    const addToCart = () => {
        addItemToCart({
            productId: fullProduct.id || fullProduct._id,
            title: fullProduct.title || fullProduct.name,
            price: fullProduct.price,
            image: fullProduct.images ? fullProduct.images[0] : (fullProduct.image || ""),
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            qty: qty,
        });
    };

    const renderRating = (rating: number, count: number) => (
        <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                    key={star}
                    name={star <= Math.round(rating) ? "star" : "star-outline"}
                    size={16}
                    color="#FBBF24"
                />
            ))}
            <Text style={styles.reviewCount}>({count} Reviews)</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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
                    <View style={styles.topRow}>
                        {renderRating(fullProduct.rating || 4.5, fullProduct.reviewsCount || fullProduct.reviews || 88)}
                    </View>

                    <View style={styles.titlePriceRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{fullProduct.title || fullProduct.name}</Text>
                            <Text style={styles.categoryText}>Men's Fashion</Text>
                        </View>
                        <View>
                            <Text style={styles.price}>LKR {fullProduct.price?.toFixed(2)}</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        {fullProduct.description || "A stylish comfortable piece for your wardrobe. Made from premium materials designed to last."}
                        <Text style={styles.readMore}> Read more</Text>
                    </Text>

                    <View style={styles.divider} />

                    {/* Colors */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Color</Text>
                        <View style={styles.optionsRow}>
                            {(fullProduct.colors || ['#000', '#fff', '#1F2937']).map((c: string) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setSelectedColor(c)}
                                    style={[
                                        styles.colorDot,
                                        { backgroundColor: c },
                                        selectedColor === c && styles.colorSelected
                                    ]}
                                >
                                    {selectedColor === c && <Feather name="check" size={14} color={c === '#fff' ? '#000' : '#fff'} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Sizes */}
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

                    {/* Quantity */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Quantity</Text>
                        <View style={styles.stepperContainer}>
                            <TouchableOpacity style={styles.stepBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                                <Feather name="minus" size={20} color="#111" />
                            </TouchableOpacity>
                            <Text style={styles.stepVal}>{qty}</Text>
                            <TouchableOpacity style={styles.stepBtn} onPress={() => setQty(qty + 1)}>
                                <Feather name="plus" size={20} color="#111" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.wishBtn} onPress={handleToggleWishlist}>
                    <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={28} color={isWishlisted ? "red" : "#111"} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
                    <Text style={styles.buyBtnText}>Buy Now</Text>
                </TouchableOpacity>

                <Animated.View style={{ flex: 1.5, transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.9}>
                        <Feather name="shopping-bag" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.addBtnText}>Add to Cart</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Success Message Overlay */}
            {showSuccess && (
                <Animated.View style={[styles.successOverlay, { opacity: successOpacity }]}>
                    <View style={styles.successBox}>
                        <View style={styles.checkCircle}>
                            <Feather name="check" size={24} color="#fff" />
                        </View>
                        <Text style={styles.successText}>{successMessage}</Text>
                    </View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 10, zIndex: 10
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    backBtn: { padding: 8 },

    heroImage: {
        width: width,
        height: 420,
        backgroundColor: '#F3F4F6'
    },
    content: {
        padding: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        backgroundColor: '#fff',
    },

    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    reviewCount: { color: '#666', fontSize: 13, marginLeft: 6, fontWeight: '500' },

    titlePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111', lineHeight: 30, marginBottom: 4 },
    categoryText: { color: '#666', fontSize: 14 },
    price: { fontSize: 22, fontWeight: 'bold', color: '#111' },

    description: { color: '#666', lineHeight: 22, fontSize: 14 },
    readMore: { color: '#111', fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },

    section: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111' },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap' },

    // Colors
    colorDot: {
        width: 36, height: 36, borderRadius: 18, marginRight: 15,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#ddd'
    },
    colorSelected: { borderWidth: 2, borderColor: '#111' },

    // Sizes
    sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sizeGuide: { color: '#666', textDecorationLine: 'underline', fontSize: 13 },
    sizeChip: {
        width: 48, height: 48, borderRadius: 24,
        borderWidth: 1, borderColor: '#E5E7EB',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    sizeChipSelected: { backgroundColor: '#111', borderColor: '#111' },
    sizeText: { fontSize: 14, fontWeight: '600', color: '#111' },
    sizeTextSelected: { color: '#fff' },

    // Stepper
    stepperContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F9FAFB', alignSelf: 'flex-start',
        borderRadius: 12, paddingHorizontal: 5
    },
    stepBtn: {
        width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    },
    stepVal: { width: 40, textAlign: 'center', fontSize: 18, fontWeight: '600' },

    // Bottom Bar
    bottomBar: {
        position: 'absolute', bottom: 0, width: '100%',
        backgroundColor: '#fff', padding: 20, paddingBottom: 30,
        borderTopWidth: 1, borderColor: '#F3F4F6',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 10,
    },
    wishBtn: {
        width: 52, height: 52, borderRadius: 16,
        borderWidth: 1, borderColor: '#E5E7EB',
        alignItems: 'center', justifyContent: 'center', marginRight: 12
    },
    buyBtn: {
        flex: 1, height: 52, borderRadius: 16,
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#111',
        alignItems: 'center', justifyContent: 'center', marginRight: 12
    },
    buyBtnText: { fontWeight: '700', fontSize: 15, color: '#111' },
    addBtn: {
        width: '100%', height: 52, borderRadius: 16,
        backgroundColor: '#111',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    addBtnText: { fontWeight: '700', fontSize: 15, color: '#fff' },

    // Success Overlay
    successOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center', alignItems: 'center',
        zIndex: 200, pointerEvents: 'none'
    },
    successBox: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        paddingHorizontal: 25, paddingVertical: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5
    },
    checkCircle: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#22c55e',
        justifyContent: 'center', alignItems: 'center', marginBottom: 10
    },
    successText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default ProductDetailsScreen;
