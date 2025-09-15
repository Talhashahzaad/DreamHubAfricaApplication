// src/api/index.js
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.dreamhubafrica.com', // replace with your real base URL
  timeout: 15000,
});

api.interceptors.request.use(async config => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    const err = new Error('No internet connection');
    err.isOffline = true;
    throw err;
  }
  return config;
}, error => Promise.reject(error));

export default api;
