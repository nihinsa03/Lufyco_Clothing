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
import { Feather, FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCheckoutStore, PaymentMethod } from "../../store/useCheckoutStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "CheckoutPayment">;

const CheckoutPaymentScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { setPaymentMethod } = useCheckoutStore();

    const [selectedMethod, setSelectedMethod] = useState<'visa' | 'mastercard' | 'paypal' | 'googlepay'>('visa');
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const handleExpiryChange = (text: string) => {
        // Strip non-digits, then rebuild MM/YY
        const digits = text.replace(/\D/g, '').slice(0, 4);
        if (digits.length <= 2) {
            setExpiry(digits);
        } else {
            setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
        }
    };

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

    const renderMethodIcon = (id: 'visa' | 'mastercard' | 'paypal' | 'googlepay') => {
        let source;
        switch (id) {
            case 'visa':
                source = require('../../../assets/images/visa.png');
                break;
            case 'mastercard':
                source = require('../../../assets/images/mastercard.png');
                break;
            case 'paypal':
                source = require('../../../assets/images/paypal.png');
                break;
            case 'googlepay':
                source = require('../../../assets/images/googlepay.png');
                break;
        }

        return <Image source={source} style={{ width: 44, height: 28, resizeMode: 'contain', opacity: selectedMethod === id ? 1 : 0.6 }} />;
    };

    const renderMethod = (id: 'visa' | 'mastercard' | 'paypal' | 'googlepay') => (
        <TouchableOpacity
            style={[styles.payOption, selectedMethod === id && styles.payOptionActive]}
            onPress={() => setSelectedMethod(id)}
        >
            {selectedMethod === id && (
                <View style={styles.checkBadge}>
                    <Feather name="check" size={12} color="#fff" />
                </View>
            )}
            {renderMethodIcon(id)}
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
                    {renderMethod('visa')}
                    {renderMethod('mastercard')}
                    {renderMethod('paypal')}
                    {renderMethod('googlepay')}
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
                                    value={expiry} onChangeText={handleExpiryChange}
                                    maxLength={5} keyboardType="numeric"
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

                {(selectedMethod === 'paypal' || selectedMethod === 'googlepay') && (
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

    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#111' },
    methodsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    payOption: {
        flex: 1,
        height: 56,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginHorizontal: 4,
        backgroundColor: '#fff'
    },
    payOptionActive: {
        borderColor: '#2563EB',
        borderWidth: 2,
        backgroundColor: '#fff'
    },
    methodLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280'
    },
    methodLabelActive: {
        color: '#2563EB',
        fontWeight: '700'
    },
    checkBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center'
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
