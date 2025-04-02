"use client";
import { useUser } from "@/app/components/layouts/UserContext";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsArrowUpRight } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Define the Proposal type
type Proposal = {
  id: number;
  publicId: string;
  businessId: string;
  investorId: string;
  buyingPrice: number | null;
  sellingPrice: number | null;
  fundingAmount: number | null;
  proposal: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  business?: {
    businessName: string;
    businessEmail: string;
    businessLogoUrl?: string;
  };
};

// Define the response type
type ProposalResponse = {
  success: boolean;
  message: string;
  data: Proposal[];
};

// Import the existing API function
import { getInvestorProposals } from "@/app/services/dashboard";

// Truncate text component with "View More" functionality
const TruncatedText = ({ text, maxLength = 100 }: { text: string, maxLength?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return <p className="text-gray-400 italic">No proposal details</p>;
  
  if (text.length <= maxLength) return <p>{text}</p>;
  
  return (
    <div>
      <p>
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-mainGreen mt-1 text-xs hover:underline"
      >
        {isExpanded ? (
          <>
            View Less <IoMdArrowDropup className="ml-1" />
          </>
        ) : (
          <>
            View More <IoMdArrowDropdown className="ml-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default function InvestorProfile() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch proposals when component mounts
  useEffect(() => {
    const fetchProposals = async () => {
      if (!user?.investorProfile?.publicId) return;
      
      const token = localStorage.getItem("token");
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await getInvestorProposals(token, user.investorProfile.publicId);
        if (response && response.success) {
          setProposals(response.data || []);
        } else {
          console.error('Failed to fetch proposals:', response?.message);
          setProposals([]);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposals();
  }, [user?.investorProfile?.publicId]);
  
  if (!user) {
    return <p>No user details available</p>;
  }

  const handleEdit = () => {
    router.push(`/dashboard/investor/edit-investor?id=${user.investorProfile.publicId}`);
  };

  const renderTabContent = () => {
    switch (currentStep) {
      case 0: // Proposals Received
        return (
          <div className="bg-mainBlack rounded-lg p-4 mt-4">
            <h2 className="text-lg mb-4">Proposals Submitted</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading proposals...</p>
              </div>
            ) : proposals && proposals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left">SL No</th>
                      <th className="px-4 py-3 text-left">Proposal Date</th>
                      <th className="px-4 py-3 text-left">Business Name</th>
                      <th className="px-4 py-3 text-left">Proposed Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                 
                      <th className="px-4 py-3 text-left">Proposal</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.map((item, index) => (
                      <tr key={item.publicId} className="border-b border-zinc-800">
                        <td className="px-4 py-3">{String(index + 1).padStart(2, '0')}.</td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.business?.businessLogoUrl && (
                              <Image
                                src={item.business.businessLogoUrl}
                                width={24}
                                height={24}
                                alt="business logo"
                                className="rounded-full hidden"
                              />
                            )}
                            <span>{item.business?.businessName || "Unknown Business"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {item.sellingPrice ? (
                            <p className="text-sm">NGN {item.sellingPrice.toLocaleString()}</p>
                          ) : item.fundingAmount ? (
                            <p className="text-sm">NGN {item.fundingAmount.toLocaleString()}</p>
                          ) : item.buyingPrice ? (
                            <p className="text-sm">NGN {item.buyingPrice.toLocaleString()}</p>
                          ) : (
                            <p className="text-xs text-gray-400">Not specified</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            className={`px-3 py-1 text-xs rounded-full inline-flex items-center ${
                              item.status === 'PENDING' 
                                ? 'bg-blue-500/20 text-blue-400'
                                : item.status === 'ACCEPTED'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-red-500/20 text-red-500'
                            }`}
                          >
                            <span className="relative flex h-2 w-2 mr-1">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                item.status === 'PENDING' ? 'bg-blue-400' : 
                                item.status === 'ACCEPTED' ? 'bg-green-400' : 'bg-red-400'
                              }`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                item.status === 'PENDING' ? 'bg-blue-500' : 
                                item.status === 'ACCEPTED' ? 'bg-green-500' : 'bg-red-500'
                              }`}></span>
                            </span>
                            {item.status || "In-progress"}
                          </span>
                        </td>
                 
                        <td className="px-4 py-3 max-w-xs">
                          <div className="w-64">
                            <TruncatedText text={item.proposal} maxLength={80} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link 
                            href={`/dashboard/deal-room/dashboard/business?id=${item.publicId}&businessId=${item.businessId}`}
                            className="text-blue-400 hover:underline text-xs"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-60 px-4 py-8 text-center bg-mainBlacks rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Proposals Submitted Yet</h3>
                  <p className="text-gray-400 text-sm max-w-md mb-6">
                    When you submit investment proposals to businesses, they will appear here. Browse the marketplace to find businesses to invest in.
                  </p>
                  <Link 
                    href="/dashboard/deal-room/dashboard"
                    className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      
      case 1: // Businesses Engaged
        return (
          <div className="bg-mainBlack rounded-lg p-4 mt-4">
            <h2 className="text-lg mb-4">Businesses Engaged</h2>
            
            <div className="flex flex-col justify-center items-center h-60 px-4 py-8 text-center bg-mainBlacks rounded-lg">
              <div>
                <h3 className="text-lg font-semibold mb-2">No Businesses Engaged Yet</h3>
                <p className="text-gray-400 text-sm max-w-md mb-6">
                  When businesses accept your proposals, they will appear here. Submit proposals to businesses you're interested in to start engaging.
                </p>
               
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Title */}
      <h1 className="lg:text-2xl text-lg mb-4">
        {user.firstname} {user.lastname}
      </h1>
      
      {/* Main Grid */}
      <div className="lg:grid lg:grid-cols-10 gap-4 mb-4">
        {/* Profile Info */}
        <div className="col-span-6 bg-mainBlack p-4 mb-3 lg:mb-0 rounded-xl">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg">Profile Info</h2>
            <button 
              onClick={handleEdit}
              className="flex items-center gap-1 text-sm bg-mainBlacks hover:bg-gray-700 px-3 py-1 rounded-md transition duration-200"
            >
              <FiEdit className="text-gray-300" /> 
              <span>Edit</span>
            </button>
          </div>
          
          <div className="flex lg:gap-6">
            <div className="w-24 shrink-0">
            {user.investorProfile.companyLogoUrl ? ( <Image
                src={user.investorProfile.companyLogoUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full"
              />): (<CgProfile className="w-full h-full text-gray-400" size={96} />)} 
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Date Joined:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Company Name:</span>
                <span>{user.investorProfile?.companyName || 'Fintech'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Location:</span>
                <span>{user.investorProfile?.location || 'Nigeria'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Email Address:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="col-span-2 mb-3 lg:mb-0 flex flex-col justify-between bg-mainBlack p-4 rounded-xl">
          <p className=" mb-2 text-sm">Total Businesses Engaged</p>
          <p className="text-xl">0</p>
        </div>

        <div className="col-span-2 flex lg:flex-col justify-between gap-2">
          <div className="bg-mainBlack w-full p-4 rounded-xl">
            <p className="mb-1 text-sm">Proposals Submitted</p>
            <p className="text-xl">{proposals.length}</p>
          </div>
          
          <div className="bg-mainBlack w-full p-4 rounded-xl">
            <p className=" text-sm mb-1">Deals Closed</p>
            <p className="text-xl">0</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid lg:grid-cols-9 gap-4 font-sansSerif mb-4">
        <div className="col-span-3 bg-mainGreens p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsArrowUpRight />
            <p>Buy a Business<br />Invest Equity in a Business</p>
          </div>
          <p className="w-[70%] text-sm">
            Connect, and close deals with top investors today!
          </p>
        </div>

        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsArrowUpRight />
            <p>Fund a Business<br />Debt Transaction</p>
          </div>
          <p className="w-[70%] text-sm">
            Find opportunities, connect with founders, and grow your portfolio.
          </p>
        </div>

        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsArrowUpRight />
            <p>Deal Room</p>
          </div>
          <p className="w-[70%] text-sm">
            Connect, negotiate, and finalize investments all in one place.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-6 mt-8 mb-2 border-b border-gray-800">
        <button
          className={`pb-2 px-1 text-sm font-medium ${
            currentStep === 0 ? "border-b-2 border-mainGreen text-mainGreen" : "text-gray-400"
          }`}
          onClick={() => setCurrentStep(0)}
        >
          Proposals Submitted
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium ${
            currentStep === 1 ? "border-b-2 border-mainGreen text-mainGreen" : "text-gray-400"
          }`}
          onClick={() => setCurrentStep(1)}
        >
          Businesses Engaged
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}