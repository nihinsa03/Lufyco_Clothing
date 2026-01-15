import React, { useState } from "react";
import {
    SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOrdersStore, Order } from "../store/useOrdersStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "OrderHistory">;

const OrderHistoryScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { orders } = useOrdersStore();
    const [tab, setTab] = useState<'ongoing' | 'completed'>('ongoing');

    const filteredOrders = orders.filter(o => {
        if (tab === 'ongoing') return o.status !== 'Delivered';
        return o.status === 'Delivered';
    });

    const renderItem = ({ item }: { item: Order }) => {
        const firstItem = item.items?.[0];
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.orderId}>Order #{item.id.split('-')[1]}</Text>
                    <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.cardBody}>
                    <Image
                        source={firstItem?.image && typeof firstItem.image === 'string' ? { uri: firstItem.image } : (firstItem?.image || require("../../assets/images/clothing.png"))}
                        style={styles.thumb}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.title} numberOfLines={1}>{firstItem?.title || "Product"}</Text>
                        {item.items.length > 1 && <Text style={styles.subtext}>+ {item.items.length - 1} more items</Text>}
                        <Text style={styles.price}>${item.total.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'Delivered' ? "#DCFCE7" : "#DBEAFE" }]}>
                        <Text style={[styles.statusText, { color: item.status === 'Delivered' ? "#16A34A" : "#1E40AF" }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <View style={styles.trackBtn}>
                    <Text style={styles.trackText}>View Details</Text>
                </View>
            </TouchableOpacity>
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

            <FlatList
                data={filteredOrders}
                keyExtractor={i => i.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require("../../assets/images/bag.png")}
                            style={{ width: 100, height: 100, opacity: 0.5, marginBottom: 20 }}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyTitle}>No {tab} orders</Text>
                        <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("Home")}>
                            <Text style={styles.exploreText}>Explore Categories</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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
    trackBtn: { marginTop: 16, alignItems: "center", paddingVertical: 10, backgroundColor: "#F9FAFB", borderRadius: 8 },
    trackText: { color: "#111", fontWeight: "700" },

    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#666', marginBottom: 20 },
    exploreBtn: { backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
    exploreText: { color: '#fff', fontWeight: '700' },
});

export default OrderHistoryScreen;
