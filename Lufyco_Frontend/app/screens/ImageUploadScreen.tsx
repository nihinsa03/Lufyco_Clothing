import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../api/api';

// AI Backend URL (Different from Main Backend)
const AI_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'ImageUpload'>;
};

const ImageUploadScreen = ({ navigation }: Props) => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null);
        }
    };

    const analyzeImage = async () => {
        if (!image) return;

        setLoading(true);
        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', {
                uri: image,
                name: 'upload.jpg',
                type: 'image/jpeg',
            } as any);

            const response = await fetch(`${AI_API_URL}/analyze-image`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            Alert.alert("Analysis Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    const saveToCloset = async () => {
        if (!result || !image) return;

        try {
            setLoading(true);
            // In a real app, upload image to cloud storage (e.g. S3/Cloudinary) first.
            // For now, we save the local URI or base64 (not recommended for prod but ok for demo)
            // Or assume backend handles the file upload if sent as multipart.
            // Here we just save metadata mock.

            await api.post('/closet', {
                name: "New Item", // Should ask user for name
                category: result.detected_tags?.[0] || "General",
                image: image, // Local URI (won't work on other devices unless uploaded)
                notes: JSON.stringify(result.detected_tags)
            });

            Alert.alert("Success", "Item added to your closet!");
            navigation.navigate("MyCloset");
        } catch (error: any) {
            Alert.alert("Save Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Image Search</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.instruction}>Upload a photo to find similar items or get styling advice.</Text>

                <View style={styles.imageContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Feather name="image" size={48} color="#ccc" />
                            <Text style={styles.placeholderText}>No image selected</Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
                        <Feather name="image" size={20} color="#fff" />
                        <Text style={styles.btnText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
                        <Feather name="camera" size={20} color="#fff" />
                        <Text style={styles.btnText}>Camera</Text>
                    </TouchableOpacity>
                </View>

                {image && (
                    <TouchableOpacity
                        style={[styles.analyzeBtn, loading && styles.disabledBtn]}
                        onPress={analyzeImage}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.analyzeText}>Analyze Image</Text>
                        )}
                    </TouchableOpacity>
                )}

                {result && (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultTitle}>Analysis Results</Text>
                        <View style={styles.tagRow}>
                            {result.detected_tags?.map((tag: string, index: number) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.rawText}>{JSON.stringify(result, null, 2)}</Text>
                    </View>
                )}

                {result && (
                    <TouchableOpacity style={styles.saveBtn} onPress={saveToCloset}>
                        <Feather name="check" size={20} color="#fff" />
                        <Text style={styles.saveText}>Save to Closet</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 50, // SafeArea
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    content: { padding: 24, alignItems: 'center' },
    instruction: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    placeholder: { alignItems: 'center' },
    placeholderText: { marginTop: 12, color: '#ccc' },
    buttonRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    actionBtn: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        gap: 8,
    },
    btnText: { color: '#fff', fontWeight: '600' },
    analyzeBtn: {
        width: '100%',
        backgroundColor: '#2C63FF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    disabledBtn: { opacity: 0.7 },
    analyzeText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    resultBox: {
        width: '100%',
        backgroundColor: '#F0F9FF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    resultTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#0369A1' },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    tag: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#BAE6FD' },
    tagText: { color: '#0284C7', fontWeight: '600' },
    rawText: { fontSize: 12, color: '#666', fontFamily: 'monospace' },
    saveBtn: {
        marginTop: 20,
        backgroundColor: '#16A34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
        width: '100%',
    },
    saveText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default ImageUploadScreen;
