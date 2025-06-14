"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useUser } from "@/app/components/layouts/UserContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaDownload,
  FaFileAlt,
  FaImage,
} from "react-icons/fa";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoCallOutline, IoLocation, IoClose } from "react-icons/io5";
import { MdEmail, MdOutlinePermIdentity, MdVerified } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import Link from "next/link";
import CircularProgress from "@/app/components/dashboard/Circular";
import {
  getBusinessProposals,
  getFundabilityResultsSme,
  getFundabilityResultsStartup,
  getDealRoomProfile,
} from "@/app/services/dashboard";
import { FundType, Proposal, BusinessDetails } from "@/app/type";
import { formatBusinessTypeToSentence } from "@/app/services/utils";
import { RxCrossCircled } from "react-icons/rx";
import ListBusiness from "@/app/components/dashboard/ListBusiness";

// Import the DealRoomProfile type
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
  fundingAmount: string;
  fundingStructure: string;
};

// Helper function to strip HTML tags from text
const stripHtmlTags = (html: string | null | undefined): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, '');
};

// Helper function to format array data
const formatArrayData = (
  data: string | string[] | null | undefined
): React.ReactNode => {
  if (!data) return "Not provided";

  // If it's already a string, return it
  if (typeof data === "string") return data;

  // If it's an array, format as an HTML list
  if (Array.isArray(data)) {
    // Filter out empty strings
    const filteredArray = data.filter((item) => item && item.trim() !== "");

    if (filteredArray.length === 0) return "Not provided";

    // Return array items as an unordered list
    return (
      <ul className="list-disc pl-5 space-y-1">
        {filteredArray.map((item, index) => (
          <li key={index} className="text-white">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // If it's neither string nor array, convert to string
  return String(data);
};

// Helper function to get file extension from URL
const getFileExtension = (url: string): string => {
  return url.split(".").pop()?.toLowerCase() || "";
};

// Helper function to get file name from URL
const getFileName = (url: string): string => {
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];
  // Decode URL encoded characters
  return decodeURIComponent(fileName);
};

   // Helper function to format industry by replacing underscores with spaces and capitalizing first letters
  const formatIndustry = (industry: string) => {
    return industry
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

// Helper function to determine if a file is an image
const isImageFile = (url: string): boolean => {
  const extension = getFileExtension(url);
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
};

export default function BusinessDetail() {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const { businessDetails } = useUser();
  const [proposal, setProposal] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundabilityData, setFundabilityData] = useState<FundType | null>(null);
  const [fundabilityLoading, setFundabilityLoading] = useState(false);
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [dealRoomProfile, setDealRoomProfile] = useState<DealRoomProfile | null>(null);
  const [dealRoomLoading, setDealRoomLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeGalleryTab] = useState("photos");
  const router = useRouter();

   // Add refs to prevent race conditions
  const fetchingRef = useRef({
    dealRoom: false,
    fundability: false,
    proposals: false
  });

  // Memoize business finding to prevent unnecessary re-renders
  const foundBusiness = useMemo(() => {
    if (businessDetails && businessDetails.length > 0) {
      return businessDetails.find((b) => b.publicId === id) || null;
    }
    return null;
  }, [businessDetails, id]);

  // Set business when foundBusiness changes
  useEffect(() => {
    setBusiness(foundBusiness);
  }, [foundBusiness]);

  // Memoize navigation handler
  const handleNavigation = useCallback((proposalId: string) => {
    router.push(`/dashboard/${id}/proposal-details?proposalId=${proposalId}`);
  }, [router, id]);

  // Memoize refresh redirect handler
  const handleRefreshRedirectFund = useCallback((businessId: string) => {
    if (business?.businessStage?.toLowerCase() === "sme") {
      window.location.href = `/dashboard/fundability-test/${businessId}`;
    } else {
      window.location.href = `/dashboard/fundability-test/select-startup/${businessId}`;
    }
  }, [business?.businessStage]);


  // Find the business first
  useEffect(() => {
    if (businessDetails && businessDetails.length > 0) {
      const foundBusiness = businessDetails.find((b) => b.publicId === id);
      setBusiness(foundBusiness || null);
    }
  }, [businessDetails, id]);

  // Fetch proposals - only depend on id
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id || fetchingRef.current.proposals) return;

      fetchingRef.current.proposals = true;
      setLoading(true);
      
      try {
        const response = await getBusinessProposals(
          token,
          Array.isArray(id) ? id[0] : id
        );
        if (response && response.success) {
          setProposal(response.data || []);
        } else {
          console.error("Failed to fetch proposals:", response?.message);
          setProposal([]);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
        setProposal([]);
      } finally {
        setLoading(false);
        fetchingRef.current.proposals = false;
      }
    };

    fetchProposals();
  }, [id]);


  // Fetch deal room profile - improved dependencies
  useEffect(() => {
    const fetchDealRoomProfile = async () => {
      // Only fetch if we're on the right step, don't have data, not already fetching, and have an id
      if (
        (currentStep === 3 || currentStep === 4) &&
        !dealRoomProfile &&
        !fetchingRef.current.dealRoom &&
        id
      ) {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetchingRef.current.dealRoom = true;
        setDealRoomLoading(true);
        
        try {
          const response = await getDealRoomProfile(
            token,
            Array.isArray(id) ? id[0] : id
          );
          if (response && response.success && response.data) {
            setDealRoomProfile(response.data);
          } else {
            console.error("Failed to fetch deal room profile:", response?.message);
            // Don't set to null here to avoid triggering re-renders
          }
        } catch (error) {
          console.error("Error fetching deal room profile:", error);
          // Don't set to null here to avoid triggering re-renders
        } finally {
          setDealRoomLoading(false);
          fetchingRef.current.dealRoom = false;
        }
      }
    };

    fetchDealRoomProfile();
  }, [currentStep, id, dealRoomProfile]); // Keep dealRoomProfile in deps but use ref to prevent race conditions


 // Fetch fundability results - improved dependencies
  useEffect(() => {
    const fetchFundabilityResults = async () => {
      if (
        currentStep !== 1 || 
        !business || 
        !id || 
        fetchingRef.current.fundability
      ) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const fundabilityId = business.fundabilityTestDetails?.publicId;
      if (!fundabilityId) {
        setFundabilityLoading(false);
        return;
      }

      fetchingRef.current.fundability = true;
      setFundabilityLoading(true);
      
      try {
        let response;
        if (business.businessStage?.toLowerCase() === "startup") {
          response = await getFundabilityResultsStartup(token, fundabilityId);
        } else {
          response = await getFundabilityResultsSme(token, fundabilityId);
        }

        if (response && response.success) {
          setFundabilityData(response.data);
        } else {
          console.error("Failed to fetch fundability results:", response?.message);
          setFundabilityData(null);
        }
      } catch (error) {
        console.error("Error fetching fundability results:", error);
        setFundabilityData(null);
      } finally {
        setFundabilityLoading(false);
        fetchingRef.current.fundability = false;
      }
    };

    fetchFundabilityResults();
  }, [currentStep,business, business?.fundabilityTestDetails?.publicId, business?.businessStage, id]);


 

 // Memoize lightbox functions to prevent re-renders
  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (
      activeGalleryTab === "photos" &&
      dealRoomProfile?.businessPhotos &&
      dealRoomProfile.businessPhotos.length > 0
    ) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % dealRoomProfile.businessPhotos.length
      );
    }
  }, [activeGalleryTab, dealRoomProfile?.businessPhotos]);

  const prevImage = useCallback(() => {
    if (
      activeGalleryTab === "photos" &&
      dealRoomProfile?.businessPhotos &&
      dealRoomProfile.businessPhotos.length > 0
    ) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + dealRoomProfile.businessPhotos.length) %
          dealRoomProfile.businessPhotos.length
      );
    }
  }, [activeGalleryTab, dealRoomProfile?.businessPhotos]);

  // Memoize the next handler
  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  // Memoize step change handler
  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

   // Early return if no business found
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
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl lg:text-2xl">
                      {business.businessName || "Business Name"}
                    </p>
                    {business.businessVerificationStatus ? (
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
                  <p className="text-xs lg:text-sm text-gray-300 line-clamp-3 lg:line-clamp-none">
                    {business.description || "No description available"}
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
                    Contact: {business.businessPhone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-mainGreen text-lg" />
                  <span className="break-all">
                    Email: {business.businessEmail || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />
                  <span>
                    Employees: {formatIndustry(business.numOfEmployees) || "Not provided"}
                  </span>
                </div>
              </div>

              {/* Business Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-mainGreen text-lg" />
                  <span>
                    Established: {business.yearEstablished || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />
                  <span>
                    Legal Entity:{" "}
                    {business.businessLegalEntity
                      ? formatBusinessTypeToSentence(
                          business.businessLegalEntity
                        )
                      : "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LiaIndustrySolid className="text-mainGreen text-lg" />
                  <span>Industry: {formatIndustry(business.industry)|| "Not provided"}</span>
                </div>
              </div>

              {/* Location Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IoLocation className="text-mainGreen text-lg" />
                  <span>Location: {business.location || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LiaIndustrySolid className="text-mainGreen text-lg" />
                  <span>
                    Business Stage: {business.businessStage || "Not provided"}
                  </span>
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
                    <ListBusiness />
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
                    <h2 className="text-xl lg:text-2xl font-semibold mb-2">
                      Fundability Overview
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Last updated:{" "}
                      {new Date(
                        fundabilityData.updatedAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <div className="bg-zinc-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <p className="text-xs text-gray-400">
                            Fundability Score
                          </p>
                          <p className="text-2xl font-bold">
                            {fundabilityData.score || 0}/100
                          </p>
                        </div>
                        <CircularProgress value={fundabilityData.score || 0} />
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
                              <p className="text-xs text-gray-400">
                                Legal Name
                              </p>
                              <p className="text-sm">
                                {fundabilityData.legalName ||
                                  business.businessName ||
                                  "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">
                                Registration
                              </p>
                              <p className="text-sm">
                                {fundabilityData.companyRegistration ||
                                  business.businessLegalEntity ||
                                  "Not provided"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">
                                Years of Operation
                              </p>
                              <p className="text-sm">
                                {fundabilityData.yearsOfOperation ||
                                  business.yearEstablished ||
                                  0}{" "}
                                years
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">
                                Company Size
                              </p>
                              <p className="text-sm">
                                {fundabilityData.companySize ||
                                  business.numOfEmployees ||
                                  0}{" "}
                                employees
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">Industry</p>
                            <p className="text-sm">
                              {fundabilityData.industry ||
                                business.industry ||
                                "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm">
                              {fundabilityData.city && fundabilityData.country
                                ? `${fundabilityData.city}, ${fundabilityData.country}`
                                : business.location || "Not provided"}
                            </p>
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
                              <p className="text-xs text-gray-400 mb-1">
                                Ownership
                              </p>
                              <div className="space-y-1">
                                {Array.isArray(fundabilityData.ownership) ? (
                                  fundabilityData.ownership.map(
                                    (owner: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center"
                                      >
                                        <div className="w-2 h-2 bg-mainGreen rounded-full mr-2"></div>
                                        <p className="text-sm">{owner}</p>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="text-sm">
                                    Information not available
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {fundabilityData.executiveManagement && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">
                                Executive Management
                              </p>
                              <div className="space-y-1">
                                {Array.isArray(
                                  fundabilityData.executiveManagement
                                ) ? (
                                  fundabilityData.executiveManagement.map(
                                    (exec: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center"
                                      >
                                        <div className="w-2 h-2 bg-mainGreen rounded-full mr-2"></div>
                                        <p className="text-sm">{exec}</p>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="text-sm">
                                    Information not available
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {business.businessStage?.toLowerCase() ===
                            "startup" &&
                            fundabilityData.startupStage && (
                              <div>
                                <p className="text-xs text-gray-400">
                                  Startup Stage
                                </p>
                                <p className="text-sm capitalize">
                                  {fundabilityData.startupStage}
                                </p>
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
                          {business.businessStage?.toLowerCase() !==
                            "startup" && (
                            <div>
                              <p className="text-xs text-gray-400">
                                Average Annual Revenue
                              </p>
                              <p className="text-sm">
                                ₦
                                {fundabilityData.averageAnnualRevenue?.toLocaleString() ||
                                  "Not provided"}
                              </p>
                            </div>
                          )}

                          {business.businessStage?.toLowerCase() !==
                            "startup" &&
                            fundabilityData.revenueGrowthRate !== undefined && (
                              <div>
                                <p className="text-xs text-gray-400">
                                  Revenue Growth Rate
                                </p>
                                <p className="text-sm">
                                  {fundabilityData.revenueGrowthRate}%
                                </p>
                              </div>
                            )}

                          {business.businessStage?.toLowerCase() ===
                            "startup" &&
                            fundabilityData.expectedAnnualGrowthRate !==
                              undefined && (
                              <div>
                                <p className="text-xs text-gray-400">
                                  Expected Annual Growth Rate
                                </p>
                                <p className="text-sm">
                                  {fundabilityData.expectedAnnualGrowthRate}%
                                </p>
                              </div>
                            )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">
                                Profitable (3+ Years)
                              </p>
                              <p
                                className={`text-sm ${
                                  fundabilityData.company3YearProfitable
                                    ? "text-mainGreen"
                                    : "text-gray-400"
                                }`}
                              >
                                {fundabilityData.company3YearProfitable
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">
                                High Scalability
                              </p>
                              <p
                                className={`text-sm ${
                                  fundabilityData.companyHighScalibilty
                                    ? "text-mainGreen"
                                    : "text-gray-400"
                                }`}
                              >
                                {fundabilityData.companyHighScalibilty
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">
                                Solid Asset Holdings
                              </p>
                              <p
                                className={`text-sm ${
                                  fundabilityData.companySolidAssetHolding
                                    ? "text-mainGreen"
                                    : "text-gray-400"
                                }`}
                              >
                                {fundabilityData.companySolidAssetHolding
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">
                                Current Liabilities
                              </p>
                              <p
                                className={`text-sm ${
                                  !fundabilityData.companyCurrentLiabilities
                                    ? "text-mainGreen"
                                    : "text-gray-400"
                                }`}
                              >
                                {fundabilityData.companyCurrentLiabilities
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                          </div>

                          {business.businessStage?.toLowerCase() ===
                            "startup" &&
                            fundabilityData.customerLifetimeValue !==
                              undefined &&
                            fundabilityData.customerAcquisitionCost !==
                              undefined && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Customer LTV
                                  </p>
                                  <p className="text-sm">
                                    ${fundabilityData.customerLifetimeValue}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Customer Acquisition Cost
                                  </p>
                                  <p className="text-sm">
                                    ${fundabilityData.customerAcquisitionCost}
                                  </p>
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
                            <p className="text-xs text-gray-400">
                              Business Plan
                            </p>
                            <p
                              className={`text-sm ${
                                fundabilityData.companyBusinessPlan
                                  ? "text-mainGreen"
                                  : "text-gray-400"
                              }`}
                            >
                              {fundabilityData.companyBusinessPlan
                                ? "Available"
                                : "Not Available"}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">Pitch Deck</p>
                            <p
                              className={`text-sm ${
                                fundabilityData.companyPitchDeck
                                  ? "text-mainGreen"
                                  : "text-gray-400"
                              }`}
                            >
                              {fundabilityData.companyPitchDeck
                                ? "Available"
                                : "Not Available"}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">
                              5-Year Cash Flow
                            </p>
                            <p
                              className={`text-sm ${
                                fundabilityData.company5yearCashFlow
                                  ? "text-mainGreen"
                                  : "text-gray-400"
                              }`}
                            >
                              {fundabilityData.company5yearCashFlow
                                ? "Available"
                                : "Not Available"}
                            </p>
                          </div>
                          {business.businessStage?.toLowerCase() !==
                            "startup" && (
                            <div className="flex flex-col">
                              <p className="text-xs text-gray-400">
                                Audited Financials
                              </p>
                              <p
                                className={`text-sm ${
                                  fundabilityData.auditedFinancialStatement
                                    ? "text-mainGreen"
                                    : "text-gray-400"
                                }`}
                              >
                                {fundabilityData.auditedFinancialStatement
                                  ? "Available"
                                  : "Not Available"}
                              </p>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">
                              Legal Issues
                            </p>
                            <p
                              className={`text-sm ${
                                !fundabilityData.companyLegalCases
                                  ? "text-mainGreen"
                                  : "text-red-400"
                              }`}
                            >
                              {fundabilityData.companyLegalCases
                                ? "Pending Cases"
                                : "No Issues"}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400">
                              Required Licenses
                            </p>
                            <p
                              className={`text-sm ${
                                fundabilityData.licensesToOperate
                                  ? "text-mainGreen"
                                  : "text-gray-400"
                              }`}
                            >
                              {fundabilityData.licensesToOperate
                                ? "All Acquired"
                                : "Not Applicable"}
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
                              <p className="text-sm">
                                Your business shows strong fundability. Consider
                                equity financing, venture capital, or
                                traditional bank loans.
                              </p>
                            </div>
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">
                                Your documentation and financial track record
                                position you well for premium funding options.
                              </p>
                            </div>
                          </div>
                        ) : fundabilityData.score >= 60 ? (
                          <div className="space-y-3">
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">
                                Your business shows moderate fundability.
                                Consider angel investors, government grants, or
                                asset-backed loans.
                              </p>
                            </div>
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">
                                Improving your documentation and addressing
                                financial gaps could increase your funding
                                options.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">
                                Your business may benefit from bootstrapping,
                                friends & family funding, or microloans.
                              </p>
                            </div>
                            <div className="flex items-start mb-2">
                              <div className="w-2 h-2 bg-mainGreen rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              <p className="text-sm">
                                Consider addressing key areas in your business
                                structure and documentation before seeking
                                larger funding.
                              </p>
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
                  <CircularProgress value={0} />
                  <p className="mt-4 text-xs lg:text-sm">
                    Loading your fundability score...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[60vh]">
                <div className="text-xs lg:text-sm text-center px-4 max-w-md">
                  <h3 className="text-lg font-semibold mb-3">
                    No Fundability Assessment
                  </h3>
                  <p className="mb-6">
                    Complete a fundability assessment to understand how
                    investment-ready your business is and get recommendations on
                    suitable funding options.
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
                proposal && proposal.length > 0 ? (
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
                        <tr
                          onClick={() => handleNavigation(item.publicId)}
                          key={item.publicId}
                          className="border-b cursor-pointer hover:bg-black border-gray-800"
                        >
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 text-mainGreen">
                            {new Date(
                              item.createdAt || Date.now()
                            ).toLocaleDateString()}
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
                              <span>
                                {item.investor?.companyName || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                item.status === "PENDING"
                                  ? "bg-yellow-500/20 text-yellow-500"
                                  : item.status === "ACCEPTED"
                                  ? "bg-mainGreen/20 text-mainGreen"
                                  : "bg-red-500/20 text-red-500"
                              }`}
                            >
                              {item.status || "PENDING"}
                            </span>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="truncate">
                              {stripHtmlTags(item.proposal) || "No proposal details"}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col justify-center items-center h-[70vh] px-4 py-8 text-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        No Investment Proposals Yet
                      </h3>
                      <p className="text-gray-400 text-sm max-w-md mb-6">
                        When investors show interest in your business, their
                        proposals will appear here. Keep your business profile
                        updated to attract potential investors.
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
                    <h3 className="text-lg font-semibold mb-2">
                      No Deal Room Profile
                    </h3>
                    <p className="text-gray-400 text-sm max-w-md mb-6">
                      Create a Deal Room profile to showcase your business to
                      potential investors and receive investment proposals.
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

            {/* Next button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
              >
                Next: Deal Room Profile
              </button>
            </div>
          </div>
        );

      case 3: // Deal Room Profile
        return (
          <div className="bg-mainBlack rounded-lg p-6 shadow-lg">
            {dealRoomLoading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <p>Loading deal room profile...</p>
              </div>
            ) : dealRoomProfile ? (
              <>
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Image
                        src={
                          dealRoomProfile.businessPhotos &&
                          dealRoomProfile.businessPhotos.length > 0
                            ? dealRoomProfile.businessPhotos[0]
                            : business?.businessLogoUrl || "/assets/logos.svg"
                        }
                        width={100}
                        height={100}
                        alt="business logo"
                        className="rounded-lg object-cover w-[100px] h-[100px]"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-semibold mb-2 text-white">
                        {dealRoomProfile.business?.businessName ||
                          business?.businessName ||
                          "Business Name"}
                      </h2>
                      <p className="text-gray-400 text-sm max-w-2xl">
                        {dealRoomProfile.highlightsOfBusiness ||
                          "No business highlights available"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <Link
                      href={`/dashboard/deal-room/edit-profile?id=${id}`}
                      className="bg-black shadow shadow-white px-3 py-1.5 rounded inline text-sm hover:bg-gray-900 transition"
                    >
                      Edit Deal Room
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
                            <p className="text-xs text-gray-400">
                              Business Name
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.business?.businessName ||
                                business?.businessName ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Email Address
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.business?.businessEmail ||
                                business?.businessEmail ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Phone Number
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.business?.businessPhone ||
                                business?.businessPhone ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm text-white">
                              {business?.location || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Industry</p>
                            <p className="text-sm text-white">
                              {business?.industry || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Funding Details
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.fundingDetails || "Not provided"}
                            </p>
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
                            <p className="text-xs text-gray-400">
                              Top Selling Products
                            </p>
                            <div className="text-sm text-white mt-1">
                              {formatArrayData(
                                dealRoomProfile.topSellingProducts
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Facility Details
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.facilityDetails ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Business Highlights
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.highlightsOfBusiness ||
                                "Not provided"}
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
                            <p className="text-xs text-gray-400">
                              Reason for Funding Need
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.reasonForSale || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Funding required
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.fundingAmount || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Funding Structure
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.fundingStructure ||
                                "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-400">
                              Asset Details
                            </p>
                            <div className="text-sm text-white mt-1">
                              {formatArrayData(dealRoomProfile.assetsDetails)}
                            </div>
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
                            <p className="text-xs text-gray-400">
                              Monthly Sales
                            </p>
                            <p className="text-sm text-white">
                              ₦
                              {(
                                Number(dealRoomProfile.averageMonthlySales) || 0
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Yearly Sales
                            </p>
                            <p className="text-sm text-white">
                              ₦
                              {(
                                Number(dealRoomProfile.reportedYearlySales) || 0
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Profit Margin
                            </p>
                            <p className="text-sm text-white">
                              {dealRoomProfile.profitMarginPercentage || "0"}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">
                              Physical Assets Value
                            </p>
                            <p className="text-sm text-white">
                              ₦
                              {(
                                Number(dealRoomProfile.valueOfPhysicalAssets) ||
                                0
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-400">Valuation</p>
                            <p className="text-sm text-white font-semibold">
                              ₦
                              {(
                                Number(dealRoomProfile.tentativeSellingPrice) ||
                                0
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Preview */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FaImage className="text-mainGreen mr-2" />
                        Gallery Preview
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        {dealRoomProfile.businessPhotos &&
                        dealRoomProfile.businessPhotos.length > 0 ? (
                          <>
                            <div className="grid grid-cols-2 gap-3">
                              {dealRoomProfile.businessPhotos
                                .slice(0, 4)
                                .map((photo, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-video overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
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
                                      <div className="bg-zinc-700 h-full w-full flex items-center justify-center">
                                        <FaFileAlt
                                          size={24}
                                          className="text-gray-400"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                            {dealRoomProfile.businessPhotos.length > 4 && (
                              <div className="mt-3 text-center">
                                <button
                                  onClick={() => setCurrentStep(4)}
                                  className="text-xs text-mainGreen hover:underline"
                                >
                                  View all{" "}
                                  {dealRoomProfile.businessPhotos.length} photos
                                  and documents
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-sm text-gray-400">
                              No photos available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <FaFileAlt className="text-mainGreen mr-2" />
                        Documents
                      </h3>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        {dealRoomProfile.businessDocuments &&
                        dealRoomProfile.businessDocuments.length > 0 ? (
                          <>
                            <div className="space-y-3">
                              {dealRoomProfile.businessDocuments
                                .slice(0, 2)
                                .map((doc, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-zinc-700 rounded-lg"
                                  >
                                    <div className="flex items-center">
                                      <div className="p-2 bg-zinc-600 rounded-lg mr-3">
                                        <FaFileAlt className="text-mainGreen" />
                                      </div>
                                      <div className="truncate max-w-[150px]">
                                        <p className="text-xs font-medium truncate">
                                          {getFileName(doc)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {getFileExtension(doc).toUpperCase()}
                                        </p>
                                      </div>
                                    </div>
                                    <a
                                      href={doc}
                                      download
                                      className="p-1.5 bg-mainGreen/20 text-mainGreen rounded-lg hover:bg-mainGreen/30 transition-colors"
                                    >
                                      <FaDownload size={14} />
                                    </a>
                                  </div>
                                ))}
                            </div>
                            {dealRoomProfile.businessDocuments.length > 2 && (
                              <div className="mt-3 text-center">
                                <button
                                  onClick={() => setCurrentStep(4)}
                                  className="text-xs text-mainGreen hover:underline"
                                >
                                  View all{" "}
                                  {dealRoomProfile.businessDocuments.length}{" "}
                                  documents
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-sm text-gray-400">
                              No documents available
                            </p>
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
                    Next: Documents
                  </button>
                </div>

                {/* Lightbox for photos */}
                {lightboxOpen && dealRoomProfile?.businessPhotos && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                  >
                    <div
                      className="relative max-w-4xl max-h-[80vh] w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2"
                        onClick={closeLightbox}
                      >
                        <IoClose size={24} />
                      </button>

                      <div className="relative h-[80vh]">
                        {dealRoomProfile.businessPhotos[currentImageIndex] && (
                          <>
                            {isImageFile(
                              dealRoomProfile.businessPhotos[currentImageIndex]
                            ) ? (
                              <Image
                                src={
                                  dealRoomProfile.businessPhotos[
                                    currentImageIndex
                                  ]
                                }
                                alt="Gallery image"
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="bg-zinc-800 h-full w-full flex flex-col items-center justify-center">
                                <FaFileAlt
                                  size={80}
                                  className="text-gray-400"
                                />
                                <p className="text-lg mt-4">
                                  {getFileName(
                                    dealRoomProfile.businessPhotos[
                                      currentImageIndex
                                    ]
                                  )}
                                </p>
                                <a
                                  href={
                                    dealRoomProfile.businessPhotos[
                                      currentImageIndex
                                    ]
                                  }
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
                            <p className="text-sm">
                              {currentImageIndex + 1} /{" "}
                              {dealRoomProfile.businessPhotos.length}
                            </p>
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
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage();
                            }}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-[70vh] px-4 py-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    No Deal Room Profile
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mb-6">
                    Create a Deal Room profile to showcase your business to
                    potential investors and receive investment proposals.
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
        );
      case 4: // Documents Tab
        return (
          <div className="bg-mainBlack rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Business Documents
            </h2>

            {dealRoomLoading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <p>Loading documents...</p>
              </div>
            ) : dealRoomProfile &&
              dealRoomProfile.businessDocuments &&
              dealRoomProfile.businessDocuments.length > 0 ? (
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
                          {isImageFile(doc)
                            ? "Image Document"
                            : `${getFileExtension(doc).toUpperCase()} Document`}
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
                {dealRoomProfile && (
                  <div className="mt-6">
                    <Link
                      href={`/dashboard/deal-room/edit-profile?id=${id}`}
                      className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                    >
                      Add Documents
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Photo Gallery */}
            {dealRoomProfile &&
              dealRoomProfile.businessPhotos &&
              dealRoomProfile.businessPhotos.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-mainGreen mb-4">
                    Photo Gallery
                  </h3>

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
                            <p className="text-xs mt-2">
                              {getFileExtension(photo).toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Lightbox */}
                  {lightboxOpen &&
                    dealRoomProfile &&
                    dealRoomProfile.businessPhotos && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                      >
                        <div
                          className="relative max-w-4xl max-h-[80vh] w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2"
                            onClick={closeLightbox}
                          >
                            <IoClose size={24} />
                          </button>

                          <div className="relative h-[80vh]">
                            {dealRoomProfile.businessPhotos[
                              currentImageIndex
                            ] && (
                              <>
                                {isImageFile(
                                  dealRoomProfile.businessPhotos[
                                    currentImageIndex
                                  ]
                                ) ? (
                                  <Image
                                    src={
                                      dealRoomProfile.businessPhotos[
                                        currentImageIndex
                                      ]
                                    }
                                    alt="Gallery image"
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="bg-zinc-800 h-full w-full flex flex-col items-center justify-center">
                                    <FaFileAlt
                                      size={80}
                                      className="text-gray-400"
                                    />
                                    <p className="text-lg mt-4">
                                      {getFileName(
                                        dealRoomProfile.businessPhotos[
                                          currentImageIndex
                                        ]
                                      )}
                                    </p>
                                    <a
                                      href={
                                        dealRoomProfile.businessPhotos[
                                          currentImageIndex
                                        ]
                                      }
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
                                <p className="text-sm">
                                  {currentImageIndex + 1} /{" "}
                                  {dealRoomProfile.businessPhotos.length}
                                </p>
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
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>
                              <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextImage();
                                }}
                              >
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

            {/* Proof of Business */}
            {dealRoomProfile && dealRoomProfile.proofOfBusiness && (
              <div className="mt-10">
                <h3 className="text-lg font-medium text-mainGreen mb-4">
                  Proof of Business
                </h3>
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
                      <p className="text-base mb-2">
                        {getFileName(dealRoomProfile.proofOfBusiness)}
                      </p>
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
              </div>
            )}
          </div>
        );
      case 5:
        return <div>In progress</div>;
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
          onClick={() => handleStepChange(0)}
        >
          Business Overview
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 1 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => handleStepChange(1)}
        >
          Fundability Check
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 5 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => handleStepChange(5)}
        >
          Valuation
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 3 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => handleStepChange(3)}
        >
          Deal Room Profile
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 2 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => handleStepChange(2)}
        >
          Investment Proposals
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 4 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => handleStepChange(4)}
        >
          Documents
        </p>
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
