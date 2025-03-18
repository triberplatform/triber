"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import {
  getABusiness,
  getFundabilityResultsSmeBusinessId,
  getFundabilityResultsStartupBusinessId,
  getValuatedBusiness,
} from "@/app/services/dashboard";
import Loading from "@/app/loading";
import { FundType } from "@/app/type";
import CircularProgress from "@/app/components/dashboard/Circular";
// Import icons for the fundability section
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { MdOutlinePermIdentity } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";

// Types for the API response
type Business = {
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
};

type DealRoomProfile = {
  id: number;
  publicId: string;
  businessId: string;
  topSellingProducts: string;
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: number;
  reportedYearlySales: number;
  profitMarginPercentage: number;
  assetsDetails: string;
  valueOfPhysicalAssets: number;
  tentativeSellingPrice: number;
  reasonForSale: string;
  businessPhotos: string[];
  proofOfBusiness: string[];
  businessDocuments: string[];
  createdAt: string;
  updatedAt: string;
  business: Business;
};

// New type for the business details from direct API call
type BusinessDetailsAPI = {
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

export default function BusinessDetail() {
  const SearchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const id = SearchParams.get("id");
  const businessId = SearchParams.get("businessId");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [businesses, setBusinesses] = useState<DealRoomProfile[]>([]);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetailsAPI | null>(null);
  const [fundabilityData, setFundabilityData] = useState<FundType | null>(null);
  const [fundabilityLoading, setFundabilityLoading] = useState(false);
  const [fundabilityFetched, setFundabilityFetched] = useState(false);

  // Fetch business details directly from API
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!id || !token) return;
      
      try {
        setLoading(true);
        const response = await getABusiness(token, businessId || "");
        
        if (response && response.success) {
          console.log("Business details fetched:", response.data);
          setBusinessDetails(response.data);
        } else {
          console.error("Failed to fetch business details:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessId, token]);

  const business = businesses.find((b) => b.publicId === id);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await getValuatedBusiness(token || "");
        if (response?.success) {
          setBusinesses(response.data);
        }
      } catch (error) {
        console.error("Unable to fetch businesses:", error);
      }
    };

    fetchBusinesses();
  }, [token]);
