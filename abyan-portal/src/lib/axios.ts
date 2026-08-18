import axios from 'axios';

const isServer = typeof window === 'undefined';
let baseURL = isServer
  ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://backend:4000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

if (baseURL && !baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
