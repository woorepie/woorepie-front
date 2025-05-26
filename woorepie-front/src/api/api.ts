import axios from "axios"
import type { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios"


// API 응답 타입 정의
export interface ApiResponse<T> {
  code: string
  message: string
  data: T
  timestamp: string
}

// API 에러 타입 정의
export interface ApiErrorResponse {
  code: string
  message: string
  timestamp: string
}

// API 기본 설정
const url = import.meta.env.VITE_API_BASE_URL

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 기반 인증을 위해 필요
})

// 요청 인터셉터 - 토큰 추가 등의 작업 수행
apiClient.interceptors.request.use(
  (config) => {
    // 필요한 경우 여기서 토큰 추가 등의 작업 수행
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 - 에러 처리 등
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // 에러 처리 로직
    if (error.response) {
      // 서버 응답이 있는 경우
      const { status, data } = error.response

      if (status === 401) {
        // 인증 에러 처리
        console.error("인증 에러:", data?.message || "인증에 실패했습니다.")
        // 로그인 페이지로 리다이렉트 등의 처리
        window.location.href = "/auth/login"
      } else if (status === 403) {
        // 권한 에러 처리
        console.error("권한 에러:", data?.message || "접근 권한이 없습니다.")
      } else if (status === 400) {
        // 400 에러 처리
        console.error("데이터 포멧 에러:", data?.message || "잘못된 요청입니다.")
      } else if (status === 404) {
        // 404 에러 처리
        console.error("존재 여부 에러:", data?.message || "요청한 리소스를 찾을 수 없습니다.")
      } else if (status === 409) {
        // 409 에러 처리
        console.error("중복 에러:", data?.message || "이미 존재하는 리소스입니다.")
      } else {
        // 기타 에러 처리
        console.error("API 에러:", data?.message || "서버 에러가 발생했습니다.")
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error("응답 없음:", "서버로부터 응답을 받지 못했습니다.")
    } else {
      // 요청 설정 중 에러 발생
      console.error("요청 에러:", error.message)
    }

    return Promise.reject(error)
  },
)

// API 요청 함수
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, config)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      }
      throw new Error("알 수 없는 에러가 발생했습니다.")
    }
  },
  
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data, config)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      }
      throw new Error("알 수 없는 에러가 발생했습니다.")
    }
  },
  
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data, config)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      }
      throw new Error("알 수 없는 에러가 발생했습니다.")
    }
  },
  
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, config)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error
      }
      throw new Error("알 수 없는 에러가 발생했습니다.")
    }
  }
}
