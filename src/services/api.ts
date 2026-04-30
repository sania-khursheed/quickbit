import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('netlify.app') 
    ? 'https://ais-pre-xe7jjdkob5uej2lnwyr7js-862157824437.asia-southeast1.run.app/api' 
    : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
});

console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
