"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import {
  getABusiness,
  getDealRoomProfile,
  getFundabilityResultsSmeBusinessId,
  getFundabilityResultsStartupBusinessId,
} from "@/app/services/dashboard";
import Loading from "@/app/loading";
import { BusinessDetailsAPI, DealRoomProfile, FundType } from "@/app/type";
import CircularProgress from "@/app/components/dashboard/Circular";
// Import icons for the fundability section
import { FaCalendarAlt, FaDownload, FaFileAlt, FaImage } from "react-icons/fa";
import { IoLocation, IoClose } from "react-icons/io5";
import { MdOutlinePermIdentity, MdVerified } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { RxCrossCircled } from "react-icons/rx";

// Helper function to format array data as an HTML list with TypeScript types
const formatArrayData = (data: string | string[] | null | undefined): React.ReactNode => {
  if (!data) return "Not provided";
  
  // If it's already a string, return it
  if (typeof data === 'string') return data;
  
  // If it's an array, format as an HTML list
  if (Array.isArray(data)) {
    // Filter out empty strings
    const filteredArray = data.filter(item => item && item.trim() !== '');
    
    if (filteredArray.length === 0) return "Not provided";
    
    // Return array items as an unordered list
    return (
      <ul className="list-disc pl-5 space-y-1">
        {filteredArray.map((item, index) => (
          <li key={index} className="text-white">{item}</li>
        ))}
      </ul>
    );
  }
  
  // If it's neither string nor array, convert to string
  return String(data);
};

