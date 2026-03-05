import axios from 'axios';
import { Platform } from 'react-native';

// Running on same laptop — use localhost directly
const IP_ADDRESS = 'localhost';
const API_URL = `http://${IP_ADDRESS}:5001/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
