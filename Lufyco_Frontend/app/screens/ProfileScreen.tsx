import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Switch,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

const ProfileScreen = () => {
    const navigation = useNavigation<NavProp>();
    const logout = useAuthStore((state) => state.logout);
    const { user } = useProfileStore();

    const menuItems = [
        {
            section: "Account",
            items: [
                { label: "Mailing Address", icon: "map-pin", action: () => navigation.navigate("ShippingAddress") },
                { label: "Payment Method", icon: "credit-card", action: () => navigation.navigate("PaymentMethod") },
            ]
        },
        {
            section: "History",
            items: [
                { label: "Order History", icon: "clock", action: () => navigation.navigate("OrderHistory") },
                // { label: "Track Order", icon: "box", action: () => navigation.navigate("OrderHistory") },
            ]
        },
        {
            section: "Support",
            items: [
                { label: "Privacy Policy", icon: "lock", action: () => navigation.navigate("PrivacyPolicy") },
                { label: "Terms & Conditions", icon: "file-text", action: () => navigation.navigate("TermsConditions") },
                { label: "FAQ", icon: "help-circle", action: () => navigation.navigate("FAQ") },
            ]
        },
    ];

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* User Info Card */}
                <View style={styles.userCard}>
                    <Image source={require("../../assets/images/clothing.png")} style={styles.avatar} />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
                        <Text style={styles.userEmail}>{user?.email || "guest@example.com"}</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <Feather name="edit-2" size={16} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Menu Sections */}
                {menuItems.map((sec, i) => (
                    <View key={i} style={styles.section}>
                        {sec.items.map((item, idx) => (
                            <TouchableOpacity key={idx} style={styles.menuItem} onPress={item.action}>
                                <View style={[styles.iconBox, { backgroundColor: "#F9FAFB" }]}>
                                    <Feather name={item.icon as any} size={18} color="#111" />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <Feather name="chevron-right" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Account Management */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ChangePassword")}>
                        <View style={[styles.iconBox, { backgroundColor: "#F9FAFB" }]}>
                            <Feather name="key" size={18} color="#111" />
                        </View>
                        <Text style={styles.menuLabel}>Change Password</Text>
                        <Feather name="chevron-right" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <View style={[styles.iconBox, { backgroundColor: "#F9FAFB" }]}>
                            <Feather name="moon" size={18} color="#111" />
                        </View>
                        <Text style={styles.menuLabel}>Dark Theme</Text>
                        <Switch value={false} onValueChange={() => { }} trackColor={{ false: "#E5E7EB", true: "#111" }} />
                    </View>

                    <TouchableOpacity style={styles.menuItem} onPress={logout}>
                        <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
                            <Feather name="log-out" size={18} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { padding: 20, paddingBottom: 10, backgroundColor: '#fff' },
    headerTitle: { fontSize: 28, fontWeight: "800", color: '#111' },

    userCard: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
        padding: 16, borderRadius: 16, marginBottom: 24,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
        borderWidth: 1, borderColor: '#F3F4F6'
    },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F3F4F6" },
    userName: { fontSize: 18, fontWeight: "700", color: '#111', marginBottom: 4 },
    userEmail: { fontSize: 14, color: "#6B7280" },
    editBtn: { padding: 8 },

    section: { marginBottom: 24 },
    menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
    menuLabel: { flex: 1, fontSize: 16, fontWeight: "600", color: '#374151' },
});

export default ProfileScreen;
