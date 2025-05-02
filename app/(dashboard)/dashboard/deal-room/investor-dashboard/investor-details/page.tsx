"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import { getAllInvestors } from "@/app/services/dashboard";
import { Investor } from "@/app/type";
import { useSearchParams } from "next/navigation";
import {  MapPin,  Mail, Phone, Building, Briefcase, Target, Globe, DollarSign } from "lucide-react";


export default function InvestorDetails() {
  const searchParams = useSearchParams();
  const publicId = searchParams.get("id") || "";
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const businessId = searchParams.get('businessId');
  const [error, setError] = useState<string | null>(null);

  // Check token validity
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }
    
    // Optionally validate token format/expiry if you're using JWT
    try {
      // This assumes JWT format - adjust if using a different token format
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const tokenData = JSON.parse(atob(tokenParts[1]));
        if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
          setError("Your session has expired. Please log in again.");
          setLoading(false);
          localStorage.removeItem("token");
          return;
        }
      }
    } catch {
      // Continue anyway as the token might still be valid
    }
  }, []);

  // Log URL parameters for debugging
  useEffect(() => {
    if (!publicId) {
      setError("Investor ID is missing");
      setLoading(false);
    }
  }, [publicId, businessId]);

  useEffect(() => {
    if (!publicId) return; // Skip if no publicId (already handled in the URL check effect)
    
    setLoading(true);
  
    const fetchInvestors = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }
        
        // Fetch all investors
        const response = await getAllInvestors(token);
        
        if (response && Array.isArray(response)) {
          // Find the specific investor by publicId (case-insensitive)
          const foundInvestor = response.find(inv => 
            inv.publicId.toLowerCase() === publicId.toLowerCase()
          );
          
          if (foundInvestor) {
            setInvestor(foundInvestor);
            setError(null);
          } else {
            setError("Investor not found");
          }
        } else {
          setError("Failed to load investor data");
        }
      } catch {
        setError("Error loading investor data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvestors();
  }, [publicId]); // Add publicId as a dependency
  
  if (loading) {
    return <Loading text="Loading investor details" />;
  }

  if (error || !investor) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-xl font-bold mb-4">
          {error || "Investor Not Found"}
        </h2>
        <p className="mb-4">
          {error === "Investor not found" 
            ? "The investor you're looking for could not be found."
            : "We encountered an issue while loading this investor's information."}
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {error === "Investor not found"
            ? "This could be due to the investor being removed or an incorrect URL."
            : "Please try again later or contact support if the problem persists."}
        </p>
        <Link
          href="/dashboard/deal-room/investor-dashboard"
          className="bg-mainGreen text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Back to Investors
        </Link>
      </div>
    );
  }

  // Try/catch for JSON parsing to handle potential corrupted data
  let interestedFactors = [];
  let interestedLocations = [];
  
  try {
    interestedFactors = JSON.parse(investor.interestedFactors || "[]");
    if (!Array.isArray(interestedFactors)) interestedFactors = [];
  } catch {
    interestedFactors = [];
  }
  
  try {
    interestedLocations = JSON.parse(investor.interestedLocations || "[]");
    if (!Array.isArray(interestedLocations)) interestedLocations = [];
  } catch {
    interestedLocations = [];
  }
  
  // Format time
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  
  // Determine timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeDisplay = `${formattedTime} (${timezone.includes('/') ? timezone.split('/')[1].replace('_', ' ') : timezone})`;

  return (
    <div className="font-sansSerif text-white">
      <h1 className="text-xl font-bold mb-6">Investor Overview</h1>

      <div className="bg-mainBlack rounded-lg p-6 shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Image
                src={investor.companyLogoUrl || "/assets/invest.png"}
                width={100}
                height={100}
                alt={investor.companyName || "Company"}
                className="rounded-lg object-cover w-[100px] h-[100px]"
              />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-semibold mb-2 text-white">
                {investor.designation || "Investor"} / {investor.companyName || "Company"}
              </h2>
              <p className="text-gray-400 text-sm max-w-2xl">
                {investor.about && investor.about.length > 100 
                  ? `${investor.about.substring(0, 100)}...` 
                  : investor.about || "No description available"}
              </p>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <Link
              href={`/dashboard/deal-room/investor-dashboard/connect-investor?id=${investor.publicId}&businessId=${businessId}`}
              className="bg-mainGreen text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Send Proposal
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Investor Profile */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Briefcase className="text-mainGreen mr-2" size={20} /> 
                Investor Profile
              </h3>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400">Professional Summary</p>
                    <p className="text-sm text-white mt-1">
                      {investor.about || "No information provided"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Investor Type</p>
                      <p className="text-sm text-white">
                        {investor.companyType && Array.isArray(investor.companyType) 
                          ? investor.companyType[0] 
                          : "Investor"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Verification Status</p>
                      <p className="text-sm text-emerald-400">Verified</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Transaction Preference</p>
                      <p className="text-sm text-white">Acquiring/Buying a Business</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Local Time</p>
                      <p className="text-sm text-white">{timeDisplay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Mail className="text-mainGreen mr-2" size={20} /> 
                Contact Information
              </h3>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={16} />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm text-red-400">Available after connection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={16} />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm text-red-400">Available after connection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={16} />
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm text-white">{investor.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Location Preferences */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Globe className="text-mainGreen mr-2" size={20} /> 
                Location Preferences
              </h3>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Preferred Locations</p>
                  {interestedLocations.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {interestedLocations.map((location, index) => (
                        <span 
                          key={index} 
                          className="bg-zinc-700 px-3 py-1 rounded-full text-xs text-white"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white">No specific location preferences</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Investment Criteria */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <DollarSign className="text-mainGreen mr-2" size={20} /> 
                Investment Criteria
              </h3>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400">Investment Requirements</p>
                    <p className="text-sm text-white mt-1">
                      Well established, proper books, scalable, solid MRR, no customer concentration and should be innovative.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Investment Size</p>
                    <div className="mt-1">
                      {investor.fundsUnderManagement ? (
                        <>
                          <p className="text-lg font-semibold text-white">
                            ₦{investor.fundsUnderManagement.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-white">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Industry Focus */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Building className="text-mainGreen mr-2" size={20} /> 
                Industry Focus
              </h3>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Investment of Interests</p>
                {interestedFactors.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interestedFactors.map((factor, index) => (
                      <span 
                        key={index} 
                        className="bg-zinc-700 px-3 py-1 rounded-full text-xs text-white"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white">No specific industry preferences</p>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Target className="text-mainGreen mr-2" size={20} /> 
                Key Tags
              </h3>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {interestedFactors.slice(0, 6).map((factor, index) => (
                    <span 
                      key={index} 
                      className="bg-mainBlacks px-3 py-1 rounded-full text-xs"
                    >
                      {factor}
                    </span>
                  ))}
                  <span className="bg-mainBlacks px-3 py-1 rounded-full text-xs">
                    {investor.companyType && Array.isArray(investor.companyType) 
                      ? investor.companyType[0] 
                      : "Investor"}
                  </span>
                  {investor.location && (
                    <span className="bg-mainBlacks px-3 py-1 rounded-full text-xs">
                      {investor.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-8 text-xs text-gray-500 border-t border-gray-800 pt-6">
          <p>
            Disclaimer: Triber is a regulated marketplace for connecting business sell sides with investors, buyers, lenders and 
            advisors. Neither Triber represents nor guarantees that the information mentioned above is complete or correct. Note 
            that Triber is not liable for any loss, damage, costs, claims and expenses whatsoever arising from transacting with any 
            other user from the website. The final responsibility of conducting a thorough due diligence and taking the transaction 
            forward lies with the users. Please read best practices on Triber.
          </p>
        </div>
      </div>
    </div>
  );
}