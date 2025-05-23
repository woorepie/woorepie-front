import axios from "axios"

interface ApiResponse<T> {
  timestamp: string
  status: number
  message: string
  path: string
  data: T
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
    const response = await apiClient.get<ApiResponse<T>>(url, { params })
    return response.data.data
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data)
    return response.data.data
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data)
    return response.data.data
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url)
    return response.data.data
  }
}

// 디버깅용 응답 로그
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)
