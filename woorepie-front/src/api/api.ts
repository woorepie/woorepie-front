import axios from "axios"

// API 응답 타입 정의
interface ApiResponse {
  timestamp: string
  status: number
  message: string
  path: string
  data?: any
}

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/woorepie"

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 기반 인증을 위해 필요
  timeout: 30000 // 타임아웃 설정
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

// ✅ 요청 인터셉터 (customerId 추가됨)
apiClient.interceptors.request.use(
  (config) => {
    const userInfoStr = sessionStorage.getItem('userInfo')

    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      config.headers['X-User-Role'] = userInfo.role
      config.headers['X-User-Email'] = userInfo.email
    }

    // ✅ customerId 추가
    const customerId = localStorage.getItem("customerId")
    if (customerId) {
      config.headers['customerId'] = customerId
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
    // 비밀번호 변경 API에서는 401 에러가 발생해도 리다이렉트하지 않음
    if (error.response?.status === 401 && !error.config.url.includes('/customer/modify/password')) {
      sessionStorage.removeItem('userInfo')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)
