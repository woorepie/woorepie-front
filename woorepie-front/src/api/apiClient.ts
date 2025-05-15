// import axios from "axios"

// // API 기본 URL 설정
// const API_BASE_URL = "http://localhost:8080" // 실제 API 서버 URL로 변경 필요

// // 로컬 스토리지에서 토큰 가져오기
// const getToken = () => {
//   return localStorage.getItem("token")
// }

// // 로컬 스토리지에 토큰 저장하기
// export const saveToken = (token: string) => {
//   localStorage.setItem("token", token)
// }

// // 로컬 스토리지에서 토큰 제거하기
// export const removeToken = () => {
//   localStorage.removeItem("token")
// }

// // 로그인 상태 확인
// export const isLoggedIn = () => {
//   return !!getToken()
// }

// // 공통 Axios 요청 함수
// const sendRequest = async (method, endpoint, data = null, params = null) => {
//   try {
//     // 토큰 가져오기
//     const token = getToken()

//     // Axios 요청 설정
//     const config = {
//       method,
//       url: `${API_BASE_URL}${endpoint}`,
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있으면 Authorization 헤더 추가
//       },
//       data,
//       params,
//     }

//     const response = await axios(config)
//     return response.data
//   } catch (error) {
//     console.error(`[API Error]:`, error)
//     throw error
//   }
// }

// // API 요청 함수들
// export const apiClient = {
//   get: (endpoint, params = null) => sendRequest("get", endpoint, null, params),
//   post: (endpoint, data = null) => sendRequest("post", endpoint, data),
//   put: (endpoint, data = null) => sendRequest("put", endpoint, data),
//   delete: (endpoint) => sendRequest("delete", endpoint),
// }

import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"
import type { ApiResponse, ApiError } from "../types/api"
import dotenv from "dotenv"

// API 기본 URL 설정
dotenv.config()
const url = process.env.API_BASE_URL // 실제 API 서버 URL로 변경 필요

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
)
: Promise<T> =>
{
  try {
    // 토큰 가져오기\
    const token = getToken()

    // Axios 요청 설정
    const config: AxiosRequestConfig = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있으면 Authorization 헤더 추가
      },
      data,
      params,
    }

    const response: AxiosResponse<ApiResponse<T>> = await axios(config)
    return response.data.data
  } catch (error: any) {
    console.error(`[API Error]:`, error)

    // 에러 응답이 있는 경우 ApiError 형식으로 변환
    if (error.response && error.response.data) {
      const apiError: ApiError = error.response.data
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
