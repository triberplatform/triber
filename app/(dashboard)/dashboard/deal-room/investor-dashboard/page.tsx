'use client'
import { getAllInvestors } from '@/app/services/dashboard';
import { Investor } from '@/app/type';
import { ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';



const filterOptions = ["AI/ML", "SaaS", "Fintech", "Edtech"];

const InvestorsList = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const token = localStorage.getItem('token'); // Or however you manage your auth token
        if (!token) return;
        
        const response = await getAllInvestors(token);
        if (response) {
          setInvestors(response);
        }
      } catch (error) {
        console.error('Error fetching investors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Filter investors based on search term and active filters
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = searchTerm === "" || 
      investor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.about.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.some(filter => 
        JSON.parse(investor.interestedFactors).includes(filter)
      );

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="text-white">
      {/* Header Section */}
      <div className="mb-3">
        <h1 className="text-xl sm:text-2xl font-bold mt-2">Connect with Verified Investors and Buyers</h1>
      </div>

      {/* Green Banner */}
      <div className="bg-gradient-to-b from-mainGreen to-mainGreens rounded-lg p-4 sm:p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 lg:justify-between items-start lg:items-center">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold">Connect with investors on Triber</h2>
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

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center bg-mainBlack rounded-lg p-3">
          <FaSearch className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search investors..."
            className="bg-transparent border-none outline-none w-full text-white text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm">Filter by</span>
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`px-3 sm:px-4 py-1 rounded-full text-sm ${
                  activeFilters.includes(filter)
                    ? 'bg-mainBlacks'
                    : 'bg-mainBlack'
                }`}
                onClick={() => {
                  if (activeFilters.includes(filter)) {
                    setActiveFilters(activeFilters.filter(f => f !== filter));
                  } else {
                    setActiveFilters([...activeFilters, filter]);
                  }
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          filteredInvestors.map((investor) => (
            <div key={investor.id} className="bg-mainBlack rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <Image
                  src={investor.companyLogoUrl || '/assets/invest.png'}
                  alt={investor.companyName}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-xs">●</span>
                    <span className="text-xs sm:text-sm">Verified</span>
                  </div>
                  <h3 className="font-medium text-sm sm:text-base">{investor.designation}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{investor.companyName}</p>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm mb-4">{investor.about}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg">Funds Under Management:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    ₦{(investor.fundsUnderManagement).toLocaleString('en-NG')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MdBusinessCenter className="text-gray-400 text-sm sm:text-base" />
                  <span className="text-xs sm:text-sm text-gray-400">
                    Interests: {JSON.parse(investor.interestedFactors).join(", ")}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400 text-sm sm:text-base" />
                  <span className="text-xs sm:text-sm text-gray-400">
                    Locations: {JSON.parse(investor.interestedLocations).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <select className="bg-mainBlack rounded px-2 py-1 text-sm">
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
              className={`w-8 h-8 rounded-lg text-sm ${
                page === currentPage ? 'bg-mainGreen' : 'bg-mainBlack'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button className="px-2 py-1 bg-mainBlack rounded-lg text-sm">...</button>
          <button className="w-8 h-8 bg-mainBlack rounded-lg text-sm">10</button>
        </div>
      </div>
    </div>
  );
};

export default InvestorsList;