import { apiClient } from "./apiClient"
import type { Customer  } from "../types/customer/customer"
import type { CustomerToken } from "../types/customer/customerToken"
import type { CustomerSubscription } from "../types/customer/customerSubscription"
import type { CustomerTrade } from "../types/customer/customerTrade"


// 고객 서비스
export const customerService = {
  // 고객 정보 조회
  getCustomerInfo: async (): Promise<Customer> => {
    return await apiClient.get<Customer>("/customer")
  },

  // 토큰 내역 조회
  getCustomerToken: async (): Promise<CustomerToken[]> => {
    return await apiClient.get<CustomerToken[]>("/customer/token")
  },

  // 청약 내역 조회
  getCustomerSubscription: async (): Promise<CustomerSubscription[]> => {
    return await apiClient.get<CustomerSubscription[]>("/customer/subscription")
  },

  // 거래 내역 조회
  getCustomerTrade: async (): Promise<CustomerTrade[]> => {
    return await apiClient.get<CustomerTrade[]>("/customer/trade")
  },
}
