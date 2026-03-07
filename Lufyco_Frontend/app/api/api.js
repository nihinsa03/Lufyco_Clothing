import axios from 'axios';
import { Platform } from 'react-native';

// Using local WiFi IP to connect to the backend
const API_URL = 'http://10.10.41.93:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
