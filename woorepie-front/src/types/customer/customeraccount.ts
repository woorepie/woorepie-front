export interface CustomerAccount {
    accountId: number
    estateId: number
    estateName: string
    accountTokenAmount: number
    accountTokenPrice: number
    estateTokenPrice: number
    estatePrice: string // BigDecimal을 string으로 처리
  }