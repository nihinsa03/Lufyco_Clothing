import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Image, Platform, StatusBar } from "react-native";
import { Feather, Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type Notification = {
    id: string;
    type: 'order' | 'promo' | 'wishlist' | 'delivery' | 'alert' | 'welcome';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    iconColor: string;
    iconBg: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'promo',
        title: '🔥 Flash Sale is Live!',
        message: 'Get up to 50% off on all summer collections. Hurry, offer ends tonight!',
        time: '2 min ago',
        read: false,
        icon: 'percent',
        iconColor: '#fff',
        iconBg: '#EF4444',
    },
    {
        id: '2',
        type: 'order',
        title: 'Order Shipped! 📦',
        message: 'Your order #LF2847 has been shipped and is on its way. Track your delivery now.',
        time: '15 min ago',
        read: false,
        icon: 'truck',
        iconColor: '#fff',
        iconBg: '#3B82F6',
    },
    {
        id: '3',
        type: 'wishlist',
        title: 'Price Drop Alert! 💰',
        message: 'The "Classic Denim Jacket" in your wishlist just dropped from LKR 12,000 to LKR 8,400!',
        time: '1 hour ago',
        read: false,
        icon: 'heart',
        iconColor: '#fff',
        iconBg: '#EC4899',
    },
    {
        id: '4',
        type: 'promo',
        title: 'New Arrivals Just Dropped ✨',
        message: 'Fresh styles for the season are here. Be the first to explore our latest collection.',
        time: '3 hours ago',
        read: true,
        icon: 'star',
        iconColor: '#fff',
        iconBg: '#F59E0B',
    },
    {
        id: '5',
        type: 'delivery',
        title: 'Order Delivered ✅',
        message: 'Your order #LF2790 has been delivered successfully. Rate your experience!',
        time: '5 hours ago',
        read: true,
        icon: 'check-circle',
        iconColor: '#fff',
        iconBg: '#10B981',
    },
    {
        id: '6',
        type: 'alert',
        title: 'Your Cart is Waiting 🛒',
        message: 'You left 3 items in your cart. Complete your purchase before they sell out!',
        time: 'Yesterday',
        read: true,
        icon: 'shopping-cart',
        iconColor: '#fff',
        iconBg: '#8B5CF6',
    },
    {
        id: '7',
        type: 'promo',
        title: 'Weekend Special 🎉',
        message: 'Enjoy free shipping on all orders above LKR 5,000 this weekend only!',
        time: 'Yesterday',
        read: true,
        icon: 'gift',
        iconColor: '#fff',
        iconBg: '#06B6D4',
    },
    {
        id: '8',
        type: 'welcome',
        title: 'Welcome to Fashion! 👋',
        message: 'Thanks for joining us. Explore trending styles and get personalized recommendations.',
        time: '2 days ago',
        read: true,
        icon: 'user-check',
        iconColor: '#fff',
        iconBg: '#6366F1',
    },
];

const NotificationsScreen = ({ navigation }: Props) => {
    const { colors, isDark } = useTheme();
    const styles = getStyles(colors, isDark);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[
                styles.notificationCard, 
                !item.read && styles.unreadCard
            ]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon as any} size={18} color={item.iconColor} />
            </View>
            <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                    <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                    {item.message}
                </Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
                        <Text style={[styles.markAllText, unreadCount === 0 && { opacity: 0.3 }]}>
                            Mark all read
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <View style={styles.unreadBanner}>
                        <Feather name="bell" size={16} color="#3B82F6" />
                        <Text style={styles.unreadBannerText}>
                            {`You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
                        </Text>
                    </View>
                )}

                {/* Notifications List */}
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotification}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Feather name="bell-off" size={48} color={colors.textMuted} />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                            <Text style={styles.emptySubtext}>We'll notify you about deals and order updates!</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    container: { flex: 1, backgroundColor: colors.background , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
    markAllText: { fontSize: 13, color: '#3B82F6', fontWeight: '600' },

    unreadBanner: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
        paddingHorizontal: 16, paddingVertical: 10, marginHorizontal: 16, marginTop: 12,
        borderRadius: 10,
    },
    unreadBannerText: { fontSize: 13, color: '#3B82F6', fontWeight: '500', marginLeft: 8 },

    listContainer: { padding: 16, paddingBottom: 40 },

    notificationCard: {
        flexDirection: 'row', padding: 14, borderRadius: 14, backgroundColor: colors.card
    },
    unreadCard: { backgroundColor: isDark ? '#1A1A1A' : '#FAFBFF' },

    iconContainer: {
        width: 42, height: 42, borderRadius: 12, justifyContent: 'center',
        alignItems: 'center', marginRight: 12,
    },

    notificationContent: { flex: 1 },
    notificationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    notificationTitle: { fontSize: 14, flex: 1, marginRight: 8, color: colors.text },
    unreadTitle: { fontWeight: '700' },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6' },

    notificationMessage: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginBottom: 6 },
    notificationTime: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },

    separator: { height: 1, marginVertical: 4, backgroundColor: colors.border },

    emptyState: { alignItems: 'center', paddingTop: 100 },
    emptyText: { fontSize: 16, fontWeight: '600', marginTop: 16, color: colors.text },
    emptySubtext: { fontSize: 13, marginTop: 6, color: colors.textMuted },
});

export default NotificationsScreen;
