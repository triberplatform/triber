

export interface signUpPayload {

  email: string,
  firstName: string,
  lastName: string,
  password: string,
  companyName: string

}

export interface User {
  id: string;
  firstName: string;
  email: string;
  // Add any other properties your `user` object has
}


export interface emailPayload {

  email: string,
  code: string,

}

export interface RegisterBusinessPayload {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessStatus: string;
  interestedIn: string;
  industry: string;
  businessStage: string;
  businessLegalEntity: string;
  description: string;
  reportedSales: string;
  numOfEmployees: string;
  yearEstablished: number;
  location: string;
  assets: string;
  logo: File | null;
};

export interface loginpayload {

  email: string,
  password: string,

}

export interface InvestorProfilePayload {
  email: string;
  companyName: string;
  phoneNumber:string;
  about: string;
  companyWebsiteUrl: string;
  companyType: string;
  location: string;
  interestedLocations: string[];
  designation: string;
  numOfExpectedDeals: string;
  fundsUnderManagement: string;
  interestedFactors: string[];
  termsOfAgreement: File | null;
  proofOfBusiness: File | null;
  logo: File | null;
}

export interface BusinessDetails {
  id: number;
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessLogoUrl: string;
  businessStatus: "OWNER" | "MEMBER" | "BROKER"; // Enum values
  interestedIn: "FULL_SALE_OF_BUSINESS" | "PARTIAL_STAKE" | "LOAN" | "SELL_OR_LEASE_OF_BUSINESS_ASSETS"; // Enum values
  industry: "IT" | "FINANCE" | "HEALTH" | "EDUCATION" | "MEDIA" | "OTHER"; // Enum values
  numOfEmployees: "LESS_THAN_10" | "BETWEEN_10_AND_50" | "BETWEEN_50_AND_100" | "BETWEEN_100_AND_500" | "BETWEEN_500_AND_1000" | "OVER_1000"; // Enum values
  yearEstablished: number;
  location: string;
  description: string;
  assets: string;
  reportedSales: string;
  businessStage: "SME" | "Startup";
  businessLegalEntity: "PRIVATE_LIABILITY_COMPANY" | "LIMITED_LIABILITY_COMPANY" | "PUBLIC_LIMITED_COMPANY" | "GENERAL_PARTNERSHIP" | "SOLE_PROPRIETORSHIP"; // Enum values
  createdAt: string; 
  updatedAt: string; 
  assignedAt: string; 
  dealRoomDetails: DealRoomDetails | null;
  fundabilityTestDetails: FundabilityTestDetails;
}

export interface DealRoomDetails {
  // Identification
  id: number;
  publicId: string;
  businessId: string;

  // Business Description
  topSellingProducts: string;
  highlightsOfBusiness: string;
  reasonForSale: string;

  // Financial Information
  averageMonthlySales: number;
  reportedYearlySales: number;
  profitMarginPercentage: number;
  tentativeSellingPrice: number;
  valueOfPhysicalAssets: number;

  // Operational Details
  facilityDetails: string;
  fundingDetails: string;
  assetsDetails: string;

  // Documentation and Media
  businessPhotos: string[];
  proofOfBusiness: string;
  businessDocuments: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
export interface FundabilityTestDetails {
  publicId: string;
  score: number;
}

export interface UserDetails {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  companyname: string;
  emailVerified: boolean;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  businesses: BusinessDetails[];
  investorProfile: InvestorProfile;
}

export interface ProposalPayload {
  businessId: string;
  message: string;

}

export interface ProposalPayloadBusiness {
  businessId: string;
  message: string;
  investorId: string;
}


export interface InvestorProfile {
  id: number;
  email: string;
  phoneNumber: string;
  companyName: string;
  companyLogoUrl: string;
  publicId: string;
  about: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealRoomData {
  topSellingProducts: string[] | string;
  highlightsOfBusiness?: string;
  facilityDetails?: string;
  fundingDetails?: string;
  averageMonthlySales?: number;
  reportedYearlySales?: number;
  profitMarginPercentage?: number;
  tentativeSellingPrice?: number;
  assetsDetails: string[] | string;
  valueOfPhysicalAssets?: number;
  reasonForSale?: string;
  businessPhotos?: string[] | null;
  proofOfBusiness?: string | null;
  businessDocuments?: string[] | null;
}
export interface ValuationFormPayload {
  businessId: string;
  topSellingProducts: string[] | string;
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: number;
  reportedYearlySales: number;
  profitMarginPercentage: number;
  tentativeSellingPrice: number;
  assetsDetails: string[] | string;
  valueOfPhysicalAssets: number;
  reasonForSale: string;
  businessPhotos: File[] | null;
  proofOfBusiness: File | null;
  businessDocuments: File[] | null;
}

export interface FundabilityPayload {
  registeredCompany: boolean | string;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean | string;
  startupStage: string;

  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean | string;
  isicActivity: string;
  legalAdvisors: string[];

