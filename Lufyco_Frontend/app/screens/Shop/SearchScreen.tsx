import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useShopStore } from '../../store/useShopStore';

const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const { recentSearches, addRecentSearch, clearRecentSearches, setQuery } = useShopStore();
    const [input, setInput] = useState('');

    const handleSearch = (term: string) => {
        if (!term.trim()) return;
        addRecentSearch(term);
        setQuery(term);
        // Instead of staying here, usually we go back to listing or show results here.
        // Requested behavior: "Typing updates results OR navigate back to ProductsScreen"
        // Let's navigate to ProductsScreen (or CategoryProducts matching prev nav) with query.
        // Assuming 'CategoryProducts' screen is our main listing.
        navigation.navigate('CategoryProducts');
    };

    const handleClear = () => {
        setInput('');
        setQuery('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.logo}>Fashion</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="x" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => handleSearch(input)}
                    autoFocus
                />
                {input.length > 0 ? (
                    <TouchableOpacity onPress={handleClear}>
                        <Feather name="x-circle" size={18} color="#999" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
                        <Ionicons name="options-outline" size={24} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            {recentSearches.length > 0 && (
                <View style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>RECENT SEARCH</Text>
                        <TouchableOpacity onPress={clearRecentSearches}>
                            <Feather name="trash-2" size={16} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={recentSearches}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.recentItem} onPress={() => handleSearch(item)}>
                                <Text style={styles.recentText}>{item}</Text>
                                <Feather name="arrow-up-right" size={20} color="#ccc" />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {/* Optional: Popular Search suggestions could go here */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 15
    },
    logo: { fontSize: 24, fontWeight: 'bold' },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
        marginBottom: 25
    },
    input: { flex: 1, marginLeft: 10, fontSize: 16 },

    recentSection: { paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontWeight: '600', color: '#888' },

    recentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9'
    },
    recentText: { fontSize: 16, color: '#333' }
});

export default SearchScreen;
