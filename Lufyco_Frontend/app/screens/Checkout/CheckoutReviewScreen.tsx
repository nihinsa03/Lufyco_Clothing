import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCartStore } from "../../store/useCartStore";
import { useCheckoutStore } from "../../store/useCheckoutStore";
import { useOrdersStore, Order } from "../../store/useOrdersStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { useTheme } from "../../context/ThemeContext";

type NavProp = NativeStackNavigationProp<RootStackParamList, "CheckoutReview">;

const CheckoutReviewScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { shippingAddress, paymentMethod } = useCheckoutStore();
    const { addOrder } = useOrdersStore();
    const { colors } = useTheme();

    const subtotal = getTotalPrice();
    const shippingCost = 0; // Free shipping logic for now
    const total = subtotal + shippingCost;

    const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

    const onPlaceOrder = () => {
        if (!shippingAddress || !paymentMethod) {
            Alert.alert("Error", "Missing shipping or payment info.");
            return;
        }

        const newOrder: Order = {
            id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString(),
            status: 'Processing',
            items: [...items], // Clone items
            address: shippingAddress,
            payment: paymentMethod,
            subtotal,
            shipping: shippingCost,
            discount: 0,
            total
        };

        addOrder(newOrder);
        clearCart();
        navigation.reset({
            index: 0,
            routes: [{ name: 'OrderSuccess' }],
        });
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Review Order</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Stepper */}
            <View style={styles.stepperContainer}>
                <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, styles.stepDone]}>
                        <Feather name="check" size={16} color="#fff" />
                    </View>
                    <Text style={[styles.stepText, styles.stepTextDone]}>Shipping</Text>
                </View>
                <View style={[styles.line, { backgroundColor: '#2563EB' }]} />
                <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, styles.stepDone]}>
                        <Feather name="check" size={16} color="#fff" />
                    </View>
                    <Text style={[styles.stepText, styles.stepTextDone]}>Payment</Text>
                </View>
                <View style={[styles.line, { backgroundColor: '#2563EB' }]} />
                <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, styles.stepActive]}>
                        <Feather name="check" size={16} color="#fff" />
                    </View>
                    <Text style={[styles.stepText, styles.stepTextActive]}>Review</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

                {/* Shipping Summary */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Shipping Address</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("CheckoutShipping")}>
                            <Feather name="edit-2" size={16} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.cardText, { color: colors.text }]}>{shippingAddress?.fullName}</Text>
                    <Text style={[styles.cardText, { color: colors.text }]}>{shippingAddress?.phone}</Text>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        {shippingAddress?.addressLine}, {shippingAddress?.city}, {shippingAddress?.country} {shippingAddress?.postalCode}
                    </Text>
                </View>

                {/* Payment Summary */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Method</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("CheckoutPayment")}>
                            <Feather name="edit-2" size={16} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="credit-card" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
                        <Text style={[styles.cardText, { color: colors.text }]}>
                            {paymentMethod?.method === 'cash' ? 'Cash on Delivery' : `${paymentMethod?.method?.toUpperCase()} ending in ${paymentMethod?.last4}`}
                        </Text>
                    </View>
                </View>

                {/* Items Preview */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>Items ({items.length})</Text>
                    {items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image
                                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                style={styles.thumb}
                            />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>Size: {item.size} • Color: {item.color}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                    <Text style={[styles.itemPrice, { color: colors.text }]}>${item.price}</Text>
                                    <Text style={[styles.itemQty, { color: colors.textSecondary }]}>x{item.qty}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Delivery Option */}
                <View style={[styles.deliveryCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>Estimated delivery in next 7 days</Text>
                </View>

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Subtotal</Text>
                        <Text style={[styles.val, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Shipping</Text>
                        <Text style={[styles.val, { color: colors.text }]}>${shippingCost.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.row, { marginTop: 12 }]}>
                        <Text style={[styles.label, { fontSize: 18, color: colors.text }]}>Total</Text>
                        <Text style={[styles.val, { fontSize: 18, color: colors.text }]}>${total.toFixed(2)}</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.btn} onPress={onPlaceOrder}>
                    <Text style={styles.btnText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6'
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

    stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    stepItem: { alignItems: 'center' },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    stepActive: { backgroundColor: '#2563EB' },
    stepDone: { backgroundColor: '#2563EB' },
    stepText: { fontSize: 12, color: '#999', fontWeight: '500' },
    stepTextActive: { color: '#2563EB', fontWeight: '700' },
    stepTextDone: { color: '#2563EB', fontWeight: '700' },
    line: { width: 40, height: 2, backgroundColor: '#F3F4F6', marginBottom: 16, marginHorizontal: 8 },

    card: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
    cardText: { fontSize: 14, color: '#333', marginBottom: 2 },

    itemRow: { flexDirection: 'row', marginBottom: 12 },
    thumb: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#eee' },
    itemTitle: { fontSize: 14, fontWeight: '600', color: '#111' },
    itemMeta: { fontSize: 12, color: '#666' },
    itemPrice: { fontSize: 13, fontWeight: '700' },
    itemQty: { fontSize: 13, color: '#666' },

    deliveryCard: { padding: 16, backgroundColor: '#F0FDF4', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#DCFCE7' },

    totalsSection: { marginTop: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 14, color: '#666' },
    val: { fontSize: 14, fontWeight: '600', color: '#111' },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
    btn: { backgroundColor: '#111', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CheckoutReviewScreen;
