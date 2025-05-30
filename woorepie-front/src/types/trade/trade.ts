export interface Trade {
  estateId: number; 
  tradeTokenAmount: number;
  tokenPrice: number;
}

export interface BuyEstateRequest extends Trade {}
export interface SellEstateRequest extends Trade {}

export interface RedisCustomerTradeValue {
  estateId: number
  estateName: string
  tradeTokenAmount: number
  tokenPrice: number
  timestamp: string
}
