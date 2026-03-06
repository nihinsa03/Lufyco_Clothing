import axios from 'axios';
import { Platform } from 'react-native';

// Using localtunnel to expose the local backend to the internet
const API_URL = 'https://plenty-berries-fry.loca.lt/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
