import axios from 'axios';
import { BASE_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // Increased timeout to 5 seconds for better reliability
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken.trim()}`; // Trim token to avoid errors due to whitespace
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error); // Log request errors for debugging
        return Promise.reject(error);
    }
);


export default axiosInstance;
