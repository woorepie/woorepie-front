// 기존 import 유지
import { api } from "./api"
import type { SubscriptionList } from "../types/subscription/subscription"
import type { SubscriptionDetail } from "../types/subscription/subscriptionDetail"

// 청약 신청 요청 타입 추가
export interface CreateSubscriptionTradeRequest {
  estateId: number | string
  subAmount: number
}

// 청약 서비스
export const subscriptionService = {
  // 청약 매물 상세 조회
  getSubscriptionDetails: async (estateId: string | number): Promise<SubscriptionDetail> => {
    return await api.get<SubscriptionDetail>(`/subscription?estateId=${estateId}`)
  },

  // 청약 가능한 매물 리스트 조회
  getActiveSubscriptions: async (): Promise<SubscriptionList[]> => {
    const res = await api.get<{ data: SubscriptionList[] }>("/subscription")
    return res.data // data만 반환
  },

  // 청약 매물 등록 (중개인 전용)
  registerEstate: async (estateData: any): Promise<void> => {
    return await api.post<void>("/subscription/create", estateData)
  },

  // 청약 신청 API 추가
  createSubscription: async (request: CreateSubscriptionTradeRequest): Promise<any> => {
    try {
      console.log("청약 신청 API 호출:", request)
      const response = await api.post<any>("/trade/subscription", request)
      console.log("청약 신청 API 응답:", response)
      return response
    } catch (error) {
      console.error("청약 신청 API 오류:", error)
      throw error
    }
  },
}
