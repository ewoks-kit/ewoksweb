import axios from 'axios';

const customUrl = import.meta.env.VITE_SERVER_URL || undefined;
const isProd = import.meta.env.NODE_ENV === 'production';

export const baseUrl = customUrl || (isProd ? '/' : 'http://localhost:5000');

export const client = axios.create({
  baseURL: baseUrl,
});