console.log(businessDetails?.businessStage)
  // Fetch fundability results 
  useEffect(() => {
    const fetchFundabilityResults = async () => {
      // Only fetch if we're viewing the fundability tab or haven't fetched yet
      if ((!fundabilityFetched || currentStep === 1) && businessDetails && id && businessId) {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        setFundabilityLoading(true);
        
        try {
          console.log("Fetching fundability data for business ID:", businessId);
          
          let response;
          
          // Check business stage and call appropriate API
          if (businessDetails.businessStage?.toLowerCase() === "startup") {
            response = await getFundabilityResultsStartupBusinessId(token, businessId);
          } else {
            // Default to SME if not startup or if stage is undefined
            response = await getFundabilityResultsSmeBusinessId(token, businessId);
          }
          
          if (response && response.success) {
            console.log("Fundability data fetched successfully:", response.data);
            setFundabilityData(response.data);
          } else {
            console.error('Failed to fetch fundability results:', response?.message);
          }
        } catch (error) {
          console.error('Error fetching fundability results:', error);
        } finally {
          setFundabilityLoading(false);
          setFundabilityFetched(true);
        }
      }
    };

    fetchFundabilityResults();
  }, [businessDetails, id, businessId, currentStep, fundabilityFetched]);

 
  if (loading) {
    return <Loading text="Loading" />;
  }

  if (!business) {
    return <Loading/>;
  }

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-mainBlack rounded-lg shadow-lg">
            {/* Business Logo and Name Banner */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between space-x-6">
                <div className="flex items-center space-x-6">
                  {" "}
                  <div className="relative">
                    <Image
                      src={business.businessPhotos[0]}
                      width={100}
                      height={100}
                      alt="business logo"
                      className="rounded-lg object-cover w-[100px] h-[100px]"
                    />
                    <div className="absolute -bottom-3 -right-3">
                      <button className="bg-mainBlack p-2 rounded-full hover:bg-mainBlack transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-white mb-2">
                      {business.business.businessName}
                    </h1>
                    <p className="text-gray-400 text-sm max-w-2xl">
                      {business.highlightsOfBusiness}
                    </p>
                  </div>
                </div>
                <Link
                  href={`proposal?id=${business.businessId}`}
                  className="bg-mainGreen text-white px-6 py-2 text-xs text-nowrap rounded-lg font-medium hover:bg-mainGreens transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Submit Proposal
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Company Info Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-mainGreen mb-4">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Business Name</p>
                    <p className="text-white">
                      {business.business.businessName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Email Address</p>
                    <p className="text-red-500">Available after connection</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Phone Number</p>
                    <p className="text-red-500">Available after connection</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Location</p>
                    <p >{businessDetails?.location}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Industry</p>
                    <p>{businessDetails?.industry}</p>
                  </div>
                </div>
              </div>

              {/* Business Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-mainGreen mb-4">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">
                      Top Selling Products
                    </p>
                    <p className="text-white">{business.topSellingProducts}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Facility Details</p>
                    <p className="text-white">{business.facilityDetails}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Business Highlights</p>
                    <p className="text-white">
                      {business.highlightsOfBusiness}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-mainGreen mb-4">
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Monthly Sales</p>
                    <p className="text-white">
                      ${business.averageMonthlySales.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Yearly Sales</p>
                    <p className="text-white">
                      ${business.reportedYearlySales.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Profit Margin</p>
                    <p className="text-white">
                      {business.profitMarginPercentage}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">
                      Physical Assets Value
                    </p>
                    <p className="text-white">
                      ${business.valueOfPhysicalAssets.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Asking Price</p>
                    <p className="text-white">
                      ${business.tentativeSellingPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-medium text-mainGreen mb-4">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Reason for Sale</p>
                    <p className="text-white">{business.reasonForSale}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Asset Details</p>
                    <p className="text-white">{business.assetsDetails}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="lg:bg-mainBlack p-4 pb-8 h-full">
            {fundabilityLoading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <p>Loading fundability data...</p>
              </div>
            ) : fundabilityData ? (
              <div className="bg-mainBlack rounded-lg p-6 shadow-lg">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-semibold mb-2">Fundability Overview</h2>
                    <p className="text-gray-400 text-sm">
                      Last updated: {new Date(fundabilityData.updatedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <div className="bg-zinc-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <p className="text-xs text-gray-400">Fundability Score</p>
                          <p className="text-2xl font-bold">{fundabilityData.score}/100</p>
                        </div>
                        <CircularProgress value={fundabilityData.score} />
                      </div>
                    </div>
                  </div>
                </div>
      
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    {/* Company Overview */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <MdOutlinePermIdentity className="text-mainGreen mr-2" /> 
                        Company Overview
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Legal Name</p>
                              <p className="text-sm">Available after Connection</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Registration</p>
                              <p className="text-sm">{fundabilityData.companyRegistration || businessDetails?.businessLegalEntity}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">Years of Operation</p>
                              <p className="text-sm">{fundabilityData.yearsOfOperation || (businessDetails ? (new Date().getFullYear() - businessDetails.yearEstablished) : 0)} years</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Company Size</p>
                              <p className="text-sm">{fundabilityData.companySize || businessDetails?.numOfEmployees} employees</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400">Industry</p>
                            <p className="text-sm">{fundabilityData.industry || businessDetails?.industry}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm">{fundabilityData.city && fundabilityData.country ? 
                              `${fundabilityData.city}, ${fundabilityData.country}` : 
                              businessDetails?.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    {/* Business Structure */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <LiaIndustrySolid className="text-mainGreen mr-2" /> 
                        Business Structure
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="space-y-4">
                          {fundabilityData.ownership && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Ownership</p>
                              <div className="space-y-1">
                                {Array.isArray(fundabilityData.ownership) ? 
                                  fundabilityData.ownership.map((owner, index) => (
                                    <div key={index} className="flex items-center">
                                      <div className="w-2 h-2 bg-mainGreen rounded-full mr-2"></div>
                                      <p className="text-sm">{owner}</p>
                                    </div>
                                  )) : 
                                  <p className="text-sm">Information not available</p>
                                }
                              </div>
                            </div>
                          )}
                          
                          {fundabilityData.executiveManagement && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Executive Management</p>
                              <div className="space-y-1">
                                {Array.isArray(fundabilityData.executiveManagement) ? 
                                  fundabilityData.executiveManagement.map((exec, index) => (
                                    <div key={index} className="flex items-center">
                                      <div className="w-2 h-2 bg-mainGreen rounded-full mr-2"></div>
                                      <p className="text-sm">{exec}</p>
                                    </div>
                                  )) :
                                  <p className="text-sm">Information not available</p>
                                }
                              </div>
                            </div>
                          )}
      
                          {businessDetails?.businessStage?.toLowerCase() === "startup" && fundabilityData.startupStage && (
                            <div>
                              <p className="text-xs text-gray-400">Startup Stage</p>
                              <p className="text-sm capitalize">{fundabilityData.startupStage}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
      
                  {/* Right Column */}
                  <div>
                    {/* Financial Health */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FaCalendarAlt className="text-mainGreen mr-2" /> 
                        Financial Health
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="space-y-4">
                          {businessDetails?.businessStage?.toLowerCase() !== "startup" && (
                            <div>
                              <p className="text-xs text-gray-400">Average Annual Revenue</p>
                              <p className="text-sm">${fundabilityData.averageAnnualRevenue?.toLocaleString() || 'Not provided'}</p>
                            </div>
                          )}
      
                          {businessDetails?.businessStage?.toLowerCase() !== "startup" && fundabilityData.revenueGrowthRate !== undefined && (
                            <div>
                              <p className="text-xs text-gray-400">Revenue Growth Rate</p>
                              <p className="text-sm">{fundabilityData.revenueGrowthRate}%</p>
                            </div>
                          )}
      
                          {businessDetails?.businessStage?.toLowerCase() === "startup" && fundabilityData.expectedAnnualGrowthRate !== undefined && (
                            <div>
                              <p className="text-xs text-gray-400">Expected Annual Growth Rate</p>
                              <p className="text-sm">{fundabilityData.expectedAnnualGrowthRate}%</p>
                            </div>
                          )}
      
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">Profitable (3+ Years)</p>
                              <p className={`text-sm ${fundabilityData.company3YearProfitable ? 'text-mainGreen' : 'text-gray-400'}`}>
                                {fundabilityData.company3YearProfitable ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">High Scalability</p>
                              <p className={`text-sm ${fundabilityData.companyHighScalibilty ? 'text-mainGreen' : 'text-gray-400'}`}>
                                {fundabilityData.companyHighScalibilty ? 'Yes' : 'No'}
                              </p>
                            </div>
                          </div>
      
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">Solid Asset Holdings</p>
                              <p className={`text-sm ${fundabilityData.companySolidAssetHolding ? 'text-mainGreen' : 'text-gray-400'}`}>
                                {fundabilityData.companySolidAssetHolding ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">Current Liabilities</p>
                              <p className={`text-sm ${!fundabilityData.companyCurrentLiabilities ? 'text-mainGreen' : 'text-gray-400'}`}>
                                {fundabilityData.companyCurrentLiabilities ? 'Yes' : 'No'}
                              </p>
                            </div>
                          </div>
      
                          {businessDetails?.businessStage?.toLowerCase() === "startup" && fundabilityData.customerLifetimeValue !== undefined && fundabilityData.customerAcquisitionCost !== undefined && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-400">Customer LTV</p>
                                <p className="text-sm">${fundabilityData.customerLifetimeValue}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Customer Acquisition Cost</p>
                                <p className="text-sm">${fundabilityData.customerAcquisitionCost}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
      
                    {/* Documentation */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <IoLocation className="text-mainGreen mr-2" /> 
                        Documentation & Compliance
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">Business Plan</p>
                            <p className={`text-sm ${fundabilityData.companyBusinessPlan ? 'text-mainGreen' : 'text-gray-400'}`}>
                              {fundabilityData.companyBusinessPlan ? 'Available' : 'Not Available'}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">Pitch Deck</p>
                            <p className={`text-sm ${fundabilityData.companyPitchDeck ? 'text-mainGreen' : 'text-gray-400'}`}>
                              {fundabilityData.companyPitchDeck ? 'Available' : 'Not Available'}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">5-Year Cash Flow</p>
                            <p className={`text-sm ${fundabilityData.company5yearCashFlow ? 'text-mainGreen' : 'text-gray-400'}`}>
                              {fundabilityData.company5yearCashFlow ? 'Available' : 'Not Available'}
                            </p>
                          </div>
                          {businessDetails?.businessStage?.toLowerCase() !== "startup" && (
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">Audited Financials</p>
                              <p className={`text-sm ${fundabilityData.auditedFinancialStatement ? 'text-mainGreen' : 'text-gray-400'}`}>
                                {fundabilityData.auditedFinancialStatement ? 'Available' : 'Not Available'}
                              </p>
                            </div>
                          )}<div className="flex flex-col">
                          <p className="text-xs text-gray-400">Legal Issues</p>
                          <p className={`text-sm ${!fundabilityData.companyLegalCases ? 'text-mainGreen' : 'text-red-400'}`}>
                            {fundabilityData.companyLegalCases ? 'Pending Cases' : 'No Issues'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-xs text-gray-400">Required Licenses</p>
                          <p className={`text-sm ${fundabilityData.licensesToOperate ? 'text-mainGreen' : 'text-gray-400'}`}>
                              {fundabilityData.licensesToOperate ? 'All Acquired' : 'Not Applicable'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
      
                    {/* Funding Recommendation */}
                    {/* <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FaCalendarAlt className="text-mainGreen mr-2" /> 
                        Funding Recommendation
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        {fundabilityData.score >= 80 ? (
                          <div className="space-y-3">
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">Your business shows strong fundability. Consider equity financing, venture capital, or traditional bank loans.</p>
                            </div>
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">Your documentation and financial track record position you well for premium funding options.</p>
                            </div>
                          </div>
                        ) : fundabilityData.score >= 60 ? (
                          <div className="space-y-3">
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">Your business shows moderate fundability. Consider angel investors, government grants, or asset-backed loans.</p>
                            </div>
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">Improving your documentation and addressing financial gaps could increase your funding options.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">Your business may benefit from bootstrapping, friends & family funding, or microloans.</p>
                            </div>
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">Consider addressing key areas in your business structure and documentation before seeking larger funding.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>
      
                {/* Next button */}
                <div className="flex justify-end mt-6">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                  >
                    Next: Investment Proposals
                  </button>
                </div>
              </div>
            ) : businessDetails?.fundabilityTestDetails?.publicId ? (
              <div className="flex justify-center items-center h-[60vh]">
                <div className="text-center">
                  <p className="mb-5 font-semibold text-xl lg:text-2xl">
                    Fundability Score
                  </p>
                  <CircularProgress
                    value={businessDetails?.fundabilityTestDetails?.score || 0}
                  />
                  <p className="mt-4 text-xs lg:text-sm">
                    Loading your fundability score...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[60vh]">
                <div className="text-xs lg:text-sm text-center px-4 max-w-md">
                  <h3 className="text-lg font-semibold mb-3">No Fundability Assessment</h3>
                  <p className="mb-6">
                   The business is yet to carry out an assessment
                  </p>
                
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return <div className="p-4">Valuation Report - Work in Progress...</div>;
      case 3:
        return <div className="p-4">Business Documents - Work in Progress...</div>;

      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="font-sansSerif">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 lg:gap-7 text-sm lg:text-base px-2 lg:px-0">
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 0 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(0)}
        >
          Business Overview
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 1 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(1)}
        >
          Fundability Check
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 2 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(2)}
        >
          Valuation Report
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 3 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(3)}
        >
          Business Documents
        </p>
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}