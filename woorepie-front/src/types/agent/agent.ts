export interface AgentCompany {
  companyName: string
  businessNumber: string
  address: string
  addressDetail: string
  phone: string
  businessLicenseKey?: string
}

export interface AgentLogin {
  agentEmail: string
  agentPassword: string
  agentPhoneNumber: string
}

export interface AgentRepresentative {
  name: string
  email: string
  password: string
  phone: string
  powerOfAttorneyKey?: string
}

export interface AgentJoin {
  company: AgentCompany
  representative: AgentRepresentative
}

export interface AgentCreateRequest {
  agentName: string
  agentPhoneNumber: string
  agentEmail: string
  agentPassword: string
  agentDateOfBirth: string
  agentIdentificationUrlKey: string
  agentCertUrlKey: string
  businessName: string
  businessNumber: string
  businessAddress: string
  businessPhoneNumber: string
  warrantUrlKey: string
} 

export interface GetAgentResponse {
  agentId: number
  agentName: string
  agentPhoneNumber: string
  agentEmail: string
  agentDateOfBirth: string
  businessName: string
  businessNumber: string
  businessAddress: string
  businessPhoneNumber: string
}

export interface GetAgentEstateListResponse {
  estateId: number;
  estateName: string;
  tokenAmount: number;
  estateTokenPrice: number | null;
  dividendYield: string; // 서버에서 BigDecimal → 문자열로 반환
  estateStatus: string;  // e.g., 'READY', 'SUCCESS'
}


