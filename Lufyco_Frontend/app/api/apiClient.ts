import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';

// Base URL configuration
// For physical device, use your machine's LAN IP (e.g., http://192.168.1.5:5001/api)
// For Android Emulator, http://10.0.2.2:5001/api works.
// For iOS Simulator, http://localhost:5001/api works.

// Using Localtunnel to bypass local network/firewall issues
// URL generated: https://ten-clubs-travel.loca.lt
const BASE_URL = 'https://ten-clubs-travel.loca.lt/api';

// Create Axios Instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10s timeout
    headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    async (config) => {
        // Check if we have a token in the store state first
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Fallback to AsyncStorage if state is not hydrated or missing
            const storedState = await AsyncStorage.getItem('auth-storage');
            if (storedState) {
                const parsed = JSON.parse(storedState);
                if (parsed.state?.token) {
                    config.headers.Authorization = `Bearer ${parsed.state.token}`;
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle Network Errors (No Internet)
        if (!error.response) {
            // Possible Network Error or Timeout
            if (error.code === 'ECONNABORTED') {
                return Promise.reject({ message: 'Request timed out. Please try again.', type: 'TIMEOUT' });
            }
            return Promise.reject({ message: 'No internet connection. Check your network and try again.', type: 'NETWORK' });
        }

        // Handle Status Codes
        const status = error.response.status;
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'Something went wrong. Please try again.';

        switch (status) {
            case 401:
            case 403:
                // Skip global handler for login (invalid credentials)
                if (originalRequest.url?.includes('/login')) {
                    return Promise.reject({ message: errorMessage, type: 'API', status, errors: errorData?.errors });
                }

                // Session Expired
                console.warn('Session expired, logging out...');
                useAuthStore.getState().logout();
                return Promise.reject({ message: 'Session expired. Please log in again.', type: 'AUTH', status });

            case 404:
                return Promise.reject({ message: 'Resource not found.', type: 'NOT_FOUND', status });

            case 500:
            case 502:
            case 503:
                return Promise.reject({ message: 'Server error. Please try again later.', type: 'SERVER', status });

            default:
                // Handle validation errors or other 4xx
                return Promise.reject({ message: errorMessage, type: 'API', status, errors: errorData?.errors });
        }
    }
);

export default apiClient;
