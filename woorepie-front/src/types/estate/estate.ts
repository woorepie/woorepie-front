export interface EstateSimple {
  estateId: number
  estateName: string
  estateState: string
  estateCity: string
  estateImageUrl: string
  dividendYield: number
  tokenAmount: number
  estateTokenPrice: number
  estateRegistrationDate: string  // LocalDateTime은 string으로 받습니다
}
