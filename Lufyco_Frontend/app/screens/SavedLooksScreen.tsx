import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Platform, StatusBar, Alert } from "react-native";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api'; // your axios instance or API helper
import { useAuthStore } from '../store/useAuthStore';

type SavedLook = {
    id: string;
    mood: string;
    weather: string;
    occasion: string;
    items: any[]; // product objects
    date: string;
};

const SavedLooksScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [looks, setLooks] = useState<SavedLook[]>([]);
    const userId = useAuthStore.getState().user?.id;

    const loadLooks = async () => {
        try {
            const response = await api.get(`/ai/saved-my-looks?userId=${userId}`);
            const data = response.data || [];
                    const mapped = data.map(item => ({
            ...item,
            id: item._id, // <--- important
        }));
            setLooks(mapped);
        } catch (error) {
            console.error("Failed to fetch saved looks:", error);
            Alert.alert("Error", "Failed to load saved looks from server.");
        }
    };

    const deleteLook = async (id: string) => {
        console.log("Deleting look with ID:", id);
        try {
            await api.delete(`/ai/saved-my-looks/${id}`);
            setLooks(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            console.error("Failed to delete look:", error);
            Alert.alert("Error", "Failed to delete the look.");
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadLooks);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }: { item: SavedLook }) => (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{item.occasion} – {item.mood}</Text>
                <TouchableOpacity onPress={() => deleteLook(item.id)}>
                    <Feather name="trash-2" size={20} color="#c00" />
                </TouchableOpacity>
            </View>
            <Text style={styles.sub}>Weather: {item.weather}</Text>
            <View style={styles.row}>
                {item.items.map((it, idx) => (
                    <Image
                        key={idx}
                        source={it.image && it.image.startsWith('http') ? { uri: it.image } : { uri: it.image }}
                        style={styles.thumb}
                    />
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Looks</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={looks}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>No saved looks yet.</Text>}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

export default SavedLooksScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    list: { padding: 16 },
    card: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, marginBottom: 12 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: '800' },
    sub: { color: '#555', marginBottom: 8 },
    row: { flexDirection: 'row', flexWrap: 'wrap' },
    thumb: { width: 80, height: 80, margin: 4, borderRadius: 8 },
    empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});