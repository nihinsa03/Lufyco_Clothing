import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useWishlistStore } from "../store/useWishlistStore";
import { useApi } from "../hooks/useApi"; // ADDED
import { useEffect } from "react"; // ADDED
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Wishlist">;
const { width, height } = Dimensions.get("window");

const WishlistScreen: React.FC<Props> = ({ navigation }) => {
    const { items, removeFromWishlist } = useWishlistStore();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { loading, error, get } = useApi();

    useEffect(() => {
        // Sync wishlist with server
        get('/wishlist');
    }, []);

    const confirmDelete = () => {
        if (deleteId) {
            removeFromWishlist(deleteId);
            setDeleteId(null);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Wishlist</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.emptyContainer}>
                    <Image
                        source={require("../../assets/images/bag.png")} // Fallback or use placeholder
                        style={styles.emptyImg}
                        resizeMode="contain"
                    />
                    <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                    <Text style={styles.emptySub}>Tap the heart icon to start saving your favorites</Text>

                    <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("Home")}>
                        <Text style={styles.exploreText}>Explore Categories</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wishlist</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {loading && <ActivityIndicator size="small" color="#000" style={{ marginRight: 10 }} />}
                    <TouchableOpacity style={{ padding: 4 }}>
                        <Feather name="more-horizontal" size={24} color="#111" />
                    </TouchableOpacity>
                </View>
            </View>

            {error && (
                <View style={{ backgroundColor: '#FEE2E2', padding: 8, marginHorizontal: 16, borderRadius: 8 }}>
                    <Text style={{ color: '#DC2626', fontSize: 12 }}>{error}</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {items.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Image
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.itemThumb}
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.delBtn} onPress={() => setDeleteId(item.productId)}>
                                <Feather name="trash-2" size={18} color="#EF4444" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cartBtn}
                                // Navigate to detail to select size/color
                                onPress={() => navigation.navigate("ProductDetails", { id: item.productId })}
                            >
                                <Feather name="shopping-cart" size={16} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Delete Confirmation Modal */}
            <Modal visible={!!deleteId} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete product from wishlist?</Text>
                        <Text style={styles.modalSub}>Are you sure you want to remove this item?</Text>

                        <TouchableOpacity style={styles.modalDeleteBtn} onPress={confirmDelete}>
                            <Text style={styles.modalDeleteText}>Delete Product</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setDeleteId(null)}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6'
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

    // Empty
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyImg: { width: 140, height: 140, marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 8 },
    emptySub: { textAlign: 'center', color: '#666', lineHeight: 22, fontSize: 14 },
    exploreBtn: { marginTop: 30, backgroundColor: '#111', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12 },
    exploreText: { color: '#fff', fontWeight: '700' },

    // List
    card: { flexDirection: 'row', marginBottom: 16, padding: 12, borderRadius: 16, backgroundColor: '#F9FAFB', alignItems: 'center' },
    itemThumb: { width: 70, height: 70, borderRadius: 10, backgroundColor: '#eee' },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 4 },
    itemPrice: { fontSize: 15, fontWeight: '600', color: '#555' },

    actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    delBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', borderRadius: 8 },
    cartBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB', borderRadius: 8 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#111' },
    modalSub: { color: '#666', marginBottom: 24 },
    modalDeleteBtn: { backgroundColor: '#111', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginBottom: 12, width: '100%', alignItems: 'center' },
    modalDeleteText: { color: '#fff', fontWeight: '700' },
    modalCancelBtn: { paddingVertical: 12 },
    modalCancelText: { color: '#666', fontWeight: '600' }
});

export default WishlistScreen;
