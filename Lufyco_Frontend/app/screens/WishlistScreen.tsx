import React, { useEffect, useState } from "react";
import {
    SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import api from "../api/api";
import { useCart } from "../context/CartContext";

type Props = NativeStackScreenProps<RootStackParamList, "Wishlist">;

const WishlistScreen: React.FC<Props> = ({ navigation }) => {
    const [items, setItems] = useState<any[]>([]);
    const { addItem } = useCart();

    const fetchWishlist = async () => {
        try {
            const res = await api.get("/wishlist");
            setItems(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchWishlist();
        const unsub = navigation.addListener('focus', fetchWishlist);
        return unsub;
    }, [navigation]);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/wishlist/${id}`);
            fetchWishlist();
        } catch (e) {
            console.error(e);
        }
    };

    const handleMoveToCart = (item: any) => {
        // Add to cart
        addItem({
            id: item.product || item._id, // fallback to wishlist id if product not populated
            title: item.title,
            price: item.price,
            image: item.image && item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png"),
        }, 1);
        // Remove from wishlist? Usually "Move to Cart" implies removal from wishlist, but standard "Add to Cart" keeps it.
        // Let's just Add to Cart for now.
        alert("Added to cart");
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
                    <Feather name="arrow-left" size={22} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wishlist</Text>
                <View style={{ width: 22 }} />
            </View>

            {items.length === 0 ? (
                <View style={styles.empty}>
                    <Image source={require("../../assets/images/bag.png")} style={{ width: 100, height: 100, opacity: 0.5 }} resizeMode="contain" />
                    <Text style={styles.emptyText}>Your wishlist is empty</Text>
                    <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("Home")}>
                        <Text style={styles.exploreText}>Explore Categories</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {items.map(item => (
                        <View key={item._id} style={styles.row}>
                            <Image source={item.image && item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png")} style={styles.img} />
                            <View style={styles.info}>
                                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.price}>${item.price}</Text>
                                <TouchableOpacity style={styles.cartBtn} onPress={() => handleMoveToCart(item)}>
                                    <Text style={styles.cartBtnText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(item._id)}>
                                <Feather name="trash-2" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
    headerTitle: { fontSize: 18, fontWeight: "700" },

    empty: { flex: 1, alignItems: "center", justifyContent: "center" },
    emptyText: { marginTop: 16, fontSize: 18, fontWeight: "600", color: "#666" },
    exploreBtn: { marginTop: 20, backgroundColor: "#111", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    exploreText: { color: "#fff", fontWeight: "700" },

    row: { flexDirection: "row", marginBottom: 16, backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, alignItems: "center" },
    img: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eee" },
    info: { flex: 1, marginLeft: 12 },
    title: { fontWeight: "700", fontSize: 15, marginBottom: 4 },
    price: { fontWeight: "600", color: "#111", marginBottom: 8 },
    cartBtn: { backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: "flex-start" },
    cartBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    delBtn: { padding: 8 },
});

export default WishlistScreen;
