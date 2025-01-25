import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://0.0.0.0:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
