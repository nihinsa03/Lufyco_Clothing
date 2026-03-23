import axios from 'axios';
import Constants from 'expo-constants';

// Dynamic host IP detection for Expo development
const getDevHost = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) return 'localhost'; // Fallback
    const host = hostUri.split(':')[0];
    return host;
};

// Use the dynamic host if in dev mode, otherwise fallback to local IP
const HOST_IP = __DEV__ ? getDevHost() : '10.10.41.93';
const API_URL = `http://${HOST_IP}:5001/api`;

// Special cases for simulators/emulators if dynamic detection fails:
// Android Emulator: http://10.0.2.2:5001/api
// iOS Simulator / Web: http://localhost:5001/api

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
