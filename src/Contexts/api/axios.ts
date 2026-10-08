import axios from 'axios';

export const apiBaseUrl = (import.meta.env.VITE_API_URL?.trim()
  || (import.meta.env.DEV ? 'http://localhost:3000' : 'https://backenddelivery-t22i.onrender.com'))
  .replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lky');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('h_mizik_token');

    }
    return Promise.reject(error);
  }
);

export default api;
