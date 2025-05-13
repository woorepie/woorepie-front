// src/api/auth.ts
import axios from 'axios';

// axios 인스턴스 생성 (withCredentials 설정 중요)
const api = axios.create({
  baseURL: '/api',
  withCredentials: true // 쿠키를 포함하여 요청 전송
});

// 로그인 함수
export const login = async (customerEmail: string, customerPassword: string, customerPhoneNumber: string) => {
  try {
    const response = await api.post('/auth/login', {
      customerEmail,
      customerPassword,
      customerPhoneNumber
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      return { success: false, error: (error as any).response.data };
    }
    return { success: false, error: '로그인 중 오류가 발생했습니다.' };
  }
};

// 로그아웃 함수
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    return { success: true };
  } catch (error) {
    return { success: false, error: '로그아웃 중 오류가 발생했습니다.' };
  }
};

// 인증 상태 확인 함수
export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/auth/status');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, authenticated: false };
  }
};

// 회원가입 함수
export const register = async (userData: {
  customerName: string;
  customerEmail: string;
  customerPassword: string;
  customerPhoneNumber: string;
  customerAddress: string;
  customerDateOfBirth: string;
  customerIdentificationUrl: string;
}) => {
  try {
    const response = await api.post('/auth/register', userData);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      return { success: false, error: (error as any).response.data };
    }
    return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
  }
};