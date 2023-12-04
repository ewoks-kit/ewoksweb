import axios from 'axios';

export const baseUrl = import.meta.env.VITE_SERVER_URL as string;

export const apiSuffix = import.meta.env.VITE_SERVER_API_SUFFIX as string;

export const client = axios.create({
  baseURL: (baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl) + apiSuffix,
});
