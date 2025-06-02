// src/api/agent.ts
import { api } from "./api"
import type { GetAgentEstateListResponse } from "../types/agent/agent"
import type {
  AgentCompany,
  AgentRepresentative,
  AgentCreateRequest,
  GetAgentResponse
} from "../types/agent/agent"

interface ApiResponse<T = any> {
  timestamp: string
  status: number
  message: string
  path: string
  data?: T
}

interface PresignedUrlResponse {
  url: string
  key: string
  expiresIn: number
}

interface S3PresignedUrlResponse extends ApiResponse<PresignedUrlResponse[]> {}

export const agentService = {
  // ✅ 이메일 중복 확인
  checkEmailDuplicate: async (email: string) => {
    try {
      const response = await api.get<ApiResponse>(`/agent/check-email?agentEmail=${email}`)
      return {
        success: response.status === 200 && response.data === true,
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
  },

  // ✅ 전화번호 중복 확인 추가
  checkPhoneDuplicate: async (phoneNumber: string) => {
    try {
      const response = await api.get<ApiResponse>(`/agent/check-phone?phoneNumber=${phoneNumber}`)
      return {
        success: response.status === 200 && response.data === true,
        message: "사용 가능한 전화번호입니다."
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response.data.message || "이미 등록된 전화번호입니다."
        }
      }
      return {
        success: false,
        message: "전화번호 중복 확인 중 오류가 발생했습니다."
      }
    }
  },

  // 전화번호 인증번호 발송
  sendVerificationCode: async (phone: string) => {
    try {
      await api.post<ApiResponse>("/agent/send-verification", { phone })
      return {
        success: true,
        message: "인증번호가 발송되었습니다."
      }
    } catch (error) {
      return {
        success: false,
        message: "인증번호 발송 중 오류가 발생했습니다."
      }
    }
  },

  // 인증번호 확인
  verifyCode: async (phone: string, code: string) => {
    try {
      await api.post<ApiResponse>("/agent/verify-code", { phone, code })
      return {
        success: true,
        message: "인증이 완료되었습니다."
      }
    } catch (error) {
      return {
        success: false,
        message: "인증번호가 일치하지 않습니다."
      }
    }
  },

  // 나머지 기존 코드들 동일...
  // ...
  getPresignedUrls: async (agentEmail, identificationFileType, certFileType, warrantFileType) => { /* 생략 */ },
  uploadImageToS3: async (url, file) => { /* 생략 */ },
  saveCompanyInfo: async (companyData) => { /* 생략 */ },
  register: async (companyData, representativeData) => { /* 생략 */ },
  createAgent: async (data) => { /* 생략 */ },
  getEstatePresignedUrls: async (agentEmail, docTypes, estateAddress) => { /* 생략 */ },
  uploadFileToS3: async (url, file) => { /* 생략 */ },
  getAgentInfo: async (): Promise<GetAgentResponse> => {
    const response = await api.get<ApiResponse<GetAgentResponse>>("/agent")
    return response.data!
  },
  getAgentEstateList: async (): Promise<GetAgentEstateListResponse[]> => {
    const response = await api.get<ApiResponse<GetAgentEstateListResponse[]>>("/agent/estates")
    return response.data!
  }
}
