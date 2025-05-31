import { api } from "./api"
import type { Customer  } from "../types/customer/customer"
import type { CustomerSubscription } from "../types/customer/customerSubscription"
import type { CustomerTrade } from "../types/customer/customerTrade"

interface ApiResponse<T> {
  timestamp: string
  status: number
  message: string
  path: string
  data: T
}

// 고객 서비스
export const customerService = {
  // 고객 정보 조회
  // getCustomerInfo: async (): Promise<Customer> => {
  getCustomerInfo: async (): Promise<Customer> => {
  return await api.get<Customer>("/customer")
 },

  // 청약 내역 조회
  getCustomerSubscription: async (): Promise<CustomerSubscription[]> => {
    return await api.get<CustomerSubscription[]>("/customer/subscription")
  },

  // 거래 내역 조회
  getCustomerTrade: async (): Promise<CustomerTrade[]> => {
    return await api.get<CustomerTrade[]>("/customer/trade")
  },


}
