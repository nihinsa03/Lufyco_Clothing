import axios from 'axios';
import Constants from 'expo-constants';

// Dynamic host IP detection for Expo development (connects phone to PC)
const getDevHost = () => {
    // Priority 1: Expo host pointer (best for physical devices)
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) return hostUri.split(':')[0];

    // Priority 2: Manifest debugger (alternative for some environments)
    const debuggerHost = Constants.manifest?.debuggerHost;
    if (debuggerHost) return debuggerHost.split(':')[0];

    // Fallback: Localhost for simulators/emulators
    return '10.0.2.2'; // Android emulator default gateway to host
};

// Use the dynamic host if in dev mode, otherwise fallback
const HOST_IP = __DEV__ ? getDevHost() : '192.168.1.217'; // Update to current LAN IP
const API_URL = `http://${HOST_IP}:5001/api`;
const FALLBACK_URL = 'http://localhost:5001/api'; // For web/simulators if devHost fails

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
