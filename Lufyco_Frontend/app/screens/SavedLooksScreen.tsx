import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

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

    const loadLooks = async () => {
        const raw = await AsyncStorage.getItem('saved_looks');
        const parsed = raw ? JSON.parse(raw) : [];
        setLooks(parsed);
    };

    const deleteLook = async (id: string) => {
        const filtered = looks.filter(l => l.id !== id);
        await AsyncStorage.setItem('saved_looks', JSON.stringify(filtered));
        setLooks(filtered);
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
                        source={it.image && it.image.startsWith('http') ? { uri: it.image } : require('../../assets/images/clothing.png')}
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
                <View style={{ width: 24 }} /> {/* Spacer to center title */}
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
    safe: { flex: 1, backgroundColor: '#fff' },
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
