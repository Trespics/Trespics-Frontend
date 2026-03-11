import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = "https://florant-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
