import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'https://spotnet.xyz',
  headers: {
    'Content-Type': 'application/json',
  },
});
