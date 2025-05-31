import { api } from "../api"
import type { Customer } from "../../types/customer/customer"
import type { CustomerSubscription } from "../../types/customer/customerSubscription"
import type { CustomerTrade } from "../../types/customer/customerTrade"
import type { CustomerAccount } from "@/types/customer/customeraccount"


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

  // customerService.ts 내에 추가
getCustomerAccount: async (): Promise<CustomerAccount> => {
  const response = await api.get<ApiResponse<CustomerAccount>>("/customer/account")
  return response.data
},

  // ✅ 고객 정보 조회 (응답에서 data만 반환)
  getCustomerInfo: async (): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>("/customer")
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
        }
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error("S3 upload error:", error)
      throw new Error("이미지 업로드에 실패했습니다.")
    }
  },

  // 계좌 잔액 충전
  chargeAccountBalance: async (price: number): Promise<void> => {
    await api.post<ApiResponse<void>>("/customer/account/balance", {
      price: price
    })
  },

  // 비밀번호 변경
  modifyPassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post<ApiResponse<void>>("/customer/modify/password", {
      currentPassword,
      newPassword
    })
  },
}
