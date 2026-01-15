import React, { useEffect, useState } from "react";
import {
    SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "OrderHistory">;

const OrderHistoryScreen: React.FC<Props> = ({ navigation }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'ongoing' | 'completed'>('ongoing');

    useEffect(() => {
        if (user?._id) {
            fetchOrders();
        } else {
            setLoading(false); // Guest
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/orders/myorders?userId=${user?._id}`);
            setOrders(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(o => {
        // Dummy logic: Ongoing if < 7 days old or no status 'delivered'
        // Just showing all in "Ongoing" for now unless status is explicit
        if (tab === 'ongoing') return !o.isDelivered;
        return o.isDelivered;
    });

    const renderItem = ({ item }: { item: any }) => {
        const firstItem = item.orderItems?.[0];
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.cardBody}>
                    <Image
                        source={firstItem?.image && firstItem.image.startsWith('http') ? { uri: firstItem.image } : require("../../assets/images/clothing.png")}
                        style={styles.thumb}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.title} numberOfLines={1}>{firstItem?.name || "Product"}</Text>
                        {item.orderItems.length > 1 && <Text style={styles.subtext}>+ {item.orderItems.length - 1} more items</Text>}
                        <Text style={styles.price}>${item.totalPrice.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.isPaid ? "#DCFCE7" : "#FEF3C7" }]}>
                        <Text style={[styles.statusText, { color: item.isPaid ? "#16A34A" : "#D97706" }]}>
                            {item.isPaid ? "Paid" : "Pending"}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.trackBtn}>
                    <Text style={styles.trackText}>Track Order</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
                    <Feather name="arrow-left" size={22} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setTab('ongoing')} style={[styles.tab, tab === 'ongoing' && styles.tabActive]}>
                    <Text style={[styles.tabText, tab === 'ongoing' && styles.tabTextActive]}>Ongoing</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTab('completed')} style={[styles.tab, tab === 'completed' && styles.tabActive]}>
                    <Text style={[styles.tabText, tab === 'completed' && styles.tabTextActive]}>Completed</Text>
                </TouchableOpacity>
            </View>

            {loading ? <ActivityIndicator size="large" color="#111" style={{ marginTop: 50 }} /> : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={i => i._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>No orders found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
    headerTitle: { fontSize: 18, fontWeight: "700" },

    tabs: { flexDirection: "row", padding: 16 },
    tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderBottomWidth: 2, borderColor: "#eee" },
    tabActive: { borderColor: "#111" },
    tabText: { fontWeight: "600", color: "#888" },
    tabTextActive: { color: "#111" },

    card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginVertical: 8, borderWidth: 1, borderColor: "#F3F4F6", elevation: 1 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    orderId: { fontWeight: "700" },
    date: { color: "#666", fontSize: 12 },
    cardBody: { flexDirection: "row", alignItems: "center" },
    thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#eee" },
    title: { fontWeight: "700", fontSize: 14 },
    subtext: { fontSize: 12, color: "#666" },
    price: { fontWeight: "700", marginTop: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: "700" },
    trackBtn: { marginTop: 16, alignItems: "center", paddingVertical: 10, backgroundColor: "#111", borderRadius: 8 },
    trackText: { color: "#fff", fontWeight: "700" },
});

export default OrderHistoryScreen;
