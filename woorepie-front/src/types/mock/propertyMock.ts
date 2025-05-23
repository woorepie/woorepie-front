export interface Property {
  id: string
  name: string
  city: string
  district: string
  location: string
  address: string
  price: string
  tokenAmount: string
  tokenPrice: string
  tenant: string
  subscriptionPeriod: string
  availableTokens: string
  expectedYield: string
  targetPrice: string
  priceIncreaseRate: string
  registrationDate: string
  dividendRate: string
  balance: string
  image?: string
  latitude?: number // 위도 추가
  longitude?: number // 경도 추가
}
