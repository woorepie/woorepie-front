import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"
import type { ApiResponse, ApiErrorResponse } from "./api"

// API 기본 URL 설정
const url = import.meta.env.VITE_API_BASE_URL

// 로컬 스토리지에서 토큰 가져오기
const getToken = (): string | null => {
  return localStorage.getItem("token")
}

// 로컬 스토리지에 토큰 저장하기
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token)
}

// 로컬 스토리지에서 토큰 제거하기
export const removeToken = (): void => {
  localStorage.removeItem("token")
}

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return !!getToken()
}

// 공통 Axios 요청 함수
const sendRequest = async <T>(
  method: string,
  endpoint: string,
  data: any = null,
  params: any = null
): Promise<T> => {
  try {
    const token = getToken()
    const customerId = localStorage.getItem("customerId")

    // Axios 요청 설정
    const config: AxiosRequestConfig = {
      method,
      url: `${url}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(customerId && { customerId: customerId }),  // ✅ 여기 추가됨
      },
      data,
      params,
    }

    const response: AxiosResponse<ApiResponse<T>> = await axios(config)
    return response.data.data
  } catch (error: any) {
    console.error(`[API Error]:`, error)

    if (error.response && error.response.data) {
      const apiError: ApiErrorResponse = error.response.data
      throw new Error(apiError.message || "API 요청 중 오류가 발생했습니다.")
    }

    throw new Error("API 요청 중 오류가 발생했습니다.")
  }
}

// API 요청 함수들
export const apiClient = {
  get: <T>(endpoint: string, params: any = null): Promise<T> =>
    sendRequest<T>("get", endpoint, null, params),

  post: <T>(endpoint: string, data: any = null): Promise<T> =>
    sendRequest<T>("post", endpoint, data),

  put: <T>(endpoint: string, data: any = null): Promise<T> =>
    sendRequest<T>("put", endpoint, data),

  delete: <T>(endpoint: string): Promise<T> =>
    sendRequest<T>("delete", endpoint),
}
