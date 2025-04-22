'use client';

import React, { useState } from 'react';
import { useUser } from '@/app/components/layouts/UserContext';
import { FaCheckCircle, FaPlus, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


const BusinessValuationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const business = user?.businesses;
  const [selectedBusinessId, setSelectedBusinessId] = useState('');

  const handleBusinessSelect = (businessId:string) => {
    setSelectedBusinessId(businessId);
  };

  const handleContinue = () => {
    const selectedBusiness = business?.find((b) => b.publicId === selectedBusinessId);
    
    if (selectedBusiness) {
      if (selectedBusiness.dealRoomDetails) {
        router.push('/dashboard/deal-room/investor-dashboard?id=' + selectedBusinessId);
      } else {
        router.push(`/dashboard/deal-room/valuation?id=${selectedBusinessId}`);
      }
    }
  };
  
  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-mainBlack shadow-sm shadow-white rounded-lg w-11/12 max-w-[40rem] my-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-serif lg:text-2xl text-xl font-semibold mb-4 flex justify-between items-center">
              <span>Deal Room Access</span>
              <button 
                onClick={handleGoHome}
                className="bg-gray-800 hover:bg-gray-700 text-mainGreen text-sm py-2 px-4 rounded-md flex items-center transition-colors"
              >
                <FaHome className="mr-2" />
                Go Home
              </button>
            </h2>
          <p className="text-gray-300 text-sm mb-6">
            Connect with investors and showcase your business potential. Select a business to continue.
          </p>
          
          <div className="space-y-5">
            <h3 className="text-gray-200 font-medium">Your Businesses</h3>
            
            <div className="grid gap-3 max-h-[40vh] overflow-y-auto pr-1">
              {business?.map((item) => (
                <div 
                  key={item.publicId}
                  onClick={() => handleBusinessSelect(item.publicId)}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    selectedBusinessId === item.publicId 
                      ? 'border-mainGreen bg-opacity-10 bg-mainGreen' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{item.businessName}</h4>
                      {item.dealRoomDetails ? (
                        <div className="flex items-center mt-2">
                          <span className="bg-mainGreen bg-opacity-20 text-mainGreen text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <FaCheckCircle className="mr-1" /> Deal Room Ready
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center mt-2">
                          <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            <FaPlus className="mr-1" /> Setup Required
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {item.dealRoomDetails ? 'Enter Deal Room' : 'Create Profile'}
                    </div>
                  </div>
                </div>
              ))}
              
              {business?.length === 0 && (
                <div className="border border-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-400">You haven&apos;t added any businesses yet.</p>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={!selectedBusinessId}
                className={`w-full font-medium py-3 px-4 rounded-md transition-colors duration-200 text-center
                  ${selectedBusinessId
                    ? 'bg-mainGreen hover:bg-mainGreens text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                {selectedBusinessId && business?.find(b => b.publicId === selectedBusinessId)?.dealRoomDetails
                  ? 'Enter Deal Room'
                  : 'Continue to Setup'}
              </button>
              
              <p className="text-gray-400 text-xs mt-3 text-center">
                Businesses with Deal Room profiles can instantly connect with investors. 
                New businesses will need to complete a quick setup process.
              </p>
            </div>
          </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BusinessValuationPage;