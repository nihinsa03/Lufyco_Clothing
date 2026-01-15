import React from "react";
import {
    SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    };

    const menuItems = [
        { label: "Mailing Address", icon: "map-pin", action: () => Alert.alert("Coming Soon") },
        { label: "Payment Method", icon: "credit-card", action: () => Alert.alert("Coming Soon") },
        { label: "Order History", icon: "clock", action: () => navigation.navigate("OrderHistory") },
        { label: "Privacy", icon: "lock", action: () => Alert.alert("Coming Soon") }, // navigation.navigate("Privacy")
        { label: "Terms & Conditions", icon: "file-text", action: () => Alert.alert("Coming Soon") }, // navigation.navigate("Terms")
        { label: "Change Password", icon: "key", action: () => navigation.navigate("ChangePassword") }, // approximate reuse
        { label: "Sign Out", icon: "log-out", action: handleLogout, color: "#EF4444" },
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
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
                        <Text style={styles.userEmail}>{user?.email || "Please login"}</Text>
                    </View>
                    <TouchableOpacity style={{ marginLeft: "auto" }}>
                        <Feather name="edit-2" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Menu */}
                <View style={styles.menu}>
                    {menuItems.map((m, i) => (
                        <TouchableOpacity key={i} style={styles.menuItem} onPress={m.action}>
                            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
                                <Feather name={m.icon as any} size={20} color={m.color || "#111"} />
                            </View>
                            <Text style={[styles.menuLabel, m.color ? { color: m.color } : {}]}>{m.label}</Text>
                            <Feather name="chevron-right" size={20} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { padding: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 24, fontWeight: "800" },

    userCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 30, elevation: 2 },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#eee" },
    userName: { fontSize: 18, fontWeight: "700" },
    userEmail: { fontSize: 14, color: "#6B7280" },

    menu: {},
    menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 16 },
    menuLabel: { flex: 1, fontSize: 16, fontWeight: "600" },
});

export default ProfileScreen;
