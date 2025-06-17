import { api } from '.';

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
