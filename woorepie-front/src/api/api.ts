import axios from "axios"

interface ApiResponse {
  timestamp: string
  status: number
  message: string
  path: string
  data?: any
}

// API 기본 설정
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/woorepie"

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 기반 인증을 위해 필요
})

// API 요청 함수
export const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await apiClient.get<T>(url, { params })
    return response.data
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data)
    return response.data
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data)
    return response.data
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url)
    return response.data
  }
}

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 유저 정보 가져오기
    const userInfoStr = sessionStorage.getItem('userInfo')
    
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      // 인증 헤더 설정
      config.headers['X-User-Role'] = userInfo.role
      config.headers['X-User-Email'] = userInfo.email
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      // 인증 정보 제거
      sessionStorage.removeItem('userInfo')
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
