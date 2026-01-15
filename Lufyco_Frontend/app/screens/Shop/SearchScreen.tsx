import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useShopStore } from '../../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const SearchScreen = () => {
    const { products, setFilter } = useShopStore();
    const navigation = useNavigation<any>();
    const [term, setTerm] = useState('');

    const results = term.length > 0
        ? products.filter(p => p.title.toLowerCase().includes(term.toLowerCase()) || p.tags.some(t => t.includes(term.toLowerCase())))
        : [];

    const handlePress = (item: any) => {
        navigation.navigate('ProductDetails', { id: item.id, product: item });
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#111" />
                </TouchableOpacity>
                <View style={styles.inputBox}>
                    <Feather name="search" size={18} color="#666" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search products..."
                        autoFocus
                        value={term}
                        onChangeText={setTerm}
                    />
                    {term.length > 0 && (
                        <TouchableOpacity onPress={() => setTerm('')}>
                            <Feather name="x" size={18} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={results}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    term.length > 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No results found</Text>
                    ) : (
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            {/* Mock recent */}
                            {['Shirt', 'Shoes', 'Black Dress'].map((t, i) => (
                                <TouchableOpacity key={i} style={styles.recentItem} onPress={() => setTerm(t)}>
                                    <Feather name="clock" size={16} color="#888" />
                                    <Text style={{ marginLeft: 10, color: '#333' }}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                }
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.row} onPress={() => handlePress(item)}>
                        <Image
                            source={typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0]}
                            style={styles.thumb}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.title}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 },
    inputBox: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
        height: 44, borderRadius: 10, paddingHorizontal: 12
    },
    input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#111' },

    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 12 },
    recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6' },

    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#fff' },
    thumb: { width: 50, height: 50, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
    name: { fontSize: 14, fontWeight: '600', color: '#111' },
    price: { fontSize: 13, color: '#666' },
});

export default SearchScreen;
