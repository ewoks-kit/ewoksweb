import axios from 'axios';

export const baseUrl = import.meta.env.VITE_SERVER_URL as string;

export const apiSuffix = import.meta.env.VITE_SERVER_API_SUFFIX as string;

export const client = axios.create({
  baseURL: new URL(apiSuffix, baseUrl).toString(),
});