  averageAnnualRevenue: number;
  revenueGrowthRate: number;
  auditedFinancialStatement: boolean | string;
  companyPitchDeck: boolean | string;
  companyBusinessPlan: boolean | string;
  company5yearCashFlow: boolean | string;
  companySolidAssetHolding: boolean | string;
  companyLargeInventory: boolean | string;
  company3YearProfitable: boolean | string;
  companyHighScalibilty: boolean | string;
  companyCurrentLiabilities: boolean | string;
  ownerCurrentLiabilities: boolean | string;

  certificateOfIncorporation: File | null;
  memorandumOfAssociation: File | null;
  statusReport: File | null;
  letterOfGoodStanding: File | null;
  companyLiabilitySchedule: File | null;
  businessPlan: File | null;
  financialStatements: File | null;
  relevantLicenses: File | null;
  businessId: string;
}

export interface StartupFundabilityPayload {
  registeredCompany: boolean | string;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean | string;
  startupStage: string;
  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean | string;
  isicActivity: string;
  legalAdvisors: string[];
  customerAcquisitionCost: number;
  totalAddressableMarket: number;
  licensesToOperate: boolean | string;
  customerLifetimeValue: number;
  expectedAnnualGrowthRate: number;
  companyPitchDeck: boolean | string;
  companyBusinessPlan: boolean | string;
  company5yearCashFlow: boolean | string;
  companySolidAssetHolding: boolean | string;
  companyLargeInventory: boolean | string;
  company3YearProfitable: boolean | string;
  companyHighScalibilty: boolean | string;
  companyCurrentLiabilities: boolean | string;
  ownerCurrentLiabilities: boolean | string;
  certificateOfIncorporation: File | null;
  memorandumOfAssociation: File | null;
  statusReport: File | null;
  letterOfGoodStanding: File | null;
  companyLiabilitySchedule: File | null;
  businessPlan: File | null;
  financialStatements: File | null;
  relevantLicenses: File | null;
  pitchDeck:File | null;
  businessId: string;
}

export type ConnectFormValues = {
  businessName: string;
  businessRegistration: string;
  annualTurnOver: number;
  fundingRequirement: number;
  description: string;
  contactEmail: string;
};

export type JobConnectForm = {
  fullName: string;
  email: string;
  phone: number;
  yearsOfExperience: number;
  resume: File | null;
  coverLetter: string;
  jobId: string
}

export type JobListing = {
  id: number;
  publicId: string;
  title: string;
  description: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN"; // Add other job types as needed
  salary: string;
  createdAt: string;
  updatedAt: string;
};

export interface CompanyDocs {
  pitchDeck: string;
  businessPlan: string;
  statusReport: string;
  relevantLicenses: string;
  financialStatements: string;
  letterOfGoodStanding: string;
  memorandumOfAssociation: string;
  companyLiabilitySchedule: string;
  certificateOfIncorporation: string;
}

export interface CompanyData {
  id: number;
  userId: number;
  publicId: string;
  score: number;
  businessId: string;
  registeredCompany: boolean;
  legalName: string;
  companyRegistration: string;
  city: string;
  country: string;
  industry: string;
  registeredAddress: string;
  companyEmail: string;
  contactNumber: string;
  principalAddress: string;
  applicantsAddress: string;
  position: string;
  title: string;
  yearsOfOperation: number;
  companySize: number;
  companyLegalCases: boolean;
  startupStage: string;
  ownership: string[];
  executiveManagement: string[];
  boardOfDirectors: string[];
  isicIndustry: boolean;
  isicActivity: string;
  legalAdvisors: string[];
  averageAnnualRevenue: number;
  revenueGrowthRate: number;
  auditedFinancialStatement: boolean;
  companyPitchDeck: boolean;
  companyBusinessPlan: boolean;
  company5yearCashFlow: boolean;
  companySolidAssetHolding: boolean;
  companyLargeInventory: boolean;
  company3YearProfitable: boolean;
  companyHighScalibilty: boolean;
  companyCurrentLiabilities: boolean;
  ownerCurrentLiabilities: boolean;
  docs: CompanyDocs;
  createdAt: string;
  updatedAt: string;
}


export interface Investor {
  companyName: string;
  email: string;
  companyLogoUrl: string;
}

export interface Proposal {
  id: number;
  publicId: string;
  businessId: string;
  investorId: string;
  buyingPrice: number | null;
  sellingPrice: number | null;
  fundingAmount: number | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  proposal: string;
  createdAt: string;
  updatedAt: string;
  investor: Investor;
}

export interface ProposalResponse {
  success: boolean;
  message: string;
  data: Proposal[];
}

export type DealRoomProfile = {
  id: number;
  publicId: string;
  businessId: string;
  topSellingProducts: string[] | string;
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: number;
  reportedYearlySales: number;
  profitMarginPercentage: number;
  assetsDetails: string[] | string;
  valueOfPhysicalAssets: number;
  tentativeSellingPrice: number;
  reasonForSale: string;
  businessPhotos: string[];
  proofOfBusiness: string; // Changed from array to string
  businessDocuments: string[];
  createdAt: string;
  updatedAt: string;
  business: Business;
};

export type Business = {
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
};



// New type for the business details from direct API call
export type BusinessDetailsAPI = {
  id: number;
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessLogoUrl: string;
  businessStatus: string;
  interestedIn: string;
  industry: string;
  numOfEmployees: string;
  yearEstablished: number;
  location: string;
  description: string;
  assets: string;
  reportedSales: string;
  businessStage: string;
  businessLegalEntity: string;
  createdAt: string;
  updatedAt: string;
  businessVerificationStatus: boolean;
  fundabilityTestDetails?: {
    id: number;
    score: number;
    publicId?: string;
  };
};

export interface Investor {
  id: number;
  publicId: string;
  userId: number;
  email: string;
  phoneNumber: string | null;
  companyName: string;
  about: string;
  companyLogoUrl: string;
  companyWebsiteUrl: string;
  termsOfAgreementDocUrl: string;
  proofOfBusinessDocUrl: string;
  location: string;
  interestedLocations: string; 
  designation: string;
  numOfExpectedDeals: string[];
  companyType: string[];
  interestedFactors: string; 
  fundsUnderManagement: number;
  createdAt: string; 
  updatedAt: string; 
}

export interface FundType {

