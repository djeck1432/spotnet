import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.VITE_APP_BACKEND_URL || 'http://0.0.0.0:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
