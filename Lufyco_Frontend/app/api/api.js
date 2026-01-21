import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for web, and different IP for Android emulator/Real device if needed
// For Android Emulator usually 10.0.2.2, for Genymotion 10.0.3.2
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

import AsyncStorage from '@react-native-async-storage/async-storage';

// Add a request interceptor to attach token
api.interceptors.request.use(
    async (config) => {
        // Try getting token from storage (Zustand persists it, but we can also grab it if we know the key)
        // Zustand persist key: 'auth-storage' -> state -> token
        // Usually simpler to just check if we have a raw token stored, but with Zustand persist it's inside JSON.
        // Let's try to parse it.
        try {
            const jsonValue = await AsyncStorage.getItem('auth-storage');
            if (jsonValue != null) {
                const data = JSON.parse(jsonValue);
                const token = data?.state?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            // Ignore error
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;
