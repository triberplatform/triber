"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import { getAllInvestors } from "@/app/services/dashboard";
import { Investor } from "@/app/type";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, MapPin, Clock, Mail, Phone } from "lucide-react";
import { MdBusinessCenter } from "react-icons/md";

export default function InvestorDetails() {
  const searchParams = useSearchParams();
  const publicId = searchParams.get("id") || "";
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const businessId = searchParams.get('businessId');
  const [error, setError] = useState<string | null>(null);

  // Check token validity
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token check on initial load:", token ? "Token exists" : "No token found");
    
    if (!token) {
      console.error("No authentication token found on initial check");
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
          console.error("Token is expired");
          setError("Your session has expired. Please log in again.");
          setLoading(false);
          localStorage.removeItem("token");
          return;
        }
      }
    } catch (error) {
      console.error("Error validating token:", error);
      // Continue anyway as the token might still be valid
    }
  }, []);

  // Log URL parameters for debugging
  useEffect(() => {
    console.log("Current URL:", typeof window !== 'undefined' ? window.location.href : "SSR mode");
    console.log("Extracted publicId:", publicId);
    console.log("Extracted businessId:", businessId);
    
    if (!publicId) {
      console.error("No publicId found in URL parameters");
      setError("Investor ID is missing");
      setLoading(false);
    }
  }, [publicId, businessId]);

  useEffect(() => {
    if (!publicId) return; // Skip if no publicId (already handled in the URL check effect)
    
    setLoading(true);
    console.log("Starting investor fetch for publicId:", publicId);
  
    const fetchInvestors = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token retrieved for API call:", token ? "Yes (exists)" : "No (missing)");
        
        if (!token) {
          console.error("No authentication token found for API call");
          setError("Authentication required");
          setLoading(false);
          return;
        }
        
        // Fetch all investors
        console.log("Calling getAllInvestors API...");
        const response = await getAllInvestors(token);
        console.log("API response received:", response ? `Yes (${response.length} investors)` : "No data");
        
        if (response && Array.isArray(response)) {
          setInvestors(response);
          console.log("Total investors fetched:", response.length);
          
          // Log the first few publicIds for debugging
          const sampleIds = response.slice(0, 5).map(inv => inv.publicId);
          console.log("Sample publicIds in response:", sampleIds);
          
          // Find the specific investor by publicId (case-insensitive)
          const foundInvestor = response.find(inv => 
            inv.publicId.toLowerCase() === publicId.toLowerCase()
          );
          console.log(investors)
          console.log("Investor found:", foundInvestor ? "Yes" : "No");
          
          if (foundInvestor) {
            setInvestor(foundInvestor);
            setError(null);
          } else {
            // Log all publicIds to see what's available
            console.log("Available publicIds:", response.map(inv => inv.publicId));
            console.error("Investor with publicId", publicId, "not found in response");
            setError("Investor not found");
          }
        } else {
          console.error("Invalid response format from API:", response);
          setError("Failed to load investor data");
        }
      } catch (error) {
        console.error("Error fetching investors:", error);
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
  } catch (error) {
    console.error("Error parsing interestedFactors:", error);
    interestedFactors = [];
  }
  
  try {
    interestedLocations = JSON.parse(investor.interestedLocations || "[]");
    if (!Array.isArray(interestedLocations)) interestedLocations = [];
  } catch (error) {
    console.error("Error parsing interestedLocations:", error);
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
      {/* Breadcrumb */}
     
      <h1 className="text-xl font-bold mb-8">Investors Overview</h1>

      <div className="bg-mainBlack rounded-xl p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <Image
              src={investor.companyLogoUrl || "/assets/invest.png"}
              width={80}
              height={80}
              alt={investor.companyName || "Company"}
              className="rounded-full h-[100px] w-[100px] object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {investor.designation || "Investor"} / {investor.companyName || "Company"}
              </h2>
              <p className="text-gray-300 text-sm max-w-2xl">
                {investor.about && investor.about.length > 100 
                  ? `${investor.about.substring(0, 100)}...` 
                  : investor.about || "No description available"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/dashboard/deal-room/investor-dashboard/connect-investor?id=${investor.publicId}&businessId=${businessId}`}
              className="bg-mainGreen text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Send proposal
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="flex items-center gap-3">
            <Phone className="text-gray-400" size={20} />
            <div>
              <p>Available after connection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="text-gray-400" size={20} />
            <div>
              <p>Location: {investor.location || "Not specified"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p>Available after connection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MdBusinessCenter className="text-gray-400" size={20} />
            <div>
              <p>Industry: {interestedFactors.slice(0, 2).join(", ") || "Not specified"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-gray-400" size={20} />
            <div>
              <p>Investors Verification Status: <span className="text-emerald-400">Verified</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="text-gray-400" size={20} />
            <div>
              <p>Local Time: {timeDisplay}</p>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div>
            <p className="mb-2 text-gray-400">Professional Summary:</p>
            <p className="text-white">{investor.about || "No information provided"}</p>
          </div>
          
          <div>
            <p className="mb-2 text-gray-400">Transaction Preference:</p>
            <p className="text-white">Acquiring/Buying a Business</p>
          </div>
        </div>
        
        {/* Investment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div>
            <p className="mb-2 text-gray-400">Investment Criteria:</p>
            <p className="text-white">Well established, proper books, scalable, solid MRR, no customer concentration and should be innovative.</p>
          </div>
          
          <div>
            <div className="flex justify-between items-start">
              <p className="mb-2 text-gray-400">Investment Size</p>
              <div className="text-right">
                {investor.fundsUnderManagement ? (
                  <>
                    <p className="text-xl font-bold">
                      NGN Between {(investor.fundsUnderManagement / 1000000).toFixed(0)} million - {(investor.fundsUnderManagement * 4 / 1000000000).toFixed(2)} billion
                    </p>
                    <p className="text-sm text-gray-400">
                      (Native Currency: USD {(investor.fundsUnderManagement / 500).toLocaleString()})
                    </p>
                  </>
                ) : (
                  <p>Not specified</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sector and Location Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div>
            <p className="mb-2 text-gray-400">Sector Preference:</p>
            <p className="text-white">{interestedFactors.length > 0 ? interestedFactors.join(", ") : "Not specified"}</p>
          </div>
          
          <div>
            <p className="mb-2 text-gray-400">Location Preference:</p>
            <p className="text-white">{interestedLocations.length > 0 ? interestedLocations.join(", ") : "Not specified"}</p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mt-8">
          <p className="text-sm mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {interestedFactors.map((factor, index) => (
              <span 
                key={index} 
                className="bg-mainBlacks px-3 py-1 rounded-full text-sm"
              >
                {factor}
              </span>
            ))}
            <span className="bg-mainBlacks px-3 py-1 rounded-full text-sm">
              {investor.companyType && Array.isArray(investor.companyType) 
                ? investor.companyType[0] 
                : "Investor"}
            </span>
          </div>
        </div>
        {/* Disclaimer */}
        <div className="mt-12 text-xs text-gray-500 border-t border-gray-800 pt-6">
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