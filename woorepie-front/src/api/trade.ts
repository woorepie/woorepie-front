import { api } from "./api"
import type { BuyEstateRequest, SellEstateRequest, RedisCustomerTradeValue } from "../types/trade/trade"

interface ApiResponse<T> {
  timestamp: string
  status: number
  message: string
  path: string
  data: T
}

// 거래 서비스
export const tradeService = {
  // 매수 요청
  buyEstate: async (request: BuyEstateRequest): Promise<void> => {
    await api.post("/trade/buy", request)
  },

  // 매도 요청
  sellEstate: async (request: SellEstateRequest): Promise<void> => {
    await api.post("/trade/sell", request)
  }
}

// 내 거래 조회 서비스
export const customerService = {
  getCustomerBuyOrders: async (): Promise<RedisCustomerTradeValue[]> => {
  const res = await api.get<ApiResponse<RedisCustomerTradeValue[]>>("/redis/customer/buy")
  return res.data || []
},
getCustomerSellOrders: async (): Promise<RedisCustomerTradeValue[]> => {
  const res = await api.get<ApiResponse<RedisCustomerTradeValue[]>>("/redis/customer/sell")
  return res.data || []
}

}
