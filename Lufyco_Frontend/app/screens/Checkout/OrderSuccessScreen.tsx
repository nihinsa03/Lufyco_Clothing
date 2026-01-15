import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "OrderSuccess">;

const OrderSuccessScreen = () => {
    const navigation = useNavigation<NavProp>();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../../../assets/images/bag.png')} // Reuse bag or success image
                        style={{ width: 80, height: 80, tintColor: '#2563EB' }}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Order Placed Successfully!</Text>
                <Text style={styles.sub}>
                    Thank you for your purchase. Your order is being processed and will be shipped soon.
                </Text>

                <View style={styles.btnGroup}>
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate("Home")} // Go to Home
                    >
                        <Text style={styles.primaryText}>Continue Shopping</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => navigation.navigate("OrderHistory")}
                    >
                        <Text style={styles.secondaryText}>Track Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
    iconContainer: {
        width: 120, height: 120, borderRadius: 60, backgroundColor: '#EFF6FF',
        alignItems: 'center', justifyContent: 'center', marginBottom: 24
    },
    title: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: '#111', marginBottom: 12 },
    sub: { fontSize: 15, textAlign: 'center', color: '#666', lineHeight: 22, marginBottom: 40 },

    btnGroup: { width: '100%' },
    primaryBtn: {
        backgroundColor: '#111', height: 56, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center', marginBottom: 16
    },
    primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    secondaryBtn: {
        backgroundColor: '#fff', height: 56, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#E5E7EB'
    },
    secondaryText: { color: '#111', fontWeight: '700', fontSize: 16 },
});

export default OrderSuccessScreen;
