import axios from 'axios';
import { API_URL, INIT_DATA } from '@/shared/constants';
import { getInitData } from '../initDataToken';

const instance = axios.create({ baseURL: API_URL });

instance.interceptors.request.use((config) => {
  const token = INIT_DATA ?? getInitData();
  if (token) {
    config.headers['X-Api-Token'] = token;
  }
  return config;
});

export const axiosInstance = instance;
