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
    KeyboardAvoidingView,
    Platform,
    ToastAndroid
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useProfileStore } from "../../store/useProfileStore";
import { Address } from "../../store/useCheckoutStore"; // Reuse type

const ShippingAddressScreen = () => {
    const navigation = useNavigation();
    const { savedAddress, saveAddress } = useProfileStore();

    const [form, setForm] = useState<Address>({
        fullName: "",
        phone: "",
        country: "United States",
        city: "",
        addressLine: "",
        postalCode: "",
    });

    useEffect(() => {
        if (savedAddress) {
            setForm(savedAddress);
        }
    }, [savedAddress]);

    const onSave = () => {
        if (!form.fullName || !form.addressLine) {
            Alert.alert("Required", "Please fill in the required fields.");
            return;
        }
        saveAddress(form);
        if (Platform.OS === 'android') {
            ToastAndroid.show("Address Saved", ToastAndroid.SHORT);
        } else {
            Alert.alert("Success", "Address saved successfully");
        }
        navigation.goBack();
    };

    const renderInput = (label: string, field: keyof Address, placeholder: string) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={form[field]}
                onChangeText={(t) => setForm({ ...form, [field]: t })}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Shipping Address</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {renderInput("Full Name", "fullName", "Ex: Jane Doe")}
                    {renderInput("Phone Number", "phone", "Ex: +1 234 ...")}
                    {renderInput("City", "city", "Ex: New York")}
                    {renderInput("Street Address", "addressLine", "Ex: 123 Main St")}
                    {renderInput("Postal Code", "postalCode", "Ex: 10001")}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Country</Text>
                        <View style={[styles.input, { justifyContent: 'center', backgroundColor: '#F9FAFB' }]}>
                            <Text style={{ color: '#111' }}>{form.country}</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btn} onPress={onSave}>
                    <Text style={styles.btnText}>Save Address</Text>
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

    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
    input: {
        height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
        paddingHorizontal: 16, fontSize: 15, color: '#111'
    },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
    btn: { backgroundColor: '#111', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default ShippingAddressScreen;
