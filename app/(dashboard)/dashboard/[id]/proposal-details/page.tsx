"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProposalById } from "@/app/services/dashboard";
import { IoChevronBackOutline } from "react-icons/io5";
import Link from "next/link";
import { Proposal } from '@/app/type';
import Loading from '@/app/loading';

const ProposalDetails = () => {
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const searchParams = useSearchParams();
  const proposalId = searchParams.get('proposalId');
  const businessId = searchParams.get('businessId');

  // Fetch proposal by ID
  useEffect(() => {
    const fetchProposal = async () => {
      if (!proposalId) {
        setError("Proposal ID is required");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await getProposalById(token, proposalId);
        if (response && response.success) {
          // The API returns a single proposal object
          if (response.data) {
            setCurrentProposal(response.data);
          } else {
            setError("Proposal not found");
          }
        } else {
          console.error('Failed to fetch proposal:', response?.message);
          setError(response?.message || "Failed to fetch proposal");
        }
      } catch (error) {
        console.error('Error fetching proposal:', error);
        setError("An error occurred while fetching the proposal");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProposal();
  }, [proposalId]);

  // Handle proposal acceptance or rejection
  const handleProposalResponse = async (action:string) => {
    if (!currentProposal) return;
    
    // Here you would implement API call to accept or reject the proposal
    // For example:
    // const response = await updateProposalStatus(token, currentProposal.publicId, action);
    
    alert(`Proposal ${action === 'ACCEPTED' ? 'accepted' : 'rejected'}`);
    
    // After response, you would refresh the proposal data
    // setCurrentProposal({...currentProposal, status: action});
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <Link href="/dashboard" className="text-mainGreen mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProposal) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="mb-4">No proposal found</p>
          <Link href={`/dashboard/${businessId}`} className="text-mainGreen">
            Back to Business Details
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = currentProposal.createdAt ? 
    new Date(currentProposal.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : "Date not available";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <div className="p-4">
        <Link 
          href={`/dashboard/${businessId}`} 
          className="flex items-center text-gray-400 hover:text-mainGreen"
        >
          <IoChevronBackOutline className="mr-1" />
          Back to Business Details
        </Link>
      </div>

      {/* Top Section */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-mainGreen/50 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-mainGreen flex items-center justify-center">
              <span className="font-bold text-mainGreen">₦</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              ₦ {currentProposal.buyingPrice?.toLocaleString() || "0"}
            </div>
            <div className="mt-1">
              <span className={`text-xs px-3 py-1 rounded ${
                currentProposal.status === 'ACCEPTED' 
                  ? 'bg-green-900/20 text-green-500'
                  : currentProposal.status === 'REJECTED'
                  ? 'bg-red-900/20 text-red-500'
                  : 'bg-yellow-800 text-yellow-500'
              }`}>
                {currentProposal.status || "Pending Response"}
              </span>
            </div>
          </div>
        </div>

        {currentProposal.status === 'PENDING' && (
          <div className="flex gap-3">
            <button 
              onClick={() => handleProposalResponse('REJECTED')}
              className="border border-white rounded-md text-sm px-6 py-2 hover:bg-gray-800"
            >
              Reject Proposal
            </button>
            <button 
              onClick={() => handleProposalResponse('ACCEPTED')}
              className="bg-mainGreen rounded-md px-6 py-2 text-sm text-white hover:bg-green-600"
            >
              Accept Proposal
            </button>
          </div>
        )}
      </div>

      {/* Proposal Details */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Proposal Details</h2>
        <div className="bg-mainBlack rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <div className='col-span-1'>
              <p className="text-gray-400 mb-1">Investor</p>
              <p className="text-mainGreen">
                {currentProposal.investor?.companyName || "Unknown Investor"}
              </p>
            </div>
            <div className='col-span-1'>
              <p className="text-gray-400 mb-1">Email</p>
                <p className='text-red-500'>Available upon Connection</p>
            </div>
            <div className='col-span-1'>
              <p className="text-gray-400 mb-1">Phone Number</p>
              <p className='text-red-500'>Available upon Connection</p>
            </div>

            {/* Row 2 */}
            <div>
              <p className="text-gray-400 mb-1">Date</p>
              <p>{formattedDate}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Location</p>
              <p>{currentProposal.investor?.location || "Location not provided"}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Proposed Amount</p>
              <p>₦ {currentProposal.buyingPrice?.toLocaleString() || "Fields to be added soon"}</p>
            </div>

            {/* Row 3 */}
            <div>
              <p className="text-gray-400 mb-1">Status</p>
              <span className={`text-xs px-3 py-1 rounded ${
                currentProposal.status === 'ACCEPTED' 
                  ? 'bg-green-900/20 text-green-500'
                  : currentProposal.status === 'REJECTED'
                  ? 'bg-red-900/20 text-red-500'
                  : 'bg-yellow-800 text-yellow-500'
              }`}>
                {currentProposal.status || "Pending Response"}
              </span>
            </div>
          </div>
          
          {/* Proposal Message */}
          {currentProposal.proposal && (
            <div className="mt-8">
              <p className="text-gray-400 mb-2">Proposal Message</p>
              <div className="bg-zinc-900 p-4 rounded-lg">
                <p>{currentProposal.proposal}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetails;