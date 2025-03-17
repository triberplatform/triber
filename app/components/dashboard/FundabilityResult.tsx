import React, { useEffect, useState } from "react";
import CircularProgress from "@/app/components/dashboard/Circular";
import { getFundabilityResultsSme, getFundabilityResultsStartup } from "@/app/services/dashboard";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { MdOutlinePermIdentity } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { BusinessDetails, FundType } from "@/app/type";

const FundabilityCheck = ({ business, businessId, handleNext }: { business: BusinessDetails, businessId: string, handleNext: () => void }) => {
  const [fundabilityData, setFundabilityData] = useState<FundType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundabilityResults = async () => {
      if (!business || !businessId) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use fundabilityTestDetails.publicId if available, otherwise use businessId
        const fundabilityId = business.fundabilityTestDetails?.publicId || businessId;

        let response;
        if (business.businessStage?.toLowerCase() === "startup") {
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
        setLoading(false);
      }
    };

    fetchFundabilityResults();
  }, [business, businessId]);

  // Function to handle redirecting to the correct fundability test based on business stage
  const handleStartFundabilityTest = (id:string) => {
    if (business?.businessStage?.toLowerCase() === "sme") {
      window.location.href = `/dashboard/fundability-test/${id}`;
    } else {
      window.location.href = `/dashboard/fundability-test/select-startup/${id}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <p className="mb-5 font-semibold text-xl lg:text-2xl">
            Fundability Score
          </p>
          <CircularProgress value={0} />
          <p className="mt-4 text-xs lg:text-sm">
            Loading your fundability score...
          </p>
        </div>
      </div>
    );
  }

  if (!fundabilityData) {
    // Handle the case when fundability test hasn't been taken yet
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-xs lg:text-sm text-center px-4 max-w-md">
          <h3 className="text-lg font-semibold mb-3">No Fundability Assessment</h3>
          <p className="mb-6">
            Complete a fundability assessment to understand how investment-ready your business is and get recommendations on suitable funding options.
          </p>
          <button 
            onClick={() => handleStartFundabilityTest(businessId)}
            className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
          >
            Start Fundability Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:bg-mainBlack p-4 lg:p-8 pb-8 h-full">
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
                      <p className="text-sm">{fundabilityData.legalName || business?.businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Registration</p>
                      <p className="text-sm">{fundabilityData.companyRegistration || business?.businessLegalEntity}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Years of Operation</p>
                      <p className="text-sm">{fundabilityData.yearsOfOperation || business?.yearEstablished} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Company Size</p>
                      <p className="text-sm">{fundabilityData.companySize || business?.numOfEmployees} employees</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400">Industry</p>
                    <p className="text-sm">{fundabilityData.industry || business?.industry}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm">{fundabilityData.city && fundabilityData.country ? 
                      `${fundabilityData.city}, ${fundabilityData.country}` : 
                      business?.location}</p>
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

                  {fundabilityData.boardOfDirectors && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Board of Directors</p>
                      <div className="space-y-1">
                        {Array.isArray(fundabilityData.boardOfDirectors) ? 
                          fundabilityData.boardOfDirectors.map((director, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mr-2"></div>
                              <p className="text-sm">{director}</p>
                            </div>
                          )) :
                          <p className="text-sm">Information not available</p>
                        }
                      </div>
                    </div>
                  )}

                  {(business?.businessStage?.toLowerCase() === "startup" || fundabilityData.startupStage) && (
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
                  {business?.businessStage?.toLowerCase() !== "startup" && (
                    <div>
                      <p className="text-xs text-gray-400">Average Annual Revenue</p>
                      <p className="text-sm">${fundabilityData.averageAnnualRevenue?.toLocaleString() || 'Not provided'}</p>
                    </div>
                  )}

                  {business?.businessStage?.toLowerCase() !== "startup" && fundabilityData.revenueGrowthRate !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400">Revenue Growth Rate</p>
                      <p className="text-sm">{fundabilityData.revenueGrowthRate}%</p>
                    </div>
                  )}

                  {business?.businessStage?.toLowerCase() === "startup" && fundabilityData.expectedAnnualGrowthRate !== undefined && (
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

                  {business?.businessStage?.toLowerCase() === "startup" && 
                   fundabilityData.customerLifetimeValue !== undefined && 
                   fundabilityData.customerAcquisitionCost !== undefined && (
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
                  {business?.businessStage?.toLowerCase() !== "startup" && (
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
    </div>
  );
};

export default FundabilityCheck;