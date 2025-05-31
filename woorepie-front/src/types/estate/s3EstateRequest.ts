export interface S3EstateRequest {
  estateAddress: string
  imageFileType: string
  subGuideFileType: string
  securitiesReportFileType: string
  investmentExplanationFileType: string
  propertyMngContractFileType: string
  appraisalReportFileType: string
}

export interface S3UrlResponse {
  url: string
} 