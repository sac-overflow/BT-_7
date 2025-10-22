import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      return Promise.reject({ 
        message: error.response.data?.message || 'Server error occurred', 
        status: error.response.status, 
        data: error.response.data 
      });
    }
    if (error.request) {
      return Promise.reject({ 
        message: 'Network error - please check your connection', 
        status: 0, 
        data: null 
      });
    }
    return Promise.reject({ 
      message: 'Request failed', 
      status: 0, 
      data: null 
    });
  }
);

export default api;


