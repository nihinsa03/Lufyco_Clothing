import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.sectionHeader}>1. Information Collection</Text>
                <Text style={styles.paragraph}>
                    We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us. This information may include your name, email address, phone number, shipping address, and payment method details.
                </Text>

                <Text style={styles.sectionHeader}>2. How We Use Your Information</Text>
                <Text style={styles.paragraph}>
                    We use the information we collect to provide, maintain, and improve our services, including to process transactions, manage your account, send you related information such as confirmations and invoices, and respond to your comments and questions.
                </Text>

                <Text style={styles.sectionHeader}>3. Information Sharing</Text>
                <Text style={styles.paragraph}>
                    We do not share your personal information with third parties except as described in this policy, such as with vendors who need access to such information to carry out work on our behalf (e.g., payment processors, shipping carriers).
                </Text>

                <Text style={styles.sectionHeader}>4. Security</Text>
                <Text style={styles.paragraph}>
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                </Text>


                <Text style={styles.paragraph}>
                    Last Updated: January 15, 2026
                </Text>
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

    sectionHeader: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 8, color: '#111' },
    paragraph: { fontSize: 14, lineHeight: 22, color: '#4B5563', marginBottom: 10 },
});

export default PrivacyPolicyScreen;
