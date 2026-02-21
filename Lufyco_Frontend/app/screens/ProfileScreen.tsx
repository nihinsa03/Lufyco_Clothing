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
    StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../context/ThemeContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

const ProfileScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { logout, user } = useAuthStore();
    const { isDark, toggleTheme, colors } = useTheme();

    const personalItems = [
        { label: "Shipping Address", icon: "map-pin", action: () => navigation.navigate("ShippingAddress") },
        { label: "Payment Method", icon: "credit-card", action: () => navigation.navigate("PaymentMethod") },
        { label: "Order History", icon: "clock", action: () => navigation.navigate("OrderHistory") },
    ];

    const supportItems = [
        { label: "Privacy Policy", icon: "shield", action: () => navigation.navigate("PrivacyPolicy") },
        { label: "Terms & Conditions", icon: "file-text", action: () => navigation.navigate("TermsConditions") },
        { label: "FAQs", icon: "help-circle", action: () => navigation.navigate("FAQ") },
    ];

    const renderMenuItem = (item: any, idx: number) => (
        <TouchableOpacity key={idx} style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={item.action}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? colors.iconBg : '#F0F4FF' }]}>
                <Feather name={item.icon as any} size={18} color={isDark ? colors.text : '#4A90D9'} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            {/* Blue Gradient Header */}
            <View style={styles.headerGradient}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.profileRow}>
                    <Image source={require("../../assets/images/clothing.png")} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{user?.name || user?.email?.split('@')[0] || "Guest"}</Text>
                        <Text style={styles.userEmail}>{user?.email || "guest@example.com"}</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <Feather name="refresh-cw" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Personal Information */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Personal Information</Text>
                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {personalItems.map(renderMenuItem)}
                </View>

                {/* Support & Information */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Support & Information</Text>
                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {supportItems.map(renderMenuItem)}
                </View>

                {/* Account Management */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account Management</Text>
                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => navigation.navigate("ChangePassword")}>
                        <View style={[styles.iconBox, { backgroundColor: isDark ? colors.iconBg : '#F0F4FF' }]}>
                            <Feather name="lock" size={18} color={isDark ? colors.text : '#4A90D9'} />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Change Password</Text>
                        <Feather name="chevron-right" size={18} color={colors.textMuted} />
                    </TouchableOpacity>

                    <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                        <View style={[styles.iconBox, { backgroundColor: isDark ? colors.iconBg : '#F0F4FF' }]}>
                            <Feather name="moon" size={18} color={isDark ? colors.text : '#4A90D9'} />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text }]}>Dark Theme</Text>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#E5E7EB", true: "#4A90D9" }}
                            thumbColor={isDark ? "#fff" : "#f4f3f4"}
                        />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: isDark ? '#2A1515' : '#FEF2F2', borderColor: isDark ? '#5C2020' : '#FECACA' }]}
                    onPress={logout}
                >
                    <Feather name="log-out" size={18} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1 },

    headerGradient: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 25,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        backgroundColor: '#4A90D9',
    },
    headerRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },

    profileRow: {
        flexDirection: 'row', alignItems: 'center',
    },
    avatar: {
        width: 56, height: 56, borderRadius: 28,
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
        backgroundColor: '#fff',
    },
    profileInfo: { flex: 1, marginLeft: 14 },
    userName: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 2 },
    userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
    editBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
    },

    scrollContent: { padding: 16 },

    sectionTitle: {
        fontSize: 12, fontWeight: '600', textTransform: 'uppercase',
        letterSpacing: 1, marginTop: 20, marginBottom: 10, marginLeft: 4,
    },
    sectionCard: {
        borderRadius: 16, borderWidth: 1,
        overflow: 'hidden',
    },

    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1,
    },
    iconBox: {
        width: 36, height: 36, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },

    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, borderRadius: 14, marginTop: 24,
        borderWidth: 1,
    },
    logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444', marginLeft: 8 },
});

export default ProfileScreen;
