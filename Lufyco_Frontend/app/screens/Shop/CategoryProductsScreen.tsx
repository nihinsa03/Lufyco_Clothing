import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useShopStore } from '../../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';

const CategoryProductsScreen = () => {
    const { getFilteredProducts, activeFilters, setFilter } = useShopStore();
    const navigation = useNavigation<any>();

    const [products, setProducts] = useState(getFilteredProducts());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setProducts(getFilteredProducts());
    }, [activeFilters]);

    const handleProductPress = (product: any) => {
        navigation.navigate('ProductDetails', { id: product.id, product });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {activeFilters.categoryId ? 'Shop Category' : 'Shop'}
                </Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Feather name="search" size={22} color="#111" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
                        <Feather name="sliders" size={22} color="#111" />
                    </TouchableOpacity>
                </View>
            </View>

            {activeFilters.query ? (
                <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                    <Text style={{ color: '#666' }}>Results for "{activeFilters.query}"</Text>
                </View>
            ) : null}

            <FlatList
                data={products}
                keyExtractor={item => item.id}
                numColumns={2}
                onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }}
                refreshing={refreshing}
                contentContainerStyle={{ padding: 16 }}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ fontSize: 16, color: '#888' }}>No products found</Text>
                        <TouchableOpacity onPress={() => setFilter({ query: '', categoryId: undefined })}>
                            <Text style={{ color: '#000', marginTop: 10, fontWeight: '700' }}>Clear Filters</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item)}>
                        <View style={styles.imgBox}>
                            <Image
                                source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]}
                                style={styles.img}
                                resizeMode="cover"
                            />
                            <TouchableOpacity style={styles.heartBtn}>
                                <Feather name="heart" size={16} color="#111" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.prodTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center', borderBottomWidth: 1, borderColor: '#f3f3f3' },
    title: { fontSize: 18, fontWeight: '700', color: '#111' },

    card: { width: '48%', marginBottom: 20 },
    imgBox: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#F3F4F6', marginBottom: 10, overflow: 'hidden' },
    img: { width: '100%', height: '100%' },
    heartBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', padding: 6, borderRadius: 20 },

    prodTitle: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 4 },
    price: { fontSize: 14, fontWeight: '700', color: '#111' },
});

export default CategoryProductsScreen;
