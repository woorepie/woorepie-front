import { apiClient } from "./apiClient"
import type { SubscriptionList } from "../types/subscription/subscription"
import type { SubscriptionDetail } from "../types/subscription/subscriptionDetail"

// 청약 서비스
export const subscriptionService = {
  // 청약 매물 상세 조회
  getSubscriptionDetails: async (estateId: string | number): Promise<SubscriptionDetail> => {
    return await apiClient.get<SubscriptionDetail>(`/subscription?estateId=${estateId}`)
  },

  // 청약 가능한 매물 리스트 조회
  getActiveSubscriptions: async (): Promise<SubscriptionList[]> => {
    return await apiClient.get<SubscriptionList[]>("/subscription/list")
  },

  // 청약 매물 등록 (중개인 전용)
  registerEstate: async (estateData: any): Promise<void> => {
    return await apiClient.post<void>("/subscription/create", estateData)
  },
}
