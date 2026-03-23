import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Dimensions, Platform, StatusBar } from "react-native";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useShopStore } from '../../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 45) / 2;

const SaleScreen = () => {
    const navigation = useNavigation<any>();
    const { getSaleProducts, activeFilters } = useShopStore();
    const { colors, isDark } = useTheme();
    const styles = getStyles(colors, isDark);

    // In a real app we might combine getSaleProducts with getFilteredProducts logic
    // For now, let's just get sale products.
    const products = getSaleProducts();

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity style={[styles.favIcon, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]}>
                    <Feather name="heart" size={16} color={colors.text} />
                </TouchableOpacity>
                {item.discountPercent && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>-{item.discountPercent}%</Text>
                    </View>
                )}
            </View>

            <View style={styles.colorRow}>
                {item.colors.slice(0, 3).map((c, i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: c }]} />
                ))}
                {item.colors.length > 3 && <Text style={styles.plusText}>+</Text>}
            </View>

            <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>{item.title}</Text>

            <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.text }]}>${item.price.toFixed(2)}</Text>
                {item.oldPrice && <Text style={[styles.oldPrice, { color: colors.textSecondary }]}>${item.oldPrice.toFixed(2)}</Text>}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Products/Sale</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Filter')} style={{ marginRight: 15 }}>
                        <Feather name="filter" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Ionicons name="search" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 15 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ color: colors.text }}>No sale items found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    headerIcons: { flexDirection: 'row' },
    center: { alignItems: 'center', marginTop: 50 },

    card: { width: COLUMN_WIDTH, marginBottom: 20 },
    imageContainer: { position: 'relative', marginBottom: 10 },
    image: { width: '100%', height: 200, borderRadius: 10, backgroundColor: colors.iconBg },
    favIcon: {
        position: 'absolute', top: 10, right: 10,
        width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2
    },
    badge: {
        position: 'absolute', top: 10, left: 10, backgroundColor: '#FF4D4D',
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    colorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5, borderWidth: 1, borderColor: colors.border },
    plusText: { fontSize: 10, color: colors.textSecondary },

    title: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: colors.text },
    priceRow: { flexDirection: 'row', alignItems: 'center' },
    price: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginRight: 8 },
    oldPrice: { fontSize: 12, color: colors.textSecondary, textDecorationLine: 'line-through' }
});

export default SaleScreen;
