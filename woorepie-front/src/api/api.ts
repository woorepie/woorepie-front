import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// API 응답 타입 정의
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080'; // 실제 API 서버 URL로 변경 필요

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 기반 인증을 위해 필요
});

// 요청 인터셉터 - 토큰 추가 등의 작업 수행
apiClient.interceptors.request.use(
  (config) => {
    // 필요한 경우 여기서 토큰 추가 등의 작업 수행
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 등
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리 로직
    if (error.response) {
      // 서버 응답이 있는 경우
      const { status, data } = error.response;
      
      if (status === 401) {
        // 인증 에러 처리
        console.error('인증 에러:', data);
        // 로그인 페이지로 리다이렉트 등의 처리
        window.location.href = '/auth/login';
      } else if (status === 403) {
        // 권한 에러 처리
        console.error('권한 에러:', data);
      } else {
        // 기타 에러 처리
        console.error('API 에러:', data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('응답 없음:', error.request);
    } else {
      // 요청 설정 중 에러 발생
      console.error('요청 에러:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API 요청 함수
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, config);
    return response.data.data;
  },
  
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data, config);
    return response.data.data;
  },
  
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data, config);
    return response.data.data;
  },
  
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, config);
    return response.data.data;
  }
};
