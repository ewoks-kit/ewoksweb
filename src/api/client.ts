import axios from 'axios';

export const baseUrl = import.meta.env.VITE_SERVER_URL || undefined;

export const client = axios.create({
  baseURL: baseUrl,
});
