import { api } from "./api"
import type { BuyEstateRequest, SellEstateRequest, RedisCustomerTradeValue } from "../types/trade/trade"

interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: string
  path: string
}

interface RedisEstateTradeValue {
  customerId: number
  tradeTokenAmount: number
  tokenPrice: number
  timestamp: string
}

// 이 인터페이스는 types/trade/trade.ts의 RedisCustomerTradeValue를 사용합니다

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

// Redis 거래 서비스
export const tradeRedisService = {
  // 매수 주문 저장
  saveBuyOrder: async (request: BuyEstateRequest): Promise<void> => {
    await api.post<ApiResponse<void>>("/redis/buy", request)
  },

  // 매도 주문 저장
  saveSellOrder: async (request: SellEstateRequest): Promise<void> => {
    await api.post<ApiResponse<void>>("/redis/sell", request)
  },

  // 매물 기준 매수 주문 전체 조회
  getEstateBuyOrders: async (estateId: number): Promise<RedisEstateTradeValue[]> => {
    const response = await api.get<ApiResponse<RedisEstateTradeValue[]>>(`/redis/estate/${estateId}/buy`)
    return response.data
  },

  // 매물 기준 매도 주문 전체 조회
  getEstateSellOrders: async (estateId: number): Promise<RedisEstateTradeValue[]> => {
    const response = await api.get<ApiResponse<RedisEstateTradeValue[]>>(`/redis/estate/${estateId}/sell`)
    return response.data
  },

  // 고객 기준 매수 주문 전체 조회
  getCustomerBuyOrders: async (): Promise<RedisCustomerTradeValue[]> => {
    const response = await api.get<ApiResponse<RedisCustomerTradeValue[]>>("/redis/customer/buy")
    return response.data
  },

  // 고객 기준 매도 주문 전체 조회
  getCustomerSellOrders: async (): Promise<RedisCustomerTradeValue[]> => {
    const response = await api.get<ApiResponse<RedisCustomerTradeValue[]>>("/redis/customer/sell")
    return response.data
  },

  // 매물 기준 가장 오래된 매수 주문 꺼내기
  popOldestBuyOrder: async (estateId: number): Promise<RedisEstateTradeValue> => {
    const response = await api.get<ApiResponse<RedisEstateTradeValue>>(`/redis/estate/${estateId}/buy/pop-oldest`)
    return response.data
  },

  // 매물 기준 가장 오래된 매도 주문 꺼내기
  popOldestSellOrder: async (estateId: number): Promise<RedisEstateTradeValue> => {
    const response = await api.get<ApiResponse<RedisEstateTradeValue>>(`/redis/estate/${estateId}/sell/pop-oldest`)
    return response.data
  }
}
