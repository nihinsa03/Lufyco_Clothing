import React, { useState } from "react";
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
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "TrackOrder">;

const TrackOrderScreen = () => {
    const navigation = useNavigation<NavProp>();
    const [currentStep, setCurrentStep] = useState(2); // Mock order state

    const steps = [
        { title: "Order Placed", date: "Aug 20, 10:00 AM", completed: true },
        { title: "Processing", date: "Aug 20, 12:30 PM", completed: true },
        { title: "Shipped", date: "Aug 21, 09:15 AM", completed: false },
        { title: "Delivered", date: "Expected Aug 23", completed: false },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.orderIdBox}>
                    <Text style={styles.orderIdText}>Order #102948</Text>
                    <Text style={styles.orderAmount}>$120.50</Text>
                </View>

                <View style={styles.timelineContainer}>
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const isActive = index === currentStep;
                        return (
                            <View key={index} style={styles.stepContainer}>
                                <View style={styles.indicatorContainer}>
                                    <View style={[styles.circle, step.completed ? styles.completedCircle : (isActive ? styles.activeCircle : styles.inactiveCircle)]}>
                                        {step.completed && <Feather name="check" size={12} color="#fff" />}
                                    </View>
                                    {!isLast && <View style={[styles.line, step.completed ? styles.completedLine : styles.inactiveLine]} />}
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={[styles.stepTitle, (step.completed || isActive) && styles.stepTitleActive]}>{step.title}</Text>
                                    <Text style={styles.stepDate}>{step.date}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.shippingInfo}>
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                    <Text style={styles.addressText}>John Doe</Text>
                    <Text style={styles.addressText}>123 Fashion Street</Text>
                    <Text style={styles.addressText}>New York, NY 10001</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#F9FAFB" },
    header: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#E5E7EB"
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
    content: { padding: 20 },
    orderIdBox: {
        backgroundColor: "#fff", padding: 16, borderRadius: 12, flexDirection: "row", justifyContent: "space-between",
        marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
    },
    orderIdText: { fontSize: 16, fontWeight: "700", color: "#111" },
    orderAmount: { fontSize: 16, fontWeight: "700", color: "#2563EB" },
    timelineContainer: {
        backgroundColor: "#fff", padding: 20, borderRadius: 12, marginBottom: 24,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
    },
    stepContainer: { flexDirection: "row", minHeight: 70 },
    indicatorContainer: { alignItems: "center", width: 30 },
    circle: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", zIndex: 2 },
    completedCircle: { backgroundColor: "#10B981" },
    activeCircle: { backgroundColor: "#3B82F6", borderWidth: 4, borderColor: "#DBEAFE" },
    inactiveCircle: { backgroundColor: "#E5E7EB" },
    line: { width: 2, flex: 1, marginVertical: -4, zIndex: 1 },
    completedLine: { backgroundColor: "#10B981" },
    inactiveLine: { backgroundColor: "#E5E7EB" },
    textContainer: { marginLeft: 16, paddingBottom: 30 },
    stepTitle: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
    stepTitleActive: { color: "#111" },
    stepDate: { fontSize: 13, color: "#9CA3AF", marginTop: 4 },
    shippingInfo: {
        backgroundColor: "#fff", padding: 20, borderRadius: 12,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
    },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12 },
    addressText: { fontSize: 14, color: "#4B5563", marginBottom: 4, lineHeight: 20 },
});

export default TrackOrderScreen;
