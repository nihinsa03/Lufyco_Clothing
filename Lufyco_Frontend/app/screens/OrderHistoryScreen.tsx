import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOrdersStore, Order } from "../store/useOrdersStore";
import { useTheme } from "../context/ThemeContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "OrderHistory">;

const OrderHistoryScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { orders } = useOrdersStore();
    const { colors, isDark } = useTheme();
    const styles = getStyles(colors, isDark);
    const [tab, setTab] = useState<'ongoing' | 'completed'>('ongoing');

    const filteredOrders = orders.filter(o => {
        if (tab === 'ongoing') return o.status !== 'Delivered';
        return o.status === 'Delivered';
    });

    const renderItem = ({ item }: { item: Order }) => {
        const firstItem = item.items?.[0];
        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.orderId, { color: colors.text }]}>Order #{item.id.split('-')[1]}</Text>
                    <Text style={[styles.date, { color: colors.textSecondary }]}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.cardBody}>
                    <Image
                        source={firstItem?.image && typeof firstItem.image === 'string' ? { uri: firstItem.image } : (firstItem?.image || require("../../assets/images/clothing.png"))}
                        style={styles.thumb}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{firstItem?.title || "Product"}</Text>
                        {item.items.length > 1 && <Text style={[styles.subtext, { color: colors.textSecondary }]}>+ {item.items.length - 1} more items</Text>}
                        <Text style={[styles.price, { color: colors.text }]}>LKR {item.total.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'Delivered' ? (isDark ? "#064E3B" : "#DCFCE7") : (isDark ? "#1E3A8A" : "#DBEAFE") }]}>
                        <Text style={[styles.statusText, { color: item.status === 'Delivered' ? (isDark ? "#6EE7B7" : "#16A34A") : (isDark ? "#93C5FD" : "#1E40AF") }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <View style={[styles.trackBtn, { backgroundColor: isDark ? "#2A2A2A" : "#F9FAFB" }]}>
                    <Text style={[styles.trackText, { color: colors.text }]}>View Details</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomWidth: 1, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                    <Feather name="arrow-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Order History</Text>
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



const getStyles = (colors: any, dark: boolean) => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
    headerTitle: { fontSize: 18, fontWeight: "700" },

    tabs: { flexDirection: "row", padding: 16 },
    tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderBottomWidth: 2, borderColor: colors.border },
    tabActive: { borderColor: colors.text },
    tabText: { fontWeight: "600", color: colors.textSecondary },
    tabTextActive: { color: colors.text },

    card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginVertical: 8, borderWidth: 1, borderColor: colors.border, elevation: 1 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    orderId: { fontWeight: "700" },
    date: { color: colors.textSecondary, fontSize: 12 },
    cardBody: { flexDirection: "row", alignItems: "center" },
    thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: dark ? "#333" : "#eee" },
    title: { fontWeight: "700", fontSize: 14 },
    subtext: { fontSize: 12, color: colors.textSecondary },
    price: { fontWeight: "700", marginTop: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 12, fontWeight: "700" },
    trackBtn: { marginTop: 16, alignItems: "center", paddingVertical: 10, backgroundColor: dark ? "#2A2A2A" : "#F9FAFB", borderRadius: 8 },
    trackText: { color: colors.text, fontWeight: "700" },

    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textSecondary, marginBottom: 20 },
    exploreBtn: { backgroundColor: colors.text, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
    exploreText: { color: colors.background, fontWeight: '700' },
});

export default OrderHistoryScreen;