    id: number;
    userId: number;
    publicId: string;
    score: number;
    businessId: string;
    
    // Company information
    registeredCompany: boolean;
    legalName: string;
    companyRegistration: string;
    city: string;
    country: string;
    industry: string;
    registeredAddress: string;
    companyEmail: string;
    contactNumber: string;
    principalAddress: string;
    applicantsAddress: string;
    
    // Position information
    position: string;
    title: string;
    
    // Business metrics
    yearsOfOperation: number;
    companySize: number;
    companyLegalCases: boolean;
    startupStage: string;
    
    // People and organization
    ownership: string[];
    executiveManagement: string[];
    boardOfDirectors: string[];
    isicIndustry: boolean;
    isicActivity: string;
    legalAdvisors: string[];
    
    // Financial metrics
    averageAnnualRevenue?: number; // Optional as it appears in only one example
    revenueGrowthRate?: number; // Optional as it appears in only one example
    totalAddressableMarket?: number; // Optional as it appears in only one example
    customerLifetimeValue?: number; // Optional as it appears in only one example
    customerAcquisitionCost?: number; // Optional as it appears in only one example
    expectedAnnualGrowthRate?: number; // Optional as it appears in only one example
    
    // Compliance and documentation status
    auditedFinancialStatement?: boolean; // Optional as it appears in only one example
    licensesToOperate?: boolean; // Optional as it appears in only one example
    companyPitchDeck: boolean;
    companyBusinessPlan: boolean;
    company5yearCashFlow: boolean;
    companySolidAssetHolding: boolean;
    companyLargeInventory: boolean;
    company3YearProfitable: boolean;
    companyHighScalibilty: boolean; // Note: Potential typo in field name (scalibility)
    companyCurrentLiabilities: boolean;
    ownerCurrentLiabilities: boolean;
    
    // Documents
    docs: CompanyDocs;
    
    // Timestamps
    createdAt: string;
    updatedAt: string;
  
}