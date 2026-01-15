import React, { useState } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCheckoutStore, Address } from "../../store/useCheckoutStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "CheckoutShipping">;

const CheckoutShippingScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { shippingAddress, setShippingAddress } = useCheckoutStore();

    const [form, setForm] = useState<Address>({
        fullName: shippingAddress?.fullName || "",
        phone: shippingAddress?.phone || "",
        country: shippingAddress?.country || "United States",
        city: shippingAddress?.city || "",
        addressLine: shippingAddress?.addressLine || "",
        postalCode: shippingAddress?.postalCode || "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

    const validate = () => {
        let valid = true;
        let newErrors: Partial<Record<keyof Address, string>> = {};

        if (!form.fullName) { newErrors.fullName = "Required"; valid = false; }
        if (!form.phone) { newErrors.phone = "Required"; valid = false; }
        if (!form.city) { newErrors.city = "Required"; valid = false; }
        if (!form.addressLine) { newErrors.addressLine = "Required"; valid = false; }
        if (!form.postalCode) { newErrors.postalCode = "Required"; valid = false; }

        setErrors(newErrors);
        return valid;
    };

    const onSave = () => {
        if (validate()) {
            setShippingAddress(form);
            navigation.navigate("CheckoutPayment");
        } else {
            Alert.alert("Error", "Please fill in all required fields.");
        }
    };

    const renderInput = (label: string, field: keyof Address, placeholder: string, keyboardType: any = 'default') => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label} <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
                style={[styles.input, errors[field] && styles.inputError]}
                placeholder={placeholder}
                value={form[field]}
                onChangeText={(t) => setForm({ ...form, [field]: t })}
                keyboardType={keyboardType}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
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
                    <View style={[styles.stepCircle, styles.stepActive]}>
                        <Feather name="map-pin" size={16} color="#fff" />
                    </View>
                    <Text style={[styles.stepText, styles.stepTextActive]}>Shipping</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.stepItem}>
                    <View style={styles.stepCircle}>
                        <Feather name="credit-card" size={16} color="#999" />
                    </View>
                    <Text style={styles.stepText}>Payment</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.stepItem}>
                    <View style={styles.stepCircle}>
                        <Feather name="check" size={16} color="#999" />
                    </View>
                    <Text style={styles.stepText}>Review</Text>
                </View>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                    {renderInput("Full Name", "fullName", "Ex: John Doe")}
                    {renderInput("Phone Number", "phone", "Ex: +1 234 567 890", "phone-pad")}

                    {/* Country Placeholder (Select) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Country</Text>
                        <View style={[styles.input, { justifyContent: 'center', backgroundColor: '#F9FAFB' }]}>
                            <Text>{form.country}</Text>
                        </View>
                    </View>

                    {renderInput("State / City", "city", "Ex: New York")}
                    {renderInput("Street Address", "addressLine", "Ex: 123 Main St")}
                    {renderInput("Postal Code", "postalCode", "Ex: 10001", "numeric")}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Button */}
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

    // Stepper
    stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
    stepItem: { alignItems: 'center' },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    stepActive: { backgroundColor: '#2563EB' },
    stepText: { fontSize: 12, color: '#999', fontWeight: '500' },
    stepTextActive: { color: '#2563EB', fontWeight: '700' },
    line: { width: 40, height: 2, backgroundColor: '#F3F4F6', marginBottom: 16, marginHorizontal: 8 },

    // Form
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#374151' },
    input: {
        height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
        paddingHorizontal: 16, fontSize: 15, color: '#111'
    },
    inputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
    btn: { backgroundColor: '#111', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CheckoutShippingScreen;
