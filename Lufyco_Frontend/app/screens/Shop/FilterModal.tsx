import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useShopStore, FilterState } from '../../store/useShopStore';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const FilterModal = () => {
    const navigation = useNavigation();
    const { activeFilters, toggleFilter, resetFilters, setFilter } = useShopStore();

    const handleApply = () => {
        navigation.goBack();
    };

    const handleReset = () => {
        resetFilters();
        navigation.goBack();
    };

    const CheckboxRow = ({ label, field }: { label: string, field: keyof FilterState }) => {
        const isChecked = activeFilters[field] as boolean;

        return (
            <TouchableOpacity
                style={styles.row}
                onPress={() => toggleFilter(field)}
                activeOpacity={0.7}
            >
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Feather name="check" size={14} color="#fff" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Filter</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <CheckboxRow label="New Arrivals" field="newArrivals" />
                <CheckboxRow label="Popular this week" field="popularThisWeek" />
                <CheckboxRow label="Price dropping" field="priceDropping" />
                <CheckboxRow label="Discount" field="discountOnly" />
                <CheckboxRow label="Popularity" field="popularity" />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        height: height * 0.5, // Half screen typical for bottom sheet
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    resetText: { fontSize: 14, color: '#666' },

    content: { paddingHorizontal: 20 },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    label: { fontSize: 16, color: '#333' },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#000',
        borderColor: '#000',
    },

    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    applyBtn: {
        backgroundColor: '#000',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default FilterModal;
