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

   useEffect(() => {
    setLoading(true);
  
    const fetchInvestors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          setLoading(false);
          return;
        }
        
        // Fetch all investors
        const response = await getAllInvestors(token);
        if (response) {
          setInvestors(response);
          
          // Find the specific investor by publicId
          const foundInvestor = response.find(inv => inv.publicId === publicId);
          if (foundInvestor) {
            setInvestor(foundInvestor);
          } else {
            console.error("Investor with publicId", publicId, "not found in response");
          }
        }
      } catch (error) {
        console.error("Error fetching investors:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvestors();
  }, [publicId]); // Add publicId as a dependency
  
  if (loading) {
    return <Loading text="Loading investor details" />;
  }

  if (!investor) {
    return <p className="text-center text-white">Investor not found</p>;
  }

  // Parse JSON strings for display
  const interestedFactors = JSON.parse(investor.interestedFactors);
  const interestedLocations = JSON.parse(investor.interestedLocations);
  
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
              alt={investor.companyName}
              className="rounded-full h-[100px] w-[100px] object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {investor.designation} / {investor.companyName}
              </h2>
              <p className="text-gray-300 text-sm max-w-2xl">
                {investor.about.length > 100 
                  ? `${investor.about.substring(0, 100)}...` 
                  : investor.about}
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
              <p>Location: {investor.location}</p>
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
              <p>Industry: {interestedFactors.slice(0, 2).join(", ")}</p>
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
            <p className="text-white">{investor.about}</p>
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
                <p className="text-xl font-bold">NGN Between {(investor.fundsUnderManagement / 1000000).toFixed(0)} million - {(investor.fundsUnderManagement * 4 / 1000000000).toFixed(2)} billion</p>
                <p className="text-sm text-gray-400">(Native Currency: USD {(investor.fundsUnderManagement / 500).toLocaleString()})</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sector and Location Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div>
            <p className="mb-2 text-gray-400">Sector Preference:</p>
            <p className="text-white">{interestedFactors.join(", ")}</p>
          </div>
          
          <div>
            <p className="mb-2 text-gray-400">Location Preference:</p>
            <p className="text-white">{interestedLocations.join(", ")}</p>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mt-8">
          <p className="text-sm mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {interestedFactors.map((factor: string, index: number) => (
              <span 
                key={index} 
                className="bg-mainBlacks px-3 py-1 rounded-full text-sm"
              >
                {factor}
              </span>
            ))}
            <span className="bg-mainBlacks px-3 py-1 rounded-full text-sm">
              {investor.companyType && Array.isArray(investor.companyType) ? investor.companyType[0] : "Investor"}
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