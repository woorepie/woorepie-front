export interface SubscriptionList {
  estateId: number
  estateName: string
  agentName: string
  subStartDate: Date
  subEndDate?: Date
  estateState: string
  estateCity: string
  estateImageUrl: string
  tokenAmount: number
  estatePrice: number
  dividendYield?: number
  subState?: string
}
