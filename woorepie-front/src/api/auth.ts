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
    agentId?: number
    agentName?: string
    agentEmail?: string
    authorities: Array<{
      authority: string
    }>
  }
}

// 로그인 함수
export const login = async (loginData: CustomerLogin | AgentLogin, isAgent: boolean = false) => {
  try {
    const endpoint = isAgent ? "/agent/login" : "/customer/login"
    
    // agent와 customer의 로그인 데이터 형식 구분
    const requestData = isAgent ? {
      agentEmail: (loginData as AgentLogin).agentEmail,
      agentPassword: (loginData as AgentLogin).agentPassword,
      agentPhoneNumber: (loginData as AgentLogin).agentPhoneNumber.replace(/-/g, ''), // 하이픈 제거
    } : {
      customerEmail: (loginData as CustomerLogin).customerEmail,
      customerPassword: (loginData as CustomerLogin).customerPassword,
      customerPhoneNumber: (loginData as CustomerLogin).customerPhoneNumber.replace(/-/g, ''), // 하이픈 제거
    }

    const response = await api.post<ApiResponse>(endpoint, requestData)
    
    // 로그인 성공 후 auth/status를 호출하여 최신 사용자 정보를 가져옴
    if (response.status === 200) {
      await checkAuthStatus()
      window.location.reload()
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
    const response = await api.get<ApiResponse<AuthStatusResponse>>("/auth/status")
    
    const isAuthenticated = response.status === 200 && response.data.authenticated
    const userRole = response.data.user?.authorities?.[0]?.authority
    const userData = response.data.user
    const isAgent = userRole === 'ROLE_AGENT'

    if (isAuthenticated && userRole) {
      // 세션 스토리지에 사용자 정보 저장
      const userInfo = {
        id: isAgent ? userData.agentId : userData.customerId,
        email: isAgent ? userData.agentEmail : userData.customerEmail,
        name: isAgent ? userData.agentName : userData.customerName,
        role: userRole,
      }
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      sessionStorage.removeItem('userInfo')
    }

    return { 
      success: response.status === 200,
      authenticated: isAuthenticated,
      message: response.message,
      userRole,
      userData
    }
  } catch (error) {
    sessionStorage.removeItem('userInfo')
    return { 
      success: false, 
      authenticated: false,
      message: "인증 상태 확인 중 오류가 발생했습니다.",
      userRole: null,
      userData: null
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