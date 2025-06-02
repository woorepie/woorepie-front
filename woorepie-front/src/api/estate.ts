// estate.ts
import { api } from "./api"
import type { EstateDetail } from "../types/estate/estateDetail"
import type { EstatePrice } from "../types/estate/estatePrice"
import type { EstateSimple } from "../types/estate/estate"
import type { PresignedUrlResponse } from "../types/estate/presignedUrlResponse"

interface ApiResponse {
  data: any
  status: number
  message: string
  timestamp: string
  path: string
}

// 부동산 서비스
export const estateService = {
  // 부동산 상세 정보 조회 (쿼리 파라미터 방식)
  getEstateDetail: async (estateId: number): Promise<EstateDetail> => {
  const response = await api.get<ApiResponse>("/estate", { estateId })
  return response.data
 },

  // 부동산 가격 정보 조회
  getEstatePrice: async (estateId: number): Promise<EstatePrice> => {
    const response = await api.get<ApiResponse>(`/estate/${estateId}/price`)
    return response.data
  },

  // 부동산 가격 이력 조회
  getEstatePriceHistory: async (estateId: number): Promise<EstatePrice[]> => {
    const response = await api.get<ApiResponse>(`/estate/${estateId}/price/history`)
    return response.data
  },

  // 부동산 목록 조회
  getEstateList: async (): Promise<EstateSimple[]> => {
    const response = await api.get<ApiResponse>("/estate/list")
    return response.data
  },

  // 부동산 검색
  searchEstates: async (params: {
    state?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    minYield?: number
    maxYield?: number
  }): Promise<EstateSimple[]> => {
    const response = await api.get<ApiResponse>("/estate/search", params)
    return response.data
  },

  // 부동산 등록 (중개인 전용)
  registerEstate: async (estateData: Omit<EstateDetail, "estateId" | "estateRegistrationDate">): Promise<EstateDetail> => {
    const response = await api.post<ApiResponse>("/estate/register", estateData)
    return response.data
  },

  // 부동산 정보 수정 (중개인 전용)
  updateEstate: async (estateId: number, estateData: Partial<EstateDetail>): Promise<EstateDetail> => {
    const response = await api.put<ApiResponse>(`/estate/${estateId}`, estateData)
    return response.data
  },

  // 부동산 가격 업데이트 (중개인 전용)
  updateEstatePrice: async (estateId: number, price: number): Promise<EstatePrice> => {
    const response = await api.post<ApiResponse>(`/estate/${estateId}/price`, { price })
    return response.data
  },

  // 거래 가능한 매물 리스트 조회
  getTradableEstates: async (): Promise<EstateSimple[]> => {
    console.log("거래 가능한 매물 리스트 API 호출")
    const res = await api.get<ApiResponse>("/estate")
    console.log("거래 가능한 매물 리스트 API 응답:", res.data)
    return res.data
  },

  // S3 파일 업로드
  uploadFileToS3: async (url: string, file: File): Promise<void> => {
    try {
      const contentType = file.type.toLowerCase()
      console.log("Uploading file:", {
        fileType: file.type,
        contentType: contentType,
        fileName: file.name,
        fileSize: file.size
      })

      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType
        }
      })

      if (!response.ok) {
        console.error("Upload failed with status:", response.status)
        console.error("Response:", await response.text())
        throw new Error(`Upload failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error("S3 upload error:", error)
      throw new Error("파일 업로드에 실패했습니다.")
    }
  },

  // 매물 등록용 S3 Presigned URL 요청
  getEstatePresignedUrls: async (
    estateAddress: string,
    imageFileType: string,
    subGuideFileType: string,
    securitiesReportFileType: string,
    investmentExplanationFileType: string,
    propertyMngContractFileType: string,
    appraisalReportFileType: string
  ): Promise<PresignedUrlResponse[]> => {
    try {
      const response = await api.post<ApiResponse>("/s3-presigned-url/estate", {
        estateAddress,
        imageFileType,
        subGuideFileType,
        securitiesReportFileType,
        investmentExplanationFileType,
        propertyMngContractFileType,
        appraisalReportFileType
      })
      if (!response || !response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server')
      }
      return response.data as PresignedUrlResponse[]
    } catch (error) {
      throw new Error('Failed to get estate presigned URLs')
    }
  }
}
