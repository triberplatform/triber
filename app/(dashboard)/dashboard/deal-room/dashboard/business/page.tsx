"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CircularProgress from "@/app/components/dashboard/Circular";
import { useSearchParams } from "next/navigation";
import {
  getFundabilityResults,
  getValuatedBusiness,
} from "@/app/services/dashboard";
import Loading from "@/app/loading";

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

interface FundabilityTest {
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
  createdAt: string;
  updatedAt: string;
}

export default function BusinessDetail() {
  const SearchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const id = SearchParams.get("id");
  const businessId = SearchParams.get("businessId");
  const [loading, setLoading] = useState(true);
  const [fundabilityResults, setFundabilityResults] = useState<
    FundabilityTest[]
  >([]);
  const token = localStorage.getItem("token");
  const [businesses, setBusinesses] = useState<DealRoomProfile[]>([]);

  const business = businesses.find((b) => b.publicId === id);
  useEffect(() => {
    setLoading(true);

    const fetchFundability = async () => {
      try {
        const response = await getFundabilityResults(
          businessId || "",
          token || ""
        );
        setFundabilityResults(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const fetchBusinesses = async () => {
      try {
        const response = await getValuatedBusiness(token || "");
        if (response?.success) {
          setBusinesses(response.data);
        }
      } catch (error) {
        console.error("Unable to fetch businesses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
    fetchFundability();
  }, [businessId, token]);

  if (!business) {
    return <p className="text-center text-white">Business not found</p>;
  }
  if(loading){
    return <Loading text="Loading" />
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
                      src={"/assets/logos.svg"}
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
                    <p className="text-gray-400 max-w-2xl">
                      {business.highlightsOfBusiness}
                    </p>
                  </div>
                </div>
                <Link
                  href={`proposal?id=${business.businessId}`}
                  className="bg-mainGreen text-white px-6 py-2 text-sm rounded-lg font-medium hover:bg-mainGreens transition-colors flex items-center gap-2"
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
                    <p className="text-white">
                    Available after connection
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Phone Number</p>
                    <p className="text-white">
                    Available after connection
                    </p>
                  </div>
                </div>
              </div>

              {/* Rest of your existing sections... */}
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
          <div className="lg:bg-mainBlack p-4 lg:p-8">
            {fundabilityResults === null ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <p className="text-xl lg:text-2xl mb-6">
                  Fundability Check Not Started
                </p>
                <p className="text-sm lg:text-base mb-8 max-w-lg">
                  Your business hasn&apos;t undergone a fundability assessment yet.
                  Complete the fundability check to understand your business&apos;s
                  funding readiness.
                </p>
              </div>
            ) : fundabilityResults.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                {/* Rest of your existing fundability display code */}
                {/* Score Section */}
                <div className="text-center mb-10">
                  <p className="mb-5 font-semibold text-xl lg:text-2xl">
                    Fundability Score
                  </p>
                  <CircularProgress value={fundabilityResults[0].score} />
                  <p className="mt-4 text-xs lg:text-sm">
                    Your current fundability score
                  </p>
                </div>

                {/* Company Details */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Your existing company details sections */}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <p className="text-xl lg:text-2xl mb-6">
                  Complete Your Fundability Check
                </p>
                <p className="text-sm lg:text-base mb-8 max-w-lg">
                  You&apos;ve started the fundability assessment but haven&apos;t
                  completed it yet. Continue your assessment to get your
                  business&apos;s funding readiness score.
                </p>
              </div>
            )}
          </div>
        );
      case 2:
        return <div className="p-4">Work in Progress...</div>;

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
        {/* <p
          className={`cursor-pointer pb-1 ${
            currentStep === 2 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(2)}
        >
          Investment Proposals
        </p> */}
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
