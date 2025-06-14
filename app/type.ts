

export interface signUpPayload {

  email: string,
  firstName: string,
  lastName: string,
  password: string,
  companyName: string
  confirmPassword?: string

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
export interface resendPayload {

  email: string,


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
  phoneNumber: string;
  about: string;
  companyWebsiteUrl: string;
  preferredIndustry: string;
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
  interestedIn: "FULL_SALE_OF_BUSINESS" | "EQUITY_INVESTMENT" | "LOAN" | "SELL_OR_LEASE_OF_BUSINESS_ASSETS"; // Enum values
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
  businessVerificationStatus: boolean
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
  buyingPrice?: number | null

}

export interface ProposalPayloadBusiness {
  businessId: string;
  message: string;
  investorId: string;
  buyingPrice?: number | null

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
  fundingAmount: number;
  fundingStructure: string;
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
  pitchDeck: File | null;
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
  business?: BusinessP
}

interface BusinessP {
  dealRoomDetails: Tentative
}
interface Tentative {
  tentativeSellingPrice: string
  publicId?: string
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
  fundingStructure: string;
  fundingAmount: number;
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
  interestedLocations: string[];
  designation: string;
  numOfExpectedDeals: string[];
  companyType: string[];
  interestedFactors: string[];
  fundsUnderManagement: number;
  preferredIndustry: string;
  createdAt: string;
  updatedAt: string;
}

export interface changePasswordPayload {
  email: string;
  newPassword: string
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


export enum Industry {
  AGRICULTURE = "AGRICULTURE",
  AUTOMOTIVE_AUTO_BODY = "AUTOMOTIVE_AUTO_BODY",
  AUTOMOTIVE_REPAIR_PARTS_SERVICES = "AUTOMOTIVE_REPAIR_PARTS_SERVICES",
  AUTOMOTIVE_DEALERS = "AUTOMOTIVE_DEALERS",
  AUTOMOTIVE_CAR_WASH = "AUTOMOTIVE_CAR_WASH",
  AUTOMOTIVE_GASOLINE_SERVICE_STATIONS = "AUTOMOTIVE_GASOLINE_SERVICE_STATIONS",
  AUTOMOTIVE_WRECKING_YARD = "AUTOMOTIVE_WRECKING_YARD",
  CONSTRUCTION_BUILDING = "CONSTRUCTION_BUILDING",
  CONSTRUCTION_HEAVY = "CONSTRUCTION_HEAVY",
  CONSTRUCTION_SPECIAL_TRADES = "CONSTRUCTION_SPECIAL_TRADES",
  ENTERTAINMENT_FILM_PRODUCTION = "ENTERTAINMENT_FILM_PRODUCTION",
  HEALTHCARE_MEDICAL_DENTAL = "HEALTHCARE_MEDICAL_DENTAL",
  HEALTHCARE_PRODUCTS_SUPPLIES = "HEALTHCARE_PRODUCTS_SUPPLIES",
  HEALTHCARE_TRANSPORTATION = "HEALTHCARE_TRANSPORTATION",
  HEALTHCARE_PHARMACIES_DRUG_STORES = "HEALTHCARE_PHARMACIES_DRUG_STORES",
  MANUFACTURING_APPAREL_FABRICS = "MANUFACTURING_APPAREL_FABRICS",
  MANUFACTURING_AVIATION_AEROSPACE = "MANUFACTURING_AVIATION_AEROSPACE",
  MANUFACTURING_CHEMICALS = "MANUFACTURING_CHEMICALS",
  MANUFACTURING_ELECTRONIC_ELECTRICAL = "MANUFACTURING_ELECTRONIC_ELECTRICAL",
  MANUFACTURING_FABRICATED_METAL = "MANUFACTURING_FABRICATED_METAL",
  MANUFACTURING_FOOD_PRODUCTS = "MANUFACTURING_FOOD_PRODUCTS",
  MANUFACTURING_FURNITURE_FIXTURES = "MANUFACTURING_FURNITURE_FIXTURES",
  MANUFACTURING_INDUSTRIAL_MACHINERY = "MANUFACTURING_INDUSTRIAL_MACHINERY",
  MANUFACTURING_LEATHER_PRODUCTS = "MANUFACTURING_LEATHER_PRODUCTS",
  MANUFACTURING_LUMBER_WOOD = "MANUFACTURING_LUMBER_WOOD",
  MANUFACTURING_MEASURING_INSTRUMENTS = "MANUFACTURING_MEASURING_INSTRUMENTS",
  MANUFACTURING_MISCELLANEOUS = "MANUFACTURING_MISCELLANEOUS",
  MANUFACTURING_PAPER_PRODUCTS = "MANUFACTURING_PAPER_PRODUCTS",
  MANUFACTURING_PERSONAL_CARE = "MANUFACTURING_PERSONAL_CARE",
  MANUFACTURING_PETROLEUM_REFINING = "MANUFACTURING_PETROLEUM_REFINING",
  MANUFACTURING_PRIMARY_METAL = "MANUFACTURING_PRIMARY_METAL",
  MANUFACTURING_PRINTING_PUBLISHING = "MANUFACTURING_PRINTING_PUBLISHING",
  MANUFACTURING_RUBBER_PLASTIC = "MANUFACTURING_RUBBER_PLASTIC",
  MANUFACTURING_STONE_CLAY_GLASS = "MANUFACTURING_STONE_CLAY_GLASS",
  MANUFACTURING_TEXTILE = "MANUFACTURING_TEXTILE",
  MANUFACTURING_TOBACCO = "MANUFACTURING_TOBACCO",
  MANUFACTURING_TRANSPORTATION_EQUIPMENT = "MANUFACTURING_TRANSPORTATION_EQUIPMENT",
  MANUFACTURING_VINYL_PRODUCTS = "MANUFACTURING_VINYL_PRODUCTS",
  MINING = "MINING",
  RESTAURANTS_BARS_TAVERNS = "RESTAURANTS_BARS_TAVERNS",
  RESTAURANTS_COFFEE_SHOP = "RESTAURANTS_COFFEE_SHOP",
  RESTAURANTS_OTHER_EATING_DRINKING = "RESTAURANTS_OTHER_EATING_DRINKING",
  RESTAURANTS_RESTAURANT = "RESTAURANTS_RESTAURANT",
  RETAIL_ATM_MACHINES = "RETAIL_ATM_MACHINES",
  RETAIL_APPAREL_ACCESSORY = "RETAIL_APPAREL_ACCESSORY",
  RETAIL_BEAUTY_SUPPLIES = "RETAIL_BEAUTY_SUPPLIES",
  RETAIL_BICYCLE_SHOP = "RETAIL_BICYCLE_SHOP",
  RETAIL_BUILDING_MATERIALS_HOME_GARDEN = "RETAIL_BUILDING_MATERIALS_HOME_GARDEN",
  RETAIL_CELL_PHONES = "RETAIL_CELL_PHONES",
  RETAIL_COIN_LAUNDRY = "RETAIL_COIN_LAUNDRY",
  RETAIL_CONVENIENCE_STORES = "RETAIL_CONVENIENCE_STORES",
  RETAIL_FLORIST_GIFTS = "RETAIL_FLORIST_GIFTS",
  RETAIL_FURNITURE = "RETAIL_FURNITURE",
  RETAIL_GENERAL_MERCHANDISE = "RETAIL_GENERAL_MERCHANDISE",
  RETAIL_GYM_FITNESS = "RETAIL_GYM_FITNESS",
  RETAIL_HOME_FURNISHINGS = "RETAIL_HOME_FURNISHINGS",
  RETAIL_JEWELRY_DESIGN_SALES = "RETAIL_JEWELRY_DESIGN_SALES",
  RETAIL_LIQUOR_STORES = "RETAIL_LIQUOR_STORES",
  RETAIL_MARINE_DEALERS_EQUIPMENT = "RETAIL_MARINE_DEALERS_EQUIPMENT",
  RETAIL_MISCELLANEOUS = "RETAIL_MISCELLANEOUS",
  RETAIL_FOOD_STORES = "RETAIL_FOOD_STORES",
  RETAIL_PET_SHOPS_SUPPLIES = "RETAIL_PET_SHOPS_SUPPLIES",
  RETAIL_POSTAL_CENTERS = "RETAIL_POSTAL_CENTERS",
  RETAIL_SUPERMARKETS = "RETAIL_SUPERMARKETS",
  RETAIL_TOBACCO_PRODUCTS = "RETAIL_TOBACCO_PRODUCTS",
  RETAIL_VENDING_MACHINES = "RETAIL_VENDING_MACHINES",
  RETAIL_VIDEO_RENTALS = "RETAIL_VIDEO_RENTALS",
  SERVICES_ACCOUNTING = "SERVICES_ACCOUNTING",
  SERVICES_AGENTS_BROKERS = "SERVICES_AGENTS_BROKERS",
  SERVICES_AMUSEMENT_RECREATION = "SERVICES_AMUSEMENT_RECREATION",
  SERVICES_BEAUTY_BARBER = "SERVICES_BEAUTY_BARBER",
  SERVICES_BUSINESS = "SERVICES_BUSINESS",
  SERVICES_COMPUTER_SOFTWARE = "SERVICES_COMPUTER_SOFTWARE",
  SERVICES_DRY_CLEANING_LAUNDRY = "SERVICES_DRY_CLEANING_LAUNDRY",
  SERVICES_EDUCATIONAL = "SERVICES_EDUCATIONAL",
  SERVICES_ENGINEERING = "SERVICES_ENGINEERING",
  SERVICES_FINANCE_BANKING_LOANS = "SERVICES_FINANCE_BANKING_LOANS",
  SERVICES_FREIGHT_MOVING = "SERVICES_FREIGHT_MOVING",
  SERVICES_HOTELS_LODGING = "SERVICES_HOTELS_LODGING",
  SERVICES_IT = "SERVICES_IT",
  SERVICES_INSURANCE = "SERVICES_INSURANCE",
  SERVICES_JANITORIAL_CARPET_CLEANING = "SERVICES_JANITORIAL_CARPET_CLEANING",
  SERVICES_JEWELRY_REPAIR = "SERVICES_JEWELRY_REPAIR",
  SERVICES_LANDSCAPING_YARD = "SERVICES_LANDSCAPING_YARD",
  SERVICES_LEGAL = "SERVICES_LEGAL",
  SERVICES_LOCAL_PASSENGER_TRANSPORTATION = "SERVICES_LOCAL_PASSENGER_TRANSPORTATION",
  SERVICES_MAGAZINE = "SERVICES_MAGAZINE",
  SERVICES_MARINE_REPAIR = "SERVICES_MARINE_REPAIR",
  SERVICES_MEDIA_COMMUNICATIONS_ADVERTISING = "SERVICES_MEDIA_COMMUNICATIONS_ADVERTISING",
  SERVICES_MEMBERSHIP_ORGANIZATIONS = "SERVICES_MEMBERSHIP_ORGANIZATIONS",
  SERVICES_MISCELLANEOUS_REPAIR = "SERVICES_MISCELLANEOUS_REPAIR",
  SERVICES_MUSEUMS_ART_GALLERIES = "SERVICES_MUSEUMS_ART_GALLERIES",
  SERVICES_OTHER_BUSINESS = "SERVICES_OTHER_BUSINESS",
  SERVICES_OTHER_MISCELLANEOUS = "SERVICES_OTHER_MISCELLANEOUS",
  SERVICES_OTHER_PERSONAL = "SERVICES_OTHER_PERSONAL",
  SERVICES_OTHER_TRAVEL_TRANSPORTATION = "SERVICES_OTHER_TRAVEL_TRANSPORTATION",
  SERVICES_PET_CARE_GROOMING = "SERVICES_PET_CARE_GROOMING",
  SERVICES_SOCIAL = "SERVICES_SOCIAL",
  SERVICES_STAFFING = "SERVICES_STAFFING",
  SERVICES_STORAGE_WAREHOUSING = "SERVICES_STORAGE_WAREHOUSING",
  SERVICES_TANNING_SALONS = "SERVICES_TANNING_SALONS",
  SERVICES_TRAVEL_AGENCIES = "SERVICES_TRAVEL_AGENCIES",
  SOFTWARE_TECHNOLOGY_B2B = "SOFTWARE_TECHNOLOGY_B2B",
  SOFTWARE_TECHNOLOGY_B2C = "SOFTWARE_TECHNOLOGY_B2C",
  SOFTWARE_TECHNOLOGY_DOMAIN_WEBSITE = "SOFTWARE_TECHNOLOGY_DOMAIN_WEBSITE",
  SOFTWARE_TECHNOLOGY_GENERAL_INTERNET = "SOFTWARE_TECHNOLOGY_GENERAL_INTERNET",
  SOFTWARE_TECHNOLOGY_ISP_ASP = "SOFTWARE_TECHNOLOGY_ISP_ASP",
  SOFTWARE_TECHNOLOGY_SOFTWARE = "SOFTWARE_TECHNOLOGY_SOFTWARE",
  SOFTWARE_TECHNOLOGY_WEB_DESIGN = "SOFTWARE_TECHNOLOGY_WEB_DESIGN",
  UTILITIES = "UTILITIES",
  WHOLESALE_DISTRIBUTION_DURABLE = "WHOLESALE_DISTRIBUTION_DURABLE",
  WHOLESALE_DISTRIBUTION_NON_DURABLE = "WHOLESALE_DISTRIBUTION_NON_DURABLE",
  ECOMMERCE = "ECOMMERCE",
  OTHER = "OTHER"
}




export enum Plans {
  BASIC = "BASIC",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
  UNLIMITED = "UNLIMITED"
}

export enum BillingCycle {
  THREE_MONTHS = "THREE_MONTHS",
  EIGHT_MONTHS = "EIGHT_MONTHS",
  ONE_YEAR = "ONE_YEAR",
  FOREVER = "FOREVER"
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: {
      id: number;
      publicId: string;
      userId: number;
      plan: string;
      status: string;
      amount: string;
      currency: string;
      billingCycle: string;
      startDate: string;
      endDate: string | null;
      autoRenew: boolean;
      createdAt: string;
      updatedAt: string;
      user: {
        email: string;
        firstname: string;
        lastname: string;
      };
    };
    paymentUrl: string;
    reference: string;
  };
}
export interface subscribePayload {
  amount: number;
  plan: Plans;
  billingCycle: BillingCycle;

}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    publicId: string;
    userId: number;
    plan: string;
    status: string;
    amount: string;
    currency: string;
    billingCycle: string;
    startDate: string;
    endDate: string | null;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      email: string;
      firstname: string;
      lastname: string;
    };
  };
}