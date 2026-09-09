import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // Replace with your backend API base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);