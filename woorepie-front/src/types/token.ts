export interface Token {
  id: string
  name: string
  price: number
  priceChange: number
}

export interface TokenHolding {
  id: string
  name: string
  quantity: number
  averagePrice: number
  investmentAmount: number
  currentValue: number
  dividendRate: number
}
