// src/api/auth.ts
import { api } from "./api"
import type { CustomerLogin } from "../types/customer/customerLogin"
import type { CustomerJoin } from "../types/customer/customerJoin"

// 로그인 함수
export const login = async (customerLogin: CustomerLogin) => {
  try {
    const data = await api.post("/auth/login", customerLogin)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "로그인 중 오류가 발생했습니다." }
  }
}

// 로그아웃 함수
export const logout = async () => {
  try {
    await api.post("/auth/logout")
    return { success: true }
  } catch (error) {
    return { success: false, error: "로그아웃 중 오류가 발생했습니다." }
  }
}

// 인증 상태 확인 함수
export const checkAuthStatus = async () => {
  try {
    const data = await api.get("/auth/status")
    return { success: true, data }
  } catch (error) {
    return { success: false, authenticated: false }
  }
}

// 회원가입 함수
export const register = async (userData: CustomerJoin) => {
  try {
    const data = await api.post("/customer/create", userData)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: "회원가입 중 오류가 발생했습니다." }
  }
}