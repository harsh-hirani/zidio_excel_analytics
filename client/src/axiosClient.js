import axios from 'axios';

const apiClient = axios.create({ baseURL: 'http://localhost:5000' });
// const apiClient = axios.create({ baseURL: 'https://ex-back-h2g5.onrender.com' });

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `${token}`;
  return config;
});

export default apiClient;

