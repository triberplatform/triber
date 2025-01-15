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

export interface RegisterBusinessPayload  {
    businessName: string;
    businessPhone: string;
    businessEmail: string;
    businessStatus: string;
    interestedIn: string;
    industry: string;
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

export interface BusinessDetails {
    id: number;
    businessLogo: string;
    publicId: string;
    businessName: string;
    businessEmail: string;
    businessPhone: string;
    businessStatus: "OWNER" | "MEMBER" | "BROKER"; // Enum values
    interestedIn: "FULL_SALE_OF_BUSINESS" | "PARTIAL_STAKE" | "LOAN" | "SELL_OR_LEASE_OF_BUSINESS_ASSETS"; // Enum values
    industry: "IT" | "FINANCE" | "HEALTH" | "EDUCATION" | "MEDIA" | "OTHER"; // Enum values
    numOfEmployees: "LESS_THAN_10" | "BETWEEN_10_AND_50" | "BETWEEN_50_AND_100" | "BETWEEN_100_AND_500" | "BETWEEN_500_AND_1000" | "OVER_1000"; // Enum values
    yearEstablished: number;
    location: string;
    description: string;
    assets: string;
    reportedSales: string;
    businessLegalEntity: "PRIVATE_LIABILITY_COMPANY" | "LIMITED_LIABILITY_COMPANY" | "PUBLIC_LIMITED_COMPANY" | "GENERAL_PARTNERSHIP" | "SOLE_PROPRIETORSHIP"; // Enum values
    createdAt: string; // ISO string format
    updatedAt: string; // ISO string format
    assignedAt: string; // ISO string format
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

    certificateOfIncorporation: File | null ;
    memorandumOfAssociation: File| null;
    statusReport: File |null;
    letterOfGoodStanding: File | null;
    companyLiabilitySchedule:File | null;
    businessPlan:File | null;
    financialStatements: File | null;
    relevantLicenses:File | null;
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

  export type JobConnectForm={
    fullName: string;
    email: string;
    phone: number;
    yearsOfExperience: number;
    resume: File | null;
    coverLetter: string;
    jobId:string
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
  