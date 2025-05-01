"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProposalById, acceptProposal, rejectProposal } from "@/app/services/dashboard";
import { IoChevronBackOutline, IoClose } from "react-icons/io5";
import Link from "next/link";
import { Proposal } from '@/app/type';
import Loading from '@/app/loading';

// Modal components
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-70" onClick={onClose}></div>
      <div className="relative bg-zinc-900 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  actionText: string;
  actionButtonClass: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  actionText,
  actionButtonClass
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <p className="text-white">Are you sure you want to {actionText.toLowerCase()} this proposal?</p>
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-2 px-4 bg-zinc-800 rounded-md hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-2 px-4 rounded-md ${actionButtonClass}`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  isSuccess: boolean;
}

const StatusModal: React.FC<StatusModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message,
  isSuccess
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center gap-4 py-4">
        {isSuccess ? (
          <div className="text-green-500 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor">
              <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ) : (
          <div className="text-red-500 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <p className="text-center">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 py-2 px-6 bg-mainGreen rounded-md hover:bg-green-600 text-white"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

// Main component
const ProposalDetails = () => {
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter()
  
 
 
  const params = useParams()
    const proposalId = params.id
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

  // Handle proposal acceptance
  const handleAcceptProposal = async () => {
    if (!currentProposal || !proposalId) return;
    
    setIsProcessing(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setStatusMessage("Authentication required");
      setIsSuccess(false);
      setShowStatusModal(true);
      setIsProcessing(false);
      return;
    }
    
    try {
      const response = await acceptProposal(token, proposalId);
      
      if (response.success) {
        setStatusMessage("You've accepted the proposal.");
        setIsSuccess(true);
        // Update the local state to reflect the change
        setCurrentProposal({
          ...currentProposal,
          status: 'ACCEPTED'
        });
      } else {
        setStatusMessage(response.message || "Something went wrong, try that again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
      setStatusMessage("Something went wrong, try that again.");
      setIsSuccess(false);
    } finally {
      setShowAcceptModal(false);
      setShowStatusModal(true);
      setIsProcessing(false);
    }
  };

  // Handle proposal rejection
  const handleRejectProposal = async () => {
    if (!currentProposal || !proposalId) return;
    
    setIsProcessing(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      setStatusMessage("Authentication required");
      setIsSuccess(false);
      setShowStatusModal(true);
      setIsProcessing(false);
      return;
    }
    
    try {
      const response = await rejectProposal(token, proposalId);
      
      if (response.success) {
        setStatusMessage("You've rejected the proposal.");
        setIsSuccess(true);
        // Update the local state to reflect the change
        setCurrentProposal({
          ...currentProposal,
          status: 'REJECTED'
        });
      } else {
        setStatusMessage(response.message || "Something went wrong, try that again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      setStatusMessage("Something went wrong, try that again.");
      setIsSuccess(false);
    } finally {
      setShowRejectModal(false);
      setShowStatusModal(true);
      setIsProcessing(false);
    }
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
  const navigateToBusiness =()=> {
    router.push(`/dashboard/deal-room/dashboard/business?id=${currentProposal?.business?.dealRoomDetails.publicId}&businessId=${currentProposal?.businessId}`)
  }


  if (!currentProposal) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="mb-4">No proposal found</p>
          <Link href={`/dashboard/investor`} className="text-mainGreen">
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
          href={`/dashboard/investor`} 
          className="flex items-center text-gray-400 hover:text-mainGreen"
        >
          <IoChevronBackOutline className="mr-1" />
          Back to Investor Dashboard
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
              ₦ {currentProposal.buyingPrice?.toLocaleString() || currentProposal.business?.dealRoomDetails.tentativeSellingPrice || "0"}
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

      
          <div className="flex gap-3">

<button 
              onClick={navigateToBusiness}
              className="border border-white rounded-md text-sm px-6 py-2 hover:bg-gray-800"
              disabled={isProcessing}
            >
            View Business Details
            </button>
            {currentProposal.status === 'PENDING' && (
                 <div className="flex gap-3">
            <button 
              onClick={() => setShowRejectModal(true)}
              className="border border-white rounded-md text-sm px-6 py-2 hover:bg-gray-800"
              disabled={isProcessing}
            >
              Reject Proposal
            </button>
            <button 
              onClick={() => setShowAcceptModal(true)}
              className="bg-mainGreen rounded-md px-6 py-2 text-sm text-white hover:bg-green-600"
              disabled={isProcessing}
            >
              Accept Proposal
            </button>
  </div>
        )}
                </div>
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
              <p>₦{currentProposal.buyingPrice?.toLocaleString() || currentProposal.business?.dealRoomDetails.tentativeSellingPrice || "0"}</p>
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
      
      {/* Modals */}
      <ConfirmModal 
        isOpen={showAcceptModal} 
        onClose={() => setShowAcceptModal(false)} 
        onConfirm={handleAcceptProposal}
        title="Accept Proposal"
        actionText="Accept"
        actionButtonClass="bg-mainGreen text-white hover:bg-green-600"
      />
      
      <ConfirmModal 
        isOpen={showRejectModal} 
        onClose={() => setShowRejectModal(false)} 
        onConfirm={handleRejectProposal}
        title="Reject Proposal"
        actionText="Reject"
        actionButtonClass="bg-red-600 text-white hover:bg-red-700"
      />
      
      <StatusModal 
        isOpen={showStatusModal} 
        onClose={() => setShowStatusModal(false)} 
        title={isSuccess ? "Success" : "Error"}
        message={statusMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default ProposalDetails;