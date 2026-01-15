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

const TermsConditionsScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.paragraph}>
                    Please read these Terms and Conditions carefully before using our mobile application operated by Lufyco.
                </Text>

                <Text style={styles.sectionHeader}>1. Conditions of Use</Text>
                <Text style={styles.paragraph}>
                    By using this app, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to stop using the app accordingly.
                </Text>

                <Text style={styles.sectionHeader}>2. Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    Before you continue using our app, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
                </Text>

                <Text style={styles.sectionHeader}>3. Intellectual Property</Text>
                <Text style={styles.paragraph}>
                    You agree that all materials, products, and services provided on this app are the property of Lufyco, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property.
                </Text>

                <Text style={styles.sectionHeader}>4. User Accounts</Text>
                <Text style={styles.paragraph}>
                    As a user of this app, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information.
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

export default TermsConditionsScreen;
