'use client';

import React, { useState } from 'react';
import Modal from '@/app/components/dashboard/Modal';
import { useUser } from '@/app/components/layouts/UserContext';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { BusinessDetails, DealRoomDetails } from '@/app/type';

const BusinessValuationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const business = user?.businesses;
  const [selectedBusinessId, setSelectedBusinessId] = useState('');

  const handleBusinessSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBusiness = business?.find((b: BusinessDetails) => b.businessName === event.target.value);
    if (selectedBusiness) {
      setSelectedBusinessId(selectedBusiness.publicId);
    }
  };

  const handleContinue = () => {
    const selectedBusiness = business?.find((b: BusinessDetails) => b.publicId === selectedBusinessId);
    
    if (selectedBusiness) {
      if (selectedBusiness.dealRoomDetails) {
        router.push('/dashboard/deal-room/investor-dashboard?id=' + selectedBusinessId);
      } else {
        router.push(`/dashboard/deal-room/valuation?id=${selectedBusinessId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Modal>
        <div className="bg-mainBlack rounded-lg p-6 w-full">
          <h2 className="text-white font-serif lg:text-2xl text-xl font-semibold mb-4">
            Business Valuation
          </h2>
          <p className="text-sm mb-4">
            Select one of your businesses below.
          </p>
          
          <div className="space-y-4">
            <div className="relative">
              <p className="text-sm mb-3">Select Business</p>
              <select
                className="w-full bg-mainBlacks border border-mainBlack text-gray-200 rounded-md py-2 px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-mainGreen"
                onChange={handleBusinessSelect}
                value={selectedBusinessId ? business?.find(b => b.publicId === selectedBusinessId)?.businessName : ''}
              >
                <option value="" disabled>
                  Select Business
                </option>
                {business?.map((business: BusinessDetails) => (
                  <option key={business.publicId} value={business.businessName}>
                    {business.businessName}
                  </option>
                ))}
              </select>
              <FaAngleDown className="absolute right-3 top-1/2 transform translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={handleContinue}
              disabled={!selectedBusinessId}
              className={`w-full font-medium py-2 px-4 mt-5 rounded-md transition-colors duration-200
                ${selectedBusinessId
                  ? 'bg-mainGreen hover:bg-mainGreens text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessValuationPage;