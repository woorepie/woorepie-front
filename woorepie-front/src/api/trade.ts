// src/api/trade.ts
import { api } from "./api"
import type { BuyEstateRequest, SellEstateRequest } from "../types/trade/trade"

// 거래 서비스
export const tradeService = {
  // 매수 요청
  buyEstate: async (request: BuyEstateRequest): Promise<void> => {
    return await api.post("/trade/buy", request)
  },

  // 매도 요청
  sellEstate: async (request: SellEstateRequest): Promise<void> => {
    return await api.post("/trade/sell", request)
  }
}