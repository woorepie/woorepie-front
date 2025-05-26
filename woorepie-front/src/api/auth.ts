// src/api/auth.ts
import { api } from "./api"
import type { CustomerLogin } from "../types/customer/customerLogin"
import type { CustomerJoin } from "../types/customer/customerJoin"
import type { AgentLogin } from "../types/agent/agent"

interface ApiResponse<T = any> {
  timestamp: string
  status: number
  message: string
  path: string
  data?: T
}

interface AuthStatusResponse {
  authenticated: boolean
  user: {
    customerId?: number
    customerName?: string
    customerEmail?: string
    authorities: Array<{
      authority: string
    }>
  }
}

// 로그인 함수
export const login = async (loginData: CustomerLogin | AgentLogin, isAgent: boolean = false) => {
  try {
    const endpoint = isAgent ? "/agent/login" : "/customer/login"
    const response = await api.post<ApiResponse>(endpoint, loginData)
    
    if (response.status === 200) {
      // 로그인 성공 시 사용자 정보만 저장
      sessionStorage.setItem('userInfo', JSON.stringify({
        email: isAgent ? (loginData as AgentLogin).agentEmail : (loginData as CustomerLogin).customerEmail,
        role: isAgent ? 'ROLE_AGENT' : 'ROLE_CUSTOMER'
      }))
    }

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
  const userInfo = sessionStorage.getItem('userInfo')
  const isAgent = userInfo ? JSON.parse(userInfo).role === 'ROLE_AGENT' : false
  
  try {
    const endpoint = isAgent ? "/agent/logout" : "/customer/logout"
    const response = await api.post<ApiResponse>(endpoint)
    // 로그아웃 시 세션 스토리지 클리어
    sessionStorage.removeItem('userInfo')
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
    const userInfo = sessionStorage.getItem('userInfo')
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null
    const isAgent = parsedUserInfo?.role === 'ROLE_AGENT'
    
    const endpoint = isAgent ? "/agent/status" : "/customer/status"
    const response = await api.get<ApiResponse<AuthStatusResponse>>(endpoint)
    
    const isAuthenticated = response.status === 200 && response.data.authenticated
    const userRole = response.data.user?.authorities?.[0]?.authority

    if (isAuthenticated && userRole) {
      // 세션 스토리지 업데이트
      sessionStorage.setItem('userInfo', JSON.stringify({
        email: response.data.user.customerEmail,
        name: response.data.user.customerName,
        role: userRole
      }))
    } else {
      sessionStorage.removeItem('userInfo')
    }

    return { 
      success: response.status === 200,
      authenticated: isAuthenticated,
      message: response.message,
      userRole
    }
  } catch (error) {
    sessionStorage.removeItem('userInfo')
    return { 
      success: false, 
      authenticated: false,
      message: "인증 상태 확인 중 오류가 발생했습니다.",
      userRole: null
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
    return { 
      success: false, 
      message: "회원가입 중 오류가 발생했습니다." 
    }
  }
}

// 인증 상태 확인을 위한 유틸리티 함수
export const isAuthenticated = async (isAgent: boolean = false) => {
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