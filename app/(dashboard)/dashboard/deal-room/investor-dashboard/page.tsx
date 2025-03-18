'use client'
import { getAllInvestors } from '@/app/services/dashboard';
import { Investor } from '@/app/type';
import { ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import { useRouter, useSearchParams } from 'next/navigation';

const filterOptions = ["AI/ML", "SaaS", "Fintech", "Edtech"];

const InvestorsList = () => {
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');

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
        // Error handling
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // Navigate to investor details page
  const navigateToInvestorDetails = (publicId: string) => {
    router.push(`/dashboard/deal-room/investor-dashboard/investor-details?id=${publicId}&businessId=${businessId}`);
  };

  // Filter investors based on search term and active filters
  const filteredInvestors = investors.filter(investor => {
    // Handle potential undefined values
    const companyName = investor.companyName || "";
    const about = investor.about || "";
    
    const matchesSearch = searchTerm === "" || 
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      about.toLowerCase().includes(searchTerm.toLowerCase());

    let interestedFactors: string[] = [];
    try {
      interestedFactors = JSON.parse(investor.interestedFactors || "[]");
      if (!Array.isArray(interestedFactors)) interestedFactors = [];
    } catch (e) {
      // Handle JSON parse error
    }

    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.some(filter => interestedFactors.includes(filter));

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInvestors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedInvestors = filteredInvestors.slice(startIndex, startIndex + rowsPerPage);
  
  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const maxButtons = 5;
    let buttons = [];
    
    if (totalPages <= maxButtons) {
      // Show all pages if there are fewer than maxButtons
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 5; i++) {
          buttons.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // In the middle
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          buttons.push(i);
        }
      }
    }
    
    return buttons;
  };

  // Get pagination array
  const paginationButtons = generatePaginationButtons();

  // Handle page change
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
                  // Reset to first page when filter changes
                  setCurrentPage(1);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : paginatedInvestors.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p>No investors found matching your criteria.</p>
          </div>
        ) : (
          paginatedInvestors.map((investor) => {
            // Safely parse JSON strings
            let interestedFactors: string[] = [];
            let interestedLocations: string[] = [];
            
            try {
              interestedFactors = JSON.parse(investor.interestedFactors || "[]");
              if (!Array.isArray(interestedFactors)) interestedFactors = [];
            } catch (e) {
              // Handle JSON parse error
            }
            
            try {
              interestedLocations = JSON.parse(investor.interestedLocations || "[]");
              if (!Array.isArray(interestedLocations)) interestedLocations = [];
            } catch (e) {
              // Handle JSON parse error
            }
            
            return (
              <div 
                key={investor.id} 
                className="bg-mainBlack rounded-xl p-4 sm:p-6 cursor-pointer hover:bg-opacity-80 transition-all duration-300"
                onClick={() => navigateToInvestorDetails(investor.publicId)}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <Image
                    src={investor.companyLogoUrl || '/assets/invest.png'}
                    alt={investor.companyName || 'Company'}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">●</span>
                      <span className="text-xs sm:text-sm">Verified</span>
                    </div>
                    <h3 className="font-medium text-sm sm:text-sm">{investor.designation || 'Investor'}</h3>
                    <p className="text-xs sm:text-sm text-gray-400">{investor.companyName || 'Company'}</p>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm mb-4 line-clamp-3">{investor.about || 'No description available'}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-sm">Funds Under Management:</span>
                    <span className="font-semibold text-sm sm:text-sm">
                      ₦{investor.fundsUnderManagement ? formatNumber(investor.fundsUnderManagement) : '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MdBusinessCenter className="text-gray-400 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm text-gray-400">
                      Interests: {interestedFactors.length > 0 ? interestedFactors.join(", ") : "Not specified"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm text-gray-400">
                      Locations: {interestedLocations.length > 0 ? interestedLocations.join(", ") : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredInvestors.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
            <select 
              className="bg-mainBlack rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">Per Page</span>
            <span className="text-sm ml-4">
              Showing {Math.min(startIndex + 1, filteredInvestors.length)} to {Math.min(startIndex + rowsPerPage, filteredInvestors.length)} of {filteredInvestors.length}
            </span>
          </div>
          
          <div className="flex gap-2">
            {/* Previous page button */}
            <button
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 1 ? 'bg-mainBlack text-gray-500' : 'bg-mainBlack'
              }`}
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            
            {/* First page button (if not in view) */}
            {paginationButtons[0] > 1 && (
              <>
                <button
                  className={`w-8 h-8 rounded-lg text-sm bg-mainBlack`}
                  onClick={() => changePage(1)}
                >
                  1
                </button>
                {paginationButtons[0] > 2 && (
                  <button className="px-2 py-1 bg-mainBlack rounded-lg text-sm">...</button>
                )}
              </>
            )}
            
            {/* Page buttons */}
            {paginationButtons.map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-lg text-sm ${
                  page === currentPage ? 'bg-mainGreen' : 'bg-mainBlack'
                }`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}
            
            {/* Last page button (if not in view) */}
            {paginationButtons[paginationButtons.length - 1] < totalPages && (
              <>
                {paginationButtons[paginationButtons.length - 1] < totalPages - 1 && (
                  <button className="px-2 py-1 bg-mainBlack rounded-lg text-sm">...</button>
                )}
                <button
                  className={`w-8 h-8 rounded-lg text-sm bg-mainBlack`}
                  onClick={() => changePage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            {/* Next page button */}
            <button
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === totalPages ? 'bg-mainBlack text-gray-500' : 'bg-mainBlack'
              }`}
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorsList;