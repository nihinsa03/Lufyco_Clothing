import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useShopStore } from '../../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const FilterModal = () => {
    const navigation = useNavigation();
    const { activeFilters, setFilter, resetFilters } = useShopStore();

    // Local state for temporary changes before 'Apply'
    const [priceRange, setPriceRange] = useState<number | undefined>(activeFilters.priceMax);
    const [sortBy, setSortBy] = useState(activeFilters.sortBy);

    const handleApply = () => {
        setFilter({
            priceMax: priceRange,
            sortBy
        });
        navigation.goBack();
    };

    const handleReset = () => {
        setPriceRange(undefined);
        setSortBy('popular');
        resetFilters();
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.title}>Filters</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="x" size={24} color="#111" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Sort By */}
                <Text style={styles.sectionTitle}>Sort By</Text>
                <View style={styles.chipRow}>
                    {[
                        { id: 'popular', label: 'Popular' },
                        { id: 'latest', label: 'Newest' },
                        { id: 'price_low', label: 'Price: Low to High' },
                        { id: 'price_high', label: 'Price: High to Low' }
                    ].map((opt: any) => (
                        <TouchableOpacity
                            key={opt.id}
                            style={[styles.chip, sortBy === opt.id && styles.chipActive]}
                            onPress={() => setSortBy(opt.id)}
                        >
                            <Text style={[styles.chipText, sortBy === opt.id && styles.chipTextActive]}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Price Range (Mock Slider) */}
                <Text style={styles.sectionTitle}>Max Price: ${priceRange || 200}</Text>
                <View style={styles.sliderMock}>
                    {[50, 100, 150, 200, 300].map(val => (
                        <TouchableOpacity key={val} onPress={() => setPriceRange(val)}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: priceRange === val ? '#111' : '#eee', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: priceRange === val ? '#fff' : '#111', fontSize: 10 }}>${val}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Colors (Mock) */}
                <Text style={styles.sectionTitle}>Colors</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    {['#000', '#fff', '#f00', '#00f'].map(c => (
                        <View key={c} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c, borderWidth: 1, borderColor: '#eee' }} />
                    ))}
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                    <Text style={styles.applyText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#fff" },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '700' },

    sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 12 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
    chipActive: { backgroundColor: '#111' },
    chipText: { fontSize: 14, color: '#111' },
    chipTextActive: { color: '#fff' },

    sliderMock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

    footer: { padding: 20, borderTopWidth: 1, borderColor: '#F3F4F6', flexDirection: 'row', gap: 16 },
    resetBtn: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
    resetText: { fontWeight: '700', color: '#111' },
    applyBtn: { flex: 2, padding: 16, borderRadius: 12, backgroundColor: '#111', alignItems: 'center' },
    applyText: { fontWeight: '700', color: '#fff' },
});

export default FilterModal;
