// src/api/auth.ts
import { api } from "./api"
import type { CustomerLogin } from "../types/customer/customerLogin"
import type { CustomerJoin } from "../types/customer/customerJoin"

interface ApiResponse {
  timestamp: string
  status: number
  message: string
  path: string
  data?: any
}

// 로그인 함수
export const login = async (customerLogin: CustomerLogin) => {
  try {
    const response = await api.post<ApiResponse>("/customer/login", customerLogin)
      // 명시적으로 문자열 'true'로 저장
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('userInfo', JSON.stringify({
        email: customerLogin.customerEmail,
        username: customerLogin.customerEmail.split('@')[0]
      }))

    return { 
      success: response.status === 200, 
      message: response.message 
    }
  } catch (error) {
    return { 
      success: false,
      message: "로그인에 실패했습니다."
    }
  } 
}

// 로그아웃 함수
export const logout = async () => {
  try {
    const response = await api.post<ApiResponse>("/customer/logout")
    return { 
      success: response.status === 200, 
      message: response.message 
    }
  } catch (error) {
    return { 
      success: false, 
      message: "로그아웃 중 오류가 발생했습니다." 
    }
  }
}

// 인증 상태 확인 함수
export const checkAuthStatus = async () => {
  try {
    const response = await api.get<ApiResponse>("/customer/status")
    return { 
      success: response.status === 200,
      authenticated: response.status === 200,
      message: response.message
    }
  } catch (error) {
    return { 
      success: false, 
      authenticated: false,
      message: "인증 상태 확인 중 오류가 발생했습니다."
    }
  }
}

// 회원가입 함수
export const register = async (userData: CustomerJoin) => {
  try {
    const data = await api.post("/customer/create", userData)
    return { 
      success: true, 
      data 
    }
  } catch (error) {
    
    // 기타 에러의 경우 기본 메시지 반환
    return { 
      success: false, 
      message: "회원가입 중 오류가 발생했습니다." 
    }
  }
}

// 인증 상태 확인을 위한 유틸리티 함수
export const isAuthenticated = async () => {
  const response = await checkAuthStatus()
  return response.success && response.authenticated
}

// 이메일 중복 확인 함수
export const checkEmailDuplicate = async (email: string) => {
  try {
    const response = await api.get<ApiResponse>(`/customer/check-email?customerEmail=${email}`)
    return {
      success: true,
      message: "사용 가능한 이메일입니다."
    }
  } catch (error: any) {
    // 400 상태 코드는 중복 이메일을 의미
    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data.message || "이미 등록된 이메일입니다."
      }
    }
    return {
      success: false,
      message: "이메일 중복 확인 중 오류가 발생했습니다."
    }
  }
}