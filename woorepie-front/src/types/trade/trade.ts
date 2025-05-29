export interface Trade {
  tradeTokenAmount: number
  tokenPrice: number
}

export interface BuyEstateRequest extends Trade {}

export interface SellEstateRequest extends Trade {}