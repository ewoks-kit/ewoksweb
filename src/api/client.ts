import axios from 'axios';

const customUrl = process.env.REACT_APP_SERVER_URL || undefined;
const isProd = process.env.NODE_ENV === 'production';

export const baseUrl = customUrl || (isProd ? '/' : 'http://localhost:5000');

export const client = axios.create({
  baseURL: baseUrl,
});
