import axios from 'axios';
import { Platform } from 'react-native';

// Using local WiFi IP to connect to the backend
// Standard Android emulator host loopback is 10.0.2.2
const HOST_IP = '10.10.41.93';
const API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:5001/api'
    : `http://${HOST_IP}:5001/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
