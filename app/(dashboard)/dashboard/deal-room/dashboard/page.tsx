"use client";
import React, { useEffect, useState } from "react";
import { Search, ShieldCheck, Users } from "lucide-react";
// import { getValuatedBusiness } from '@/app/services/dashboard';
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import { useSearchParams, useRouter } from "next/navigation";
import { RxCrossCircled } from "react-icons/rx";
import { MdVerified } from "react-icons/md";

const filters = ["Finance", "Health", "Education", "Media", "Other"];

const formatCurrency = (amount: number) => {
  // Format with commas directly in case Intl doesn't work as expected
  try {
    return "₦" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return "₦" + amount;
  }
};

// Types for the API response
type Business = {
  publicId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessVerificationStatus?: boolean; // Add this line
};

type Set = {
  set: string;
};

type DealRoomProfile = {
  id: number;
  publicId: string;
  businessId: string;
  topSellingProducts: string[] | string;
  highlightsOfBusiness: string;
  facilityDetails: string;
  fundingDetails: string;
  averageMonthlySales: number;
  reportedYearlySales: number;
  profitMarginPercentage: number;
  assetsDetails: string[] | string;
  valueOfPhysicalAssets: number;
  tentativeSellingPrice: number;
  reasonForSale: string;
  businessPhotos: string[] | Set | null;
  proofOfBusiness: string[];
  businessDocuments: string[];
  createdAt: string;
  updatedAt: string;
  business: Business;
};

type PaginationMetadata = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ApiResponse = {
  success: boolean;
  data: {
    businesses: DealRoomProfile[];
    metadata: PaginationMetadata;
  };
};

