import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons"; // Ensure FontAwesome is available or use Feather
import { useNavigation } from "@react-navigation/native";
import { useCheckoutStore, PaymentMethod } from "../../store/useCheckoutStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "CheckoutPayment">;

const CheckoutPaymentScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { setPaymentMethod } = useCheckoutStore();

    const [selectedMethod, setSelectedMethod] = useState<'visa' | 'mastercard' | 'paypal' | 'applepay'>('visa');
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const onContinue = () => {
        // Basic validation
        if (selectedMethod === 'visa' || selectedMethod === 'mastercard') {
            if (!cardNumber || !expiry || !cvv) {
                Alert.alert("Required", "Please fill in all card details.");
                return;
            }
        }

        const method: PaymentMethod = {
            method: selectedMethod,
            cardHolder: cardName,
            last4: cardNumber.slice(-4) || "1234", // Mock logic
        };

        setPaymentMethod(method);
        navigation.navigate("CheckoutReview");
    };

    const renderMethod = (id: 'visa' | 'mastercard' | 'paypal' | 'applepay', icon: any, label: string) => (
        <TouchableOpacity
            style={[styles.payOption, selectedMethod === id && styles.payOptionActive]}
            onPress={() => setSelectedMethod(id)}
        >
            {/* Using text or simple icons for mock */}
            <View style={styles.methodIcon}>
                <Text style={{ fontWeight: '700', fontSize: 10 }}>{label}</Text>
            </View>
            {selectedMethod === id && (
                <View style={styles.checkBadge}>
                    <Feather name="check" size={10} color="#fff" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
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
                    <View style={[styles.stepCircle, styles.stepActive]}>
                        <Feather name="credit-card" size={16} color="#fff" />
                    </View>
                    <Text style={[styles.stepText, styles.stepTextActive]}>Payment</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.stepItem}>
                    <View style={styles.stepCircle}>
                        <Feather name="check" size={16} color="#999" />
                    </View>
                    <Text style={styles.stepText}>Review</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.methodsRow}>
                    {renderMethod('visa', null, "VISA")}
                    {renderMethod('mastercard', null, "MASTER")}
                    {renderMethod('paypal', null, "PAYPAL")}
                    {renderMethod('applepay', null, "APPLE")}
                </View>

                {/* Card Form */}
                {(selectedMethod === 'visa' || selectedMethod === 'mastercard') && (
                    <View style={styles.cardForm}>
                        <Text style={styles.label}>Card Holder Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name on Card"
                            value={cardName} onChangeText={setCardName}
                        />

                        <Text style={styles.label}>Card Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0000 0000 0000 0000"
                            keyboardType="numeric"
                            value={cardNumber} onChangeText={setCardNumber}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>Expiration</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/YY"
                                    value={expiry} onChangeText={setExpiry}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    value={cvv} onChangeText={setCvv}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {(selectedMethod === 'paypal' || selectedMethod === 'applepay') && (
                    <View style={styles.infoBox}>
                        <Text style={{ color: '#666' }}>You will be redirected to complete payment securely.</Text>
                    </View>
                )}

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btn} onPress={onContinue}>
                    <Text style={styles.btnText}>Continue</Text>
                </TouchableOpacity>
            </View>
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

    stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    stepItem: { alignItems: 'center' },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    stepActive: { backgroundColor: '#2563EB' },
    stepDone: { backgroundColor: '#2563EB' },
    stepText: { fontSize: 12, color: '#999', fontWeight: '500' },
    stepTextActive: { color: '#2563EB', fontWeight: '700' },
    stepTextDone: { color: '#2563EB', fontWeight: '700' },
    line: { width: 40, height: 2, backgroundColor: '#F3F4F6', marginBottom: 16, marginHorizontal: 8 },

    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
    methodsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    payOption: {
        width: 70, height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
        alignItems: 'center', justifyContent: 'center', position: 'relative'
    },
    payOptionActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
    methodIcon: { alignItems: 'center', justifyContent: 'center' },
    checkBadge: {
        position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: 8,
        backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center'
    },

    cardForm: { marginTop: 10 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151', marginTop: 12 },
    input: {
        height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
        paddingHorizontal: 16, fontSize: 15, color: '#111'
    },
    row: { flexDirection: 'row' },

    infoBox: { padding: 20, backgroundColor: '#F9FAFB', borderRadius: 12, alignItems: 'center', marginTop: 20 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
    btn: { backgroundColor: '#111', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CheckoutPaymentScreen;
