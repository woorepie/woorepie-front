export interface SubscriptionDetail {
  estateId: number
  estateName: string
  agentId: number
  agentName: string
  subStartDate: Date
  subEndDate: Date
  estateAddress: string
  estateImageUrl: string
  estatePrice: number
  tokenAmount: number
  subTokenAmount: number
  investmentExplanationUrl: string
  propertyMngContractUrl: string
  appraisalReportUrl: string
  estateLatitude: number
  estateLongitude: number
}