export default function BusinessListings() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get pagination parameters from URL query or use defaults
  const currentPage = Number(searchParams.get("page") || 1);
  const rowsPerPage = Number(searchParams.get("limit") || 20);

  const [businesses, setBusinesses] = useState<DealRoomProfile[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata>({
    total: 0,
    page: currentPage,
    limit: rowsPerPage,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to update URL with search params
  const updateUrlParams = (page: number, limit: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    router.push(`?${params.toString()}`);
  };

  // Fetch businesses with server-side pagination
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        // Create URL with query parameters
        const apiUrl = `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/dealroom/businesses?page=${currentPage}&limit=${rowsPerPage}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data?.success) {
          if (Array.isArray(data.data.businesses)) {
            setBusinesses(data.data.businesses);
            setMetadata(data.data.metadata);
          } else {
            console.error(
              "API response businesses is not an array:",
              data.data
            );
            setBusinesses([]);
            setError("Received invalid data format from server");
          }
        } else {
          console.error("API response unsuccessful:", data);
          setBusinesses([]);
          setError("Failed to fetch businesses");
        }
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setBusinesses([]);
        setError("An error occurred while fetching businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [currentPage, rowsPerPage]);

  // Filter businesses based on search - note: ideally this would be server-side too
  const filteredBusinesses = Array.isArray(businesses)
    ? businesses.filter((business) => {
        return (
          searchTerm === "" ||
          (business.business?.businessName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (business.highlightsOfBusiness || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      })
    : [];

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const totalPages = metadata.totalPages;
    const maxButtons = 5;
    const buttons = [];

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
    if (newPage < 1 || newPage > metadata.totalPages) return;
    updateUrlParams(newPage, rowsPerPage);
  };

  // Handle rows per page change
  const changeRowsPerPage = (newSize: number) => {
    updateUrlParams(1, newSize); // Reset to page 1 when changing page size
  };

  // Toggle filter
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
    // Reset to first page when filter changes
    updateUrlParams(1, rowsPerPage);
  };

  // Get business photo URL
  const getBusinessPhotoUrl = (photos: string[] | Set | null): string => {
    if (!photos) return "/assets/placeholder.jpg";

    if (Array.isArray(photos) && photos.length > 0) {
      return photos[0];
    }

    if (typeof photos === "object" && "set" in photos && photos.set) {
      return photos.set;
    }

    return "/assets/placeholder.jpg";
  };

  if (loading) {
    return <Loading text="Loading businesses" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
        <button
          className="mt-4 bg-mainGreen px-4 py-2 rounded-lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-xl sm:text-2xl font-bold mt-2">
          Businesses for Sale and Investment Opportunities
        </h1>
      </div>

      {/* Green Banner */}
      <div className="bg-gradient-to-b from-mainGreen to-mainGreens rounded-lg p-4 sm:p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 lg:justify-between items-start lg:items-center">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              List your business on Triber
            </h2>
            <p className="text-sm max-w-2xl">
              Get visibility from 110,000+ member network of Businesses,
              Investors, Acquirers, Lenders and Advisors from 900+ Industries
              and 170+ Countries
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm">
                100+ Best professionals for your support
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm">
                We have Quick, Easy and Trusted partners
              </p>
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Note: In a production app, you'd want to debounce this
                // and make it server-side search
              }}
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
                className={`px-4 py-1 rounded-full text-sm ${
                  activeFilters.includes(filter)
                    ? "bg-mainBlacks"
                    : "bg-mainBlack"
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredBusinesses.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p>No businesses found matching your criteria.</p>
          </div>
        ) : (
          filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-mainBlack rounded-lg overflow-hidden"
            >
              <Link
                href={`dashboard/business?id=${business.publicId}&businessId=${business.businessId}`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {business.business?.businessVerificationStatus ? (
                      <div className="flex items-center bg-green-900 bg-opacity-40 text-green-400 px-2 py-0.5 rounded-full text-xs">
                        <MdVerified className="mr-1" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center bg-red-900 bg-opacity-40 text-red-400 px-2 py-0.5 rounded-full text-xs">
                        <RxCrossCircled className="mr-1" />
                        Unverified
                      </div>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4">
                    {business.business?.businessName || "Business"}
                  </h3>

                  <div className="relative w-full h-32 sm:h-40 mb-4">
                    <Image
                      src={getBusinessPhotoUrl(business.businessPhotos)}
                      alt={business.business?.businessName || "Business"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Profit Margin</p>
                      <p className="font-semibold">
                        {business.profitMarginPercentage || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Yearly Sales</p>
                      <p className="font-semibold text-sm sm:text-sm">
                        {formatCurrency(business.reportedYearlySales || 0)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Valuation:</p>
                    <p className="text-lg sm:text-lg font-bold">
                      {formatCurrency(business.tentativeSellingPrice || 0)}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && metadata.total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
            <select
              className="bg-mainBlack rounded px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={(e) => changeRowsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm">Per Page</span>
            <span className="text-sm ml-4">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, metadata.total)} of{" "}
              {metadata.total}
            </span>
          </div>

          <div className="flex gap-2">
            {/* Previous page button */}
            <button
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 1
                  ? "bg-mainBlack text-gray-500"
                  : "bg-mainBlack"
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
                  <button className="px-2 py-1 bg-mainBlack rounded-lg text-sm">
                    ...
                  </button>
                )}
              </>
            )}

            {/* Page buttons */}
            {paginationButtons.map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-lg text-sm ${
                  page === currentPage ? "bg-mainGreen" : "bg-mainBlack"
                }`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}

            {/* Last page button (if not in view) */}
            {paginationButtons[paginationButtons.length - 1] <
              metadata.totalPages && (
              <>
                {paginationButtons[paginationButtons.length - 1] <
                  metadata.totalPages - 1 && (
                  <button className="px-2 py-1 bg-mainBlack rounded-lg text-sm">
                    ...
                  </button>
                )}
                <button
                  className={`w-8 h-8 rounded-lg text-sm bg-mainBlack`}
                  onClick={() => changePage(metadata.totalPages)}
                >
                  {metadata.totalPages}
                </button>
              </>
            )}

            {/* Next page button */}
            <button
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === metadata.totalPages
                  ? "bg-mainBlack text-gray-500"
                  : "bg-mainBlack"
              }`}
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === metadata.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
