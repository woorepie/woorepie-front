import { api } from "./api"
import type { AgentCompany, AgentRepresentative, AgentCreateRequest } from "../types/agent/agent"

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

// 중개인 서비스
export const agentService = {
  // 이메일 중복 확인
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

  // 전화번호 인증번호 발송
  sendVerificationCode: async (phone: string) => {
    try {
      const response = await api.post<ApiResponse>("/agent/send-verification", { phone })
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
      const response = await api.post<ApiResponse>("/agent/verify-code", { phone, code })
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

  // S3 Presigned URL 요청
  getPresignedUrls: async (agentEmail: string): Promise<PresignedUrlResponse[]> => {
    try {
      const response = await api.post<ApiResponse>("/s3-presigned-url/agent", {
        agentEmail
      })
      
      console.log('Raw API Response:', response)
      
      if (!response || !response.data || !Array.isArray(response.data)) {
        console.error('Response structure:', response)
        throw new Error('Invalid response format from server')
      }

      const urls = response.data as PresignedUrlResponse[]
      console.log('Parsed URLs:', urls)

      if (urls.length < 3) {
        throw new Error(`Expected 3 URLs but got ${urls.length}`)
      }

      return urls
    } catch (error) {
      console.error('Presigned URL Error:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to get presigned URLs')
    }
  },

  // S3에 이미지 업로드
  uploadImageToS3: async (url: string, file: File): Promise<void> => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })
  },

  // 법인 정보 임시 저장
  saveCompanyInfo: async (companyData: AgentCompany) => {
    sessionStorage.setItem('agentCompanyData', JSON.stringify(companyData))
    return {
      success: true,
      message: "법인 정보가 저장되었습니다."
    }
  },

  // 대행인 정보 등록 및 회원가입 완료
  register: async (companyData: AgentCompany, representativeData: AgentRepresentative) => {
    try {
      const response = await api.post<ApiResponse>("/agent/register", {
        company: companyData,
        representative: representativeData
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      return {
        success: false,
        message: "회원가입 중 오류가 발생했습니다."
      }
    }
  },

  // 최종 agent 생성 요청
  createAgent: async (data: AgentCreateRequest): Promise<ApiResponse> => {
    console.log('Creating agent with data:', {
      ...data,
      agentPassword: '******' // 비밀번호는 로그에서 가림
    })
    const response = await api.post<ApiResponse>("/agent/create", data)
    console.log('Agent creation response:', response)
    return response
  },

  // 매물 등록용 S3 Presigned URL 요청
  getEstatePresignedUrls: async (agentEmail: string, docTypes: string[], estateAddress: string): Promise<PresignedUrlResponse[]> => {
    try {
      const response = await api.post<ApiResponse>("/s3-presigned-url/estate", {
        agentEmail,
        docTypes,
        estateAddress
      })
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server')
      }
      return response.data as PresignedUrlResponse[]
    } catch (error) {
      throw new Error('Failed to get estate presigned URLs')
    }
  },

  // S3 파일 업로드 (공통)
  uploadFileToS3: async (url: string, file: File): Promise<void> => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })
  }
} 