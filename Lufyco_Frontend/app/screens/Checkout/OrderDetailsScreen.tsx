import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useOrdersStore } from "../../store/useOrdersStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "OrderDetails">;
type ScreenRouteProp = RouteProp<RootStackParamList, "OrderDetails">;

const OrderDetailsScreen = () => {
    const navigation = useNavigation<NavProp>();
    const route = useRoute<ScreenRouteProp>();
    const { orderId } = route.params;
    const { getOrderById } = useOrdersStore();

    const order = getOrderById(orderId);

    if (!order) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Order Not Found</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Header Info */}
                <View style={styles.rowBetween}>
                    <View>
                        <Text style={styles.orderId}>Order #{order.id.split('-')[1]}</Text>
                        <Text style={styles.date}>{new Date(order.date).toDateString()}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Items */}
                <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
                {order.items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                        <Image
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.thumb}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemMeta}>Qty: {item.qty} • Size: {item.size}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.divider} />

                {/* Shipping Info */}
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{order.address.fullName}</Text>
                    <Text style={styles.infoText}>{order.address.addressLine}</Text>
                    <Text style={styles.infoText}>{order.address.city}, {order.address.postalCode}</Text>
                    <Text style={styles.infoText}>{order.address.country}</Text>
                </View>

                {/* Payment Info */}
                <Text style={styles.sectionTitle}>Payment Info</Text>
                <View style={styles.infoBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="credit-card" size={16} color="#444" style={{ marginRight: 8 }} />
                        <Text style={styles.infoText}>{order.payment.method.toUpperCase()} **** {order.payment.last4}</Text>
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.val}>${order.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Shipping</Text>
                        <Text style={styles.val}>${order.shipping.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.row, { marginTop: 12 }]}>
                        <Text style={[styles.label, { fontSize: 18, color: '#111' }]}>Total</Text>
                        <Text style={[styles.val, { fontSize: 18, color: '#111' }]}>${order.total.toFixed(2)}</Text>
                    </View>
                </View>

            </ScrollView>
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
    title: { fontSize: 18, marginLeft: 16, fontWeight: '700' },

    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderId: { fontSize: 16, fontWeight: '700', color: '#111' },
    date: { fontSize: 13, color: '#666', marginTop: 2 },
    statusBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { color: '#1E40AF', fontSize: 12, fontWeight: '700' },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },

    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#111' },

    itemRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
    thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
    itemTitle: { fontSize: 14, fontWeight: '600', color: '#111' },
    itemMeta: { fontSize: 12, color: '#666', marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: '700', marginTop: 4 },

    infoBox: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 20 },
    infoText: { fontSize: 14, color: '#333', lineHeight: 20 },

    summaryContainer: { marginTop: 10, backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 14, color: '#666' },
    val: { fontSize: 14, fontWeight: '600', color: '#111' },
});

export default OrderDetailsScreen;
