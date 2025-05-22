import { apiClient } from "./apiClient"
import type { EstateDetail } from "../types/estate/estateDetail"
import type { EstatePrice } from "../types/estate/estatePrice"

// 부동산 서비스
export const estateService = {
  // 부동산 상세 정보 조회
  getEstateDetail: async (estateId: number): Promise<EstateDetail> => {
    return await apiClient.get<EstateDetail>(`/estate/${estateId}`)
  },

  // 부동산 가격 정보 조회
  getEstatePrice: async (estateId: number): Promise<EstatePrice> => {
    return await apiClient.get<EstatePrice>(`/estate/${estateId}/price`)
  },

  // 부동산 가격 이력 조회
  getEstatePriceHistory: async (estateId: number): Promise<EstatePrice[]> => {
    return await apiClient.get<EstatePrice[]>(`/estate/${estateId}/price/history`)
  },

  // 부동산 목록 조회
  getEstateList: async (): Promise<EstateDetail[]> => {
    return await apiClient.get<EstateDetail[]>("/estate/list")
  },

  // 부동산 검색
  searchEstates: async (params: {
    state?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    minYield?: number
    maxYield?: number
  }): Promise<EstateDetail[]> => {
    return await apiClient.get<EstateDetail[]>("/estate/search", params)
  },

  // 부동산 등록 (중개인 전용)
  registerEstate: async (estateData: Omit<EstateDetail, "estateId" | "estateRegistrationDate">): Promise<EstateDetail> => {
    return await apiClient.post<EstateDetail>("/estate/register", estateData)
  },

  // 부동산 정보 수정 (중개인 전용)
  updateEstate: async (estateId: number, estateData: Partial<EstateDetail>): Promise<EstateDetail> => {
    return await apiClient.put<EstateDetail>(`/estate/${estateId}`, estateData)
  },

  // 부동산 가격 업데이트 (중개인 전용)
  updateEstatePrice: async (estateId: number, price: number): Promise<EstatePrice> => {
    return await apiClient.post<EstatePrice>(`/estate/${estateId}/price`, { price })
  }
}
