import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQScreen = () => {
    const navigation = useNavigation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "How to track my order?",
            a: "You can track your order status in the 'Order History' section. Once shipped, you will see a 'Track Order' button that provides real-time updates."
        },
        {
            q: "How to cancel an order?",
            a: "Orders can be cancelled within 1 hour of placement. Go to Order Details and click 'Cancel Order'. If the order has already been processed, please contact support."
        },
        {
            q: "Can I change my shipping address?",
            a: "You can update your default shipping address in Profile > Mailing Address. For active orders, please contact support immediately if you need to change the destination."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept Visa, MasterCard, PayPal, and Apple Pay. All transactions are secure and encrypted."
        },
        {
            q: "How do I return an item?",
            a: "To return an item, go to Order History, select the order, and tap 'Return'. You will be given a shipping label to print and attach to the package."
        },
    ];

    const toggle = (i: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {faqs.map((item, i) => (
                    <View key={i} style={styles.item}>
                        <TouchableOpacity style={styles.questionRow} onPress={() => toggle(i)}>
                            <Text style={styles.question}>{item.q}</Text>
                            <Feather name={openIndex === i ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                        </TouchableOpacity>
                        {openIndex === i && (
                            <View style={styles.answerBox}>
                                <Text style={styles.answer}>{item.a}</Text>
                            </View>
                        )}
                    </View>
                ))}
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

    item: { borderBottomWidth: 1, borderColor: '#F3F4F6', marginBottom: 10 },
    questionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
    question: { fontSize: 16, fontWeight: '600', color: '#111', flex: 1 },
    answerBox: { paddingBottom: 16 },
    answer: { fontSize: 14, color: '#666', lineHeight: 20 },
});

export default FAQScreen;
