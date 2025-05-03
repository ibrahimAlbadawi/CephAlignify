import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // or use an env variable
  withCredentials: true, // if using cookies/session auth
});

export default api;