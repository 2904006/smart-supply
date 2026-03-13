// api.js

// API configuration for JWT authentication
const axios = require('axios');

const api = axios.create({
    baseURL: 'https://api.example.com', // Replace with your API base URL
    timeout: 1000,
});

// Add a request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // or however you store your JWT
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const { response } = error;
    switch (response.status) {
        case 401:
            // Handle unauthorized access
            break;
        // Handle other status codes
    }
    return Promise.reject(error);
});

module.exports = api;