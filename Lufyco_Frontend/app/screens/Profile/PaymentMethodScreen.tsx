import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useProfileStore } from "../../store/useProfileStore";
import { PaymentMethod } from "../../store/useCheckoutStore";

const PaymentMethodScreen = () => {
    const navigation = useNavigation();
    const { savedPayment, savePayment } = useProfileStore();

    const [cardNumber, setCardNumber] = useState("");
    const [holder, setHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    useEffect(() => {
        if (savedPayment) {
            setHolder(savedPayment.cardHolder || "");
            // We can't recover full number from last4, but we can show placeholder
            setCardNumber(savedPayment.last4 ? `**** **** **** ${savedPayment.last4}` : "");
        }
    }, [savedPayment]);

    const onSave = () => {
        // Mock validation
        if (cardNumber.length < 4) {
            Alert.alert("Error", "Invalid card number");
            return;
        }

        const method: PaymentMethod = {
            method: 'visa', // Mock
            cardHolder: holder,
            last4: cardNumber.slice(-4),
        };

        savePayment(method);
        Alert.alert("Success", "Payment method saved");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={styles.cardPreview}>
                    <Text style={styles.cardTitle}>VISA</Text>
                    <Text style={styles.cardNum}>{cardNumber || "**** **** **** ****"}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={styles.cardMeta}>{holder || "NAME"}</Text>
                        <Text style={styles.cardMeta}>{expiry || "MM/YY"}</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Card Holder Name</Text>
                    <TextInput style={styles.input} value={holder} onChangeText={setHolder} placeholder="Full Name" />

                    <Text style={styles.label}>Card Number</Text>
                    <TextInput style={styles.input} value={cardNumber} onChangeText={setCardNumber} placeholder="0000 0000 0000 0000" keyboardType="numeric" />

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Expiration</Text>
                            <TextInput style={styles.input} value={expiry} onChangeText={setExpiry} placeholder="MM/YY" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput style={styles.input} value={cvv} onChangeText={setCvv} placeholder="123" keyboardType="numeric" secureTextEntry />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btn} onPress={onSave}>
                    <Text style={styles.btnText}>Save Card</Text>
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

    cardPreview: {
        backgroundColor: '#1E293B', borderRadius: 16, padding: 24, marginBottom: 30, height: 180, justifyContent: 'space-between'
    },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', fontStyle: 'italic' },
    cardNum: { color: '#fff', fontSize: 22, letterSpacing: 2 },
    cardMeta: { color: '#CBD5E1', fontSize: 14, fontWeight: '600' },

    form: {},
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151', marginTop: 12 },
    input: {
        height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
        paddingHorizontal: 16, fontSize: 15, color: '#111'
    },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
    btn: { backgroundColor: '#111', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default PaymentMethodScreen;
