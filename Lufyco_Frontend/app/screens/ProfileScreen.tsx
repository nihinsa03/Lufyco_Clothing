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
import { useTheme } from "../context/ThemeContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

const ProfileScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { logout, user } = useAuthStore();
    const { isDark, toggleTheme, colors } = useTheme();

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
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 5 }}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* User Info Card */}
                <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Image source={require("../../assets/images/clothing.png")} style={styles.avatar} />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <Text style={[styles.userName, { color: colors.text }]}>{user?.name || user?.email?.split('@')[0] || "Guest"}</Text>
                        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || "guest@example.com"}</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <Feather name="edit-2" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Menu Sections */}
                {menuItems.map((sec, i) => (
                    <View key={i} style={styles.section}>
                        {sec.items.map((item, idx) => (
                            <TouchableOpacity key={idx} style={styles.menuItem} onPress={item.action}>
                                <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                                    <Feather name={item.icon as any} size={18} color={colors.text} />
                                </View>
                                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                <Feather name="chevron-right" size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Account Management */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ChangePassword")}>
                        <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                            <Feather name="key" size={18} color={colors.text} />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Change Password</Text>
                        <Feather name="chevron-right" size={18} color={colors.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.menuItem}>
                        <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
                            <Feather name="moon" size={18} color={colors.text} />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Dark Theme</Text>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#E5E7EB", true: "#6366F1" }}
                            thumbColor={isDark ? "#fff" : "#f4f3f4"}
                        />
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
    safe: { flex: 1 },
    header: { padding: 20, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: "800", marginLeft: 10 },

    userCard: {
        flexDirection: "row", alignItems: "center",
        padding: 16, borderRadius: 16, marginBottom: 24,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
        borderWidth: 1,
    },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F3F4F6" },
    userName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
    userEmail: { fontSize: 14 },
    editBtn: { padding: 8 },

    section: { marginBottom: 24 },
    menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
    menuLabel: { flex: 1, fontSize: 16, fontWeight: "600" },
});

export default ProfileScreen;
