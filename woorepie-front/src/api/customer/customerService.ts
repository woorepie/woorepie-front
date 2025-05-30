import { api } from "../api"
import type { Customer } from "../../types/customer/customer"
import type { CustomerToken } from "../../types/customer/customerToken"
import type { CustomerSubscription } from "../../types/customer/customerSubscription"
import type { CustomerTrade } from "../../types/customer/customerTrade"

interface ApiResponse<T> {
  timestamp: string
  status: number
  message: string
  path: string
  data: T
}

interface PresignedUrlResponse {
  url: string
  key: string
  expiresIn: number
}

export const customerService = {
  // 고객 정보 조회
  getCustomerInfo: async (): Promise<ApiResponse<Customer>> => {
    return await api.get<ApiResponse<Customer>>("/customer")
  },

  // 토큰 내역 조회
  getCustomerToken: async (): Promise<CustomerToken[]> => {
    const response = await api.get<ApiResponse<CustomerToken[]>>("/customer/token")
    return response.data
  },

  // 청약 내역 조회
  getCustomerSubscription: async (): Promise<CustomerSubscription[]> => {
    const response = await api.get<ApiResponse<CustomerSubscription[]>>("/customer/subscription")
    return response.data
  },

  // 거래 내역 조회
  getCustomerTrade: async (): Promise<CustomerTrade[]> => {
    const response = await api.get<ApiResponse<CustomerTrade[]>>("/customer/trade")
    return response.data
  },

  // S3 Presigned URL 요청
  getPresignedUrl: async (customerEmail: string, fileType: string): Promise<PresignedUrlResponse> => {
    console.log("customerEmail", customerEmail)
    console.log("fileType", fileType)
    const response = await api.post<ApiResponse<PresignedUrlResponse>>("/s3-presigned-url/customer", {
      customerEmail: customerEmail,
      fileType: fileType
    })
    return response.data
  },

  // S3에 이미지 업로드
  uploadImageToS3: async (url: string, file: File): Promise<void> => {
    try {
        const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        },
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error("S3 upload error:", error)
      throw new Error("이미지 업로드에 실패했습니다.")
    }
  },
} 