export default function BusinessDetail() {
  const SearchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const id = SearchParams.get("id");
  const businessId = SearchParams.get("businessId");
  const [loading, setLoading] = useState(true);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetailsAPI | null>(null);
  const [dealRoomProfile, setDealRoomProfile] = useState<DealRoomProfile | null>(null);
  const [fundabilityData, setFundabilityData] = useState<FundType | null>(null);
  const [fundabilityLoading, setFundabilityLoading] = useState(false);
  const [fundabilityFetched, setFundabilityFetched] = useState(false);
  // State for photo gallery lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeGalleryTab, setActiveGalleryTab] = useState('photos');

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("token");
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
  // Format with commas directly in case Intl doesn't work as expected
  try {
    return "₦" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return "₦" + amount;
  }
};


  // Fetch business details and deal room profile
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !businessId) return;
      
      const token = getToken();
      if (!token) return;
      
      try {
        setLoading(true);
        
        // Fetch business details
        const businessResponse = await getABusiness(token, businessId);
        
        if (businessResponse && businessResponse.success) {
          console.log("Business details fetched:", businessResponse.data);
          setBusinessDetails(businessResponse.data);
        } else {
          console.error("Failed to fetch business details:", businessResponse?.message);
        }
        
        // Fetch deal room profile
        const profileResponse = await getDealRoomProfile(token, businessId);
        
        if (profileResponse && profileResponse.success) {
          console.log("Deal room profile fetched:", profileResponse.data);
          setDealRoomProfile(profileResponse.data);
        } else {
          console.error("Failed to fetch deal room profile:", profileResponse?.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, id]);
  
  // Fetch fundability results 
  useEffect(() => {
    const fetchFundabilityResults = async () => {
      // Only fetch if we're viewing the fundability tab or haven't fetched yet
      if ((!fundabilityFetched || currentStep === 1) && businessDetails && id && businessId) {
        const token = getToken();
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

  // Lightbox functions for photo gallery
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    // Only apply to photos since proofOfBusiness is now a string
    if (activeGalleryTab === 'photos' && dealRoomProfile?.businessPhotos) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % dealRoomProfile.businessPhotos.length);
    }
  };

  const prevImage = () => {
    // Only apply to photos since proofOfBusiness is now a string
    if (activeGalleryTab === 'photos' && dealRoomProfile?.businessPhotos) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + dealRoomProfile.businessPhotos.length) % dealRoomProfile.businessPhotos.length);
    }
  };

  // Function to get file extension from URL
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase() || '';
  };

  const toSentenceCase = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  // Function to get file name from URL
  const getFileName = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    // Decode URL encoded characters
    return decodeURIComponent(fileName);
  };

  // Function to determine if a file is an image
  const isImageFile = (url: string) => {
    const extension = getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  };
 
  if (loading) {
    return <Loading text="Loading" />;
  }

  if (!dealRoomProfile) {
    return <Loading/>;
  }

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-mainBlack rounded-lg p-6 shadow-lg">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 pb-4 border-b border-zinc-800">
  <div className="flex items-center space-x-6">
    <div className="relative">
      <Image
        src={dealRoomProfile.businessPhotos[0]}
        width={100}
        height={100}
        alt="business logo"
        className="rounded-lg object-cover w-[100px] h-[100px]"
      />
    </div>
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl lg:text-2xl font-semibold text-white">
          {businessDetails && businessDetails.businessName}
        </h2>
        {businessDetails && businessDetails.businessVerificationStatus ? (
          <div className="flex items-center bg-green-900 bg-opacity-40 text-green-400 px-2 py-0.5 rounded-full text-xs">
            <MdVerified className="mr-1" />
            Verified
          </div>
        ) : (
          <div className="flex items-center bg-red-900 bg-opacity-40 text-red-400 px-2 py-0.5 rounded-full text-xs">
            <RxCrossCircled className="mr-1" />
            Unverified
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm max-w-2xl">
        {dealRoomProfile.highlightsOfBusiness}
      </p>
    </div>
  </div>
  <div className="mt-4 lg:mt-0">
    <Link
      href={`proposal?id=${businessId}`}
      className="bg-mainGreen text-white px-6 py-2 text-sm rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Company Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <MdOutlinePermIdentity className="text-mainGreen mr-2" /> 
                    Company Information
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Business Name</p>
                        <p className="text-sm text-white">
                          {businessDetails && businessDetails.businessName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email Address</p>
                        <p className="text-sm text-red-500">Available after connection</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone Number</p>
                        <p className="text-sm text-red-500">Available after connection</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm text-white">
                          {businessDetails?.location && toSentenceCase(businessDetails?.location)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Industry</p>
                        <p className="text-sm text-white">{businessDetails?.industry}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Funding Requirement</p>
                        <p className="text-sm text-white">{businessDetails?.interestedIn}</p>
                      </div>
                    </div>
                  </div>
                </div>
      
                {/* Business Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <LiaIndustrySolid className="text-mainGreen mr-2" /> 
                    Business Details
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">Top Selling Products</p>
                        <div className="text-sm text-white mt-1">
                          {formatArrayData(dealRoomProfile.topSellingProducts)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Facility Details</p>
                        <p className="text-sm text-white">{dealRoomProfile.facilityDetails}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Business Highlights</p>
                        <p className="text-sm text-white">
                          {dealRoomProfile.highlightsOfBusiness}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Right Column */}
              <div>
                {/* Financial Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <FaCalendarAlt className="text-mainGreen mr-2" /> 
                    Financial Information
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Funding Amount Required</p>
                        <p className="text-sm text-white">
                          {formatCurrency(dealRoomProfile.fundingAmount)  || "Not Provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Funding Structure</p>
                        <p className="text-sm text-white">
                          { dealRoomProfile.fundingStructure || "Not Provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Monthly Sales</p>
                        <p className="text-sm text-white">
                          {formatCurrency(dealRoomProfile.averageMonthlySales)|| "Not Provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Yearly Sales</p>
                        <p className="text-sm text-white">
                          {formatCurrency(dealRoomProfile.reportedYearlySales) || "Not Provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Profit Margin</p>
                        <p className="text-sm text-white">
                          {dealRoomProfile.profitMarginPercentage}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Physical Assets Value</p>
                        <p className="text-sm text-white">
                          {formatCurrency(dealRoomProfile.valueOfPhysicalAssets) || "Not Provided"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">Valuation</p>
                        <p className="text-sm text-white font-semibold">
                          {formatCurrency(dealRoomProfile.tentativeSellingPrice) || "Not Provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
      
                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <IoLocation className="text-mainGreen mr-2" /> 
                    Additional Information
                  </h3>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">Reason for funding need & your offer</p>
                        <p className="text-sm text-white">{dealRoomProfile.reasonForSale}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Asset Details</p>
                        <div className="text-sm text-white mt-1">
                          {formatArrayData(dealRoomProfile.assetsDetails)}
                        </div>
                      </div>
                    </div>
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
                          )}
                          <div className="flex flex-col">
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
                  </div>
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
      
      case 3: // Photo Gallery Tab
        return (
          <div className="bg-mainBlack rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Photo Gallery</h2>
            
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-800 mb-4">
              <button 
                className={`px-4 py-2 font-medium text-sm ${activeGalleryTab === 'photos' ? 'text-mainGreen border-b-2 border-mainGreen' : 'text-gray-400'}`}
                onClick={() => setActiveGalleryTab('photos')}
              >
                <div className="flex items-center">
                  <FaImage className="mr-2" />
                  Business Photos ({dealRoomProfile.businessPhotos.length})
                </div>
              </button>
              <button 
                className={`px-4 py-2 font-medium text-sm ${activeGalleryTab === 'proof' ? 'text-mainGreen border-b-2 border-mainGreen' : 'text-gray-400'}`}
                onClick={() => setActiveGalleryTab('proof')}
              >
                <div className="flex items-center">
                  <FaImage className="mr-2" />
                  Proof of Business
                </div>
              </button>
            </div>
            
            {/* Photo Grid */}
            {activeGalleryTab === 'photos' && (
              <>
                {dealRoomProfile.businessPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {dealRoomProfile.businessPhotos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(index)}
                      >
                        {isImageFile(photo) ? (
                          <Image 
                            src={photo} 
                            alt={`Business photo ${index + 1}`} 
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-zinc-800 h-full w-full flex items-center justify-center">
                            <FaFileAlt size={40} className="text-gray-400" />
                            <p className="text-xs mt-2">{getFileExtension(photo).toUpperCase()}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No business photos available</p>
                )}
              </>
            )}
            
            {/* Proof of Business (now as a single string) */}
            {activeGalleryTab === 'proof' && (
              <>
                {dealRoomProfile.proofOfBusiness ? (
                  <div className="bg-zinc-800 p-6 rounded-lg">
                    {isImageFile(dealRoomProfile.proofOfBusiness) ? (
                      <div className="flex justify-center">
                        <div className="relative w-full max-w-xl aspect-video">
                          <Image 
                            src={dealRoomProfile.proofOfBusiness} 
                            alt="Proof of business" 
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8">
                        <FaFileAlt size={60} className="text-gray-400 mb-4" />
                        <p className="text-base mb-2">{getFileName(dealRoomProfile.proofOfBusiness)}</p>
                        <a 
                          href={dealRoomProfile.proofOfBusiness} 
                          download 
                          className="mt-4 flex items-center bg-mainGreen text-black px-4 py-2 rounded-md hover:bg-mainGreen/90 transition-colors"
                        >
                          <FaDownload className="mr-2" /> Download Document
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No proof of business available</p>
                )}
              </>
            )}
            
            {/* Lightbox (only for businessPhotos now) */}
            {lightboxOpen && activeGalleryTab === 'photos' && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                onClick={closeLightbox}
              >
                <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2"
                    onClick={closeLightbox}
                  >
                    <IoClose size={24} />
                  </button>
                  
                  <div className="relative h-[80vh]">
                    {dealRoomProfile.businessPhotos[currentImageIndex] && (
                      <>
                        {isImageFile(dealRoomProfile.businessPhotos[currentImageIndex]) ? (
                          <Image 
                            src={dealRoomProfile.businessPhotos[currentImageIndex]} 
                            alt="Gallery image" 
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="bg-zinc-800 h-full w-full flex flex-col items-center justify-center">
                            <FaFileAlt size={80} className="text-gray-400" />
                            <p className="text-lg mt-4">{getFileName(dealRoomProfile.businessPhotos[currentImageIndex])}</p>
                            <a 
                              href={dealRoomProfile.businessPhotos[currentImageIndex]} 
                              download 
                              className="mt-4 flex items-center bg-mainGreen text-black px-4 py-2 rounded-md hover:bg-mainGreen/90 transition-colors"
                            >
                              <FaDownload className="mr-2" /> Download
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {dealRoomProfile.businessPhotos.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className="bg-black bg-opacity-60 px-3 py-1 rounded-full">
                        <p className="text-sm">{currentImageIndex + 1} / {dealRoomProfile.businessPhotos.length}</p>
                      </div>
                    </div>
                  )}
                  
                  {dealRoomProfile.businessPhotos.length > 1 && (
                    <>
                      <button 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 4: // Business Documents Tab
        return (
          <div className="bg-mainBlack rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Business Documents</h2>
            
            {dealRoomProfile.businessDocuments.length > 0 ? (
              <div className="space-y-4">
                {dealRoomProfile.businessDocuments.map((doc, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-3 bg-zinc-700 rounded-lg mr-4">
                        <FaFileAlt className="text-mainGreen text-xl" />
                      </div>
                      <div>
                        <p className="font-medium">{getFileName(doc)}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {isImageFile(doc) ? 'Image Document' : `${getFileExtension(doc).toUpperCase()} Document`}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={doc} 
                      download 
                      className="p-3 bg-mainGreen text-black rounded-lg hover:bg-mainGreen/90 transition-colors flex items-center"
                    >
                      <FaDownload className="mr-2" /> Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-800 rounded-lg">
                <FaFileAlt size={40} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No business documents available</p>
              </div>
            )}
          </div>
        );

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
          Photo Gallery
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 4 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(4)}
        >
          Business Documents
        </p>
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}