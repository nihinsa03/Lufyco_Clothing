import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for web, and different IP for Android emulator/Real device if needed
// For Android Emulator usually 10.0.2.2, for Genymotion 10.0.3.2
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001/api' : 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
