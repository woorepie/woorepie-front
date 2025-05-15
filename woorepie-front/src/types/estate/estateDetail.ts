export interface EstateDetail {
  estateId: number
  agentId: number
  agentName: string
  estateName: string
  estateState: string
  estateCity: string
  estateAddress: string
  estateLatitude: string
  estateLongitude: string
  tokenAmount: number
  estateDescription: string
  totalEstateArea: number
  tradedEstateArea: number
  subGuideUrl: string
  securitiesReportUrl: string
  investmentExplanationUrl: string
  propertyMngContractUrl: string
  appraisalReportUrl: string
  estateTokenPrice: number
  dividendYield: number
  estateRegistrationDate: Date
}
