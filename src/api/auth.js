import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 1. 회원가입
export const register = async (payload) => {
  const response = await api.post('/api/auth/register', payload);
  return response.data;
};

// 2. 로그인
export const login = async (payload) => {
  const response = await api.post('/api/auth/login', payload);
  return response.data;
};
