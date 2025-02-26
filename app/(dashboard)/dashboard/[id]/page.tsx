"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/components/layouts/UserContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaCalendarAlt, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoCallOutline, IoLocation } from "react-icons/io5";
import { MdEmail, MdOutlinePermIdentity } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import Link from "next/link";
import CircularProgress from "@/app/components/dashboard/Circular";
import { getBusinessProposals, getFundabilityResultsSme, getFundabilityResultsStartup } from "@/app/services/dashboard";
import { CompanyData, FundType, Proposal } from "@/app/type";
import { BusinessDetails } from "@/app/type"; 

export default function BusinessDetail() {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const { businessDetails } = useUser();
  const [proposal, setProposal] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundabilityData, setFundabilityData] = useState<FundType | null>(null);
  const [fundabilityLoading, setFundabilityLoading] = useState(false);
  
  const [business, setBusiness] = useState<BusinessDetails | null>(null);

  // Find the business first
  useEffect(() => {
    if (businessDetails && businessDetails.length > 0) {
      const foundBusiness = businessDetails.find((b) => b.publicId === id);
      setBusiness(foundBusiness || null);
    }
  }, [businessDetails, id]);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;
      
      setLoading(true);
      try {
        const response = await getBusinessProposals(token, Array.isArray(id) ? id[0] : id);
        if (response.success) {
          setProposal(response.data);
          console.log(response.data);
        } else {
          console.error('Failed to fetch proposals:', response.message);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProposals();
  }, [id]);

  // Fetch fundability results based on business stage when tab is switched
  useEffect(() => {
    const fetchFundabilityResults = async () => {
      if (currentStep !== 1 || !business || !id) return;
      
      const token = localStorage.getItem("token");
      if (!token) return;
      
      setFundabilityLoading(true);
      try {
        // Use fundabilityTestDetails.publicId instead of business ID
        const fundabilityId = business.fundabilityTestDetails?.publicId;
        
        // If no fundability ID exists, exit early
        if (!fundabilityId) {
          setFundabilityLoading(false);
          return;
        }
        
        let response;
        
        // Check business stage and call appropriate API
        if (business.businessStage?.toLowerCase() === "Startup") {
          response = await getFundabilityResultsStartup(token, fundabilityId);
        } else {
          // Default to SME if not startup or if stage is undefined
          response = await getFundabilityResultsSme(token, fundabilityId);
        }
        
        if (response && response.success) {
          setFundabilityData(response.data);
        } else {
          console.error('Failed to fetch fundability results:', response?.message);
        }
      } catch (error) {
        console.error('Error fetching fundability results:', error);
      } finally {
        setFundabilityLoading(false);
      }
    };

    fetchFundabilityResults();
  }, [currentStep, business, id]);

  // Function to handle redirecting to the correct fundability test based on business stage
  const handleRefreshRedirectFund = (id: string) => {
    if (business?.businessStage?.toLowerCase() === "sme") {
      window.location.href = `/dashboard/fundability-test/${id}`;
    } else {
      window.location.href = `/dashboard/fundability-test/select-startup/${id}`;
    }
  };

  // Function to move to the next step
  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  // If no business is found, show loading or not found message
  if (!business) {
    return <p className="text-center text-white">Business not found</p>;
  }

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="lg:bg-mainBlack gap-5 pb-8 lg:pb-12 py-4 lg:py-8 px-4 lg:px-5">
            {/* Header Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-4">
              {/* Logo and Business Name */}
              <div className="flex items-start lg:col-span-7 gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={business.businessLogoUrl || "/assets/logos.svg"}
                    width={80}
                    height={100}
                    alt="business logo"
                    className="rounded-full object-cover w-[50px] h-[50px] lg:w-[100px] lg:h-[100px]"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-xl lg:text-2xl mb-2">
                    {business.businessName}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-300 line-clamp-3 lg:line-clamp-none">
                    {business.description}
                  </p>
                </div>
              </div>

              {/* Social Icons */}
              <div className="lg:col-span-2 flex lg:justify-start gap-4 lg:gap-2 text-xl lg:self-start">
                <FaInstagram className="cursor-pointer hover:text-mainGreen" />
                <FaLinkedin className="cursor-pointer hover:text-mainGreen" />
                <FaXTwitter className="cursor-pointer hover:text-mainGreen" />
                <FaFacebook className="cursor-pointer hover:text-mainGreen" />
              </div>

              <div className="lg:col-span-1"></div>

              {/* Edit Button */}
              <div className="lg:col-span-2 flex lg:justify-start">
                <button>
                  <Link
                    href={`/dashboard/register-business/${business.publicId}`}
                    className="bg-black shadow shadow-white px-3 py-1.5 rounded inline text-sm hover:bg-gray-900 transition"
                  >
                    Edit Details
                  </Link>
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 py-6 lg:py-10 text-xs gap-6 lg:gap-0">
              {/* Contact Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IoCallOutline className="text-mainGreen text-lg" />
                  <span className="break-all">
                    Contact: {business.businessPhone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-mainGreen text-lg" />
                  <span className="break-all">
                    Email: {business.businessEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />
                  <span>Employees: {business.numOfEmployees}</span>
                </div>
              </div>

              {/* Business Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-mainGreen text-lg" />
                  <span>Established: {business.yearEstablished}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />
                  <span>Legal Entity: {business.businessLegalEntity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LiaIndustrySolid className="text-mainGreen text-lg" />
                  <span>Industry: {business.industry}</span>
                </div>
              </div>

              {/* Location Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IoLocation className="text-mainGreen text-lg" />
                  <span>
                    Location: {business.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LiaIndustrySolid className="text-mainGreen text-lg" />
                  <span>Business Stage: {business.businessStage}</span>
                </div>
              </div>
            </div>
            
            {/* Next button */}
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleNext}
                className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
              >
                Next: Fundability Check
              </button>
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
                                <p className="text-sm">{fundabilityData.legalName || business.businessName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Registration</p>
                                <p className="text-sm">{fundabilityData.companyRegistration || business.businessLegalEntity}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-400">Years of Operation</p>
                                <p className="text-sm">{fundabilityData.yearsOfOperation || business.yearEstablished} years</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Company Size</p>
                                <p className="text-sm">{fundabilityData.companySize || business.numOfEmployees} employees</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-400">Industry</p>
                              <p className="text-sm">{fundabilityData.industry || business.industry}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-400">Location</p>
                              <p className="text-sm">{fundabilityData.city && fundabilityData.country ? 
                                `${fundabilityData.city}, ${fundabilityData.country}` : 
                                business.location}</p>
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
                                    fundabilityData.ownership.map((owner:string, index:number) => (
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
                                    fundabilityData.executiveManagement.map((exec:string, index:number) => (
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
        
                            {business.businessStage?.toLowerCase() === "startup" && fundabilityData.startupStage && (
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
                            {business.businessStage?.toLowerCase() !== "startup" && (
                              <div>
                                <p className="text-xs text-gray-400">Average Annual Revenue</p>
                                <p className="text-sm">${fundabilityData.averageAnnualRevenue?.toLocaleString() || 'Not provided'}</p>
                              </div>
                            )}
        
                            {business.businessStage?.toLowerCase() !== "startup" && fundabilityData.revenueGrowthRate !== undefined && (
                              <div>
                                <p className="text-xs text-gray-400">Revenue Growth Rate</p>
                                <p className="text-sm">{fundabilityData.revenueGrowthRate}%</p>
                              </div>
                            )}
        
                            {business.businessStage?.toLowerCase() === "startup" && fundabilityData.expectedAnnualGrowthRate !== undefined && (
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
        
                            {business.businessStage?.toLowerCase() === "startup" && fundabilityData.customerLifetimeValue !== undefined && fundabilityData.customerAcquisitionCost !== undefined && (
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
                            {business.businessStage?.toLowerCase() !== "startup" && (
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
        
                      {/* Funding Recommendation */}
                      <div>
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
                      </div>
                    </div>
                  </div>
        
                 {/* Next button */}
                 <div className="flex justify-end mt-6">
                    <button 
                      onClick={handleNext}
                      className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                    >
                      Next: Investment Proposals
                    </button>
                  </div>
                </div>
              ) : business?.fundabilityTestDetails?.publicId ? (
                <div className="flex justify-center items-center h-[60vh]">
                  <div className="text-center">
                    <p className="mb-5 font-semibold text-xl lg:text-2xl">
                      Fundability Score
                    </p>
                    <CircularProgress
                      value={0}
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
                      Complete a fundability assessment to understand how investment-ready your business is and get recommendations on suitable funding options.
                    </p>
                    <button 
                      onClick={() => handleRefreshRedirectFund(id as string)}
                      className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                    >
                      Start Fundability Assessment
                    </button>
                  </div>
                </div>
              )}
            </div>
          );

        case 2:
          return (
            <div className="flex flex-col h-[80vh] lg:h-[80vh] lg:bg-mainBlack p-4">
              <div className="w-full overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading proposals...</p>
                  </div>
                ) : business?.dealRoomDetails ? (
                  proposal?.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-mainGreen/20">
                        <tr>
                          <th className="px-4 py-3 text-left">Sl. No</th>
                          <th className="px-4 py-3 text-left">Proposal Date</th>
                          <th className="px-4 py-3 text-left">Investor Name</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Proposal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposal.map((item, index) => (
                          <tr key={item.publicId} className="border-b border-gray-800">
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3 text-mainGreen">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {item.investor?.companyLogoUrl && (
                                  <Image
                                    src={item.investor.companyLogoUrl}
                                    width={30}
                                    height={30}
                                    alt="company logo"
                                    className="rounded-full"
                                  />
                                )}
                                <span>{item.investor?.companyName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  item.status === 'PENDING' 
                                    ? 'bg-yellow-500/20 text-yellow-500'
                                    : item.status === 'ACCEPTED'
                                    ? 'bg-mainGreen/20 text-mainGreen'
                                    : 'bg-red-500/20 text-red-500'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-xs">
                              <p className="truncate">{item.proposal}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-[70vh] px-4 py-8 text-center">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No Investment Proposals Yet</h3>
                        <p className="text-gray-400 text-sm max-w-md mb-6">
                          When investors show interest in your business, their proposals will appear here. Keep your business profile updated to attract potential investors.
                        </p>
                        <Link 
                          href={`/dashboard/deal-room/investor-dashboard?id=${id}`}
                          className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                        >
                          See Investors
                        </Link>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col justify-center items-center h-[70vh] px-4 py-8 text-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">No Deal Room Profile</h3>
                      <p className="text-gray-400 text-sm max-w-md mb-6">
                        Create a Deal Room profile to showcase your business to potential investors and receive investment proposals.
                      </p>
                      <Link 
                        href={`/dashboard/deal-room/valuation?id=${id}`}
                        className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                      >
                        Create Deal Room Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
          Investment Proposals
        </p>
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}