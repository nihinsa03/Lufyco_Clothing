import axios from 'axios';
import { Platform } from 'react-native';

// Using local WiFi IP to connect to the backend
// Standard Android emulator host loopback is 10.0.2.2
const HOST_IP = '10.10.41.93';
const API_URL = `http://${HOST_IP}:5001/api`;

// Note: If using iOS Simulator, you can change this to http://localhost:5001/api
// If using Android Emulator, you can use http://10.0.2.2:5001/api
// But HOST_IP should work for both if the machine's firewall allows port 5001.

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
