'use client'
import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck, Users } from 'lucide-react';
import { getValuatedBusiness } from '@/app/services/dashboard';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading';

const filters = ['Fintech', 'Edtech', 'Law', 'eCommerce'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Types for the API response
type Business = {
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
}

type set = {
  set:string;
}

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
  businessPhotos: string[] | set | null;
  proofOfBusiness: string[] ;
  businessDocuments: string[];
  createdAt: string;
  updatedAt: string;
  business: Business;
}

export default function BusinessListings() {
  const [businesses, setBusinesses] = useState<DealRoomProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchBusinesses = async () => {
      try {
        const response = await getValuatedBusiness(token || "");
        if (response?.success) {
          setBusinesses(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error('Unable to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if(loading){
    return <Loading text="Loading" />
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="mb-3">

        <h1 className="text-xl sm:text-2xl font-bold mt-2">Businesses for Sale and Investment Opportunities</h1>
      </div>

      {/* Green Banner */}
      <div className="bg-gradient-to-b from-mainGreen to-mainGreens rounded-lg p-4 sm:p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 lg:justify-between items-start lg:items-center">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold">List your business on Triber</h2>
            <p className="text-sm max-w-2xl">
              Get visibility from 110,000+ member network of Businesses, Investors,
              Acquirers, Lenders and Advisors from 900+ Industries and 170+ Countries
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm">100+ Best professionals for your support</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm">We have Quick, Easy and Trusted partners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buy a Fintech Startup"
              className="w-full bg-mainBlack rounded-lg pl-10 pr-4 py-2 text-white"
            />
          </div>
          <button className="bg-gray-800 px-4 py-2 rounded-lg">Sort By</button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm">Filter by</span>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                className="bg-mainBlack px-4 py-1 rounded-full text-sm"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {businesses.map((business) => (
          <div key={business.id} className="bg-mainBlack rounded-lg overflow-hidden">
            <Link href={`dashboard/business?id=${business.publicId}&businessId=${business.businessId}`}>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm text-emerald-400">{business.business.businessName}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-4">{business.business.businessName}</h3>
                
                <div className="relative w-full h-32 sm:h-40 mb-4">
                  <Image
                    src={(Array.isArray(business.businessPhotos) && business.businessPhotos[0]) || (business.businessPhotos as set)?.set || '/assets/placeholder.jpg'}
                    alt={business.business.businessName}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Profit Margin</p>
                    <p className="font-semibold">{business.profitMarginPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Yearly Sales</p>
                    <p className="font-semibold text-sm sm:text-base">{formatCurrency(business.reportedYearlySales)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Asking Price:</p>
                  <p className="text-lg sm:text-xl font-bold">{formatCurrency(business.tentativeSellingPrice)}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <select className="bg-mainBlack rounded px-2 py-1">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          <span className="text-sm">Row</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 rounded-lg ${
                page === 1 ? 'bg-mainGreen' : 'bg-mainBlack'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-2 py-1 bg-mainBlack rounded-lg">...</button>
          <button className="w-8 h-8 bg-mainBlack rounded-lg">10</button>
        </div>
      </div>
    </div>
  );
}