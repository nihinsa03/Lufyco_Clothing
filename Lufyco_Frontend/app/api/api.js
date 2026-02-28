import axios from 'axios';
import { Platform } from 'react-native';

// Use your machine's local IP address so physical phones can connect over Wi-Fi
const IP_ADDRESS = '10.89.61.230'; // Automatically found via ipconfig
const API_URL = `http://${IP_ADDRESS}:5001/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
