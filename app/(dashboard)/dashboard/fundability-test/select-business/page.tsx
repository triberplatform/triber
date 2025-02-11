"use client";
import React from "react";
import { useUser } from "@/app/components/layouts/UserContext";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { FaBusinessTime, FaLayerGroup } from "react-icons/fa";
import Image from "next/image";

export default function ListBusiness() {
  const formattedDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const { businessDetails } = useUser();
  const SME = businessDetails.filter(business => business.businessStage === 'SME')

  return (
    <div className="bg-mainBlack p-3 sm:p-4 md:p-6 rounded-xl font-sansSerif">
      <p className="text-lg sm:text-xl md:text-2xl mb-4">Please select an SME to take a test</p>
      
      {SME.length > 0 ? (
        SME.map((business) => (
          <Link href={`/dashboard/fundability-test/${business.publicId}`} key={business.publicId}>
            <div className="bg-black my-3 sm:my-4 md:my-6 rounded-xl p-4 sm:p-6 md:p-8 cursor-pointer hover:bg-gray-900 hover:bg-opacity-20 transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Main Content Section */}
                <div className="w-full md:w-4/5">
                  {/* Business Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-7 mb-3 md:mb-4">
                    {/* Logo and Business Name */}
                    <div className="flex items-center gap-3 md:gap-4">
                      {business.businessLogoUrl ? (
                        <Image
                          src={business.businessLogoUrl} 
                          alt={`${business.businessName} logo`}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover bg-gray-800"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center">
                          <FaBusinessTime className="text-mainGreen text-base sm:text-lg" />
                        </div>
                      )}
                      <p className="text-base sm:text-lg">{business.businessName}</p>
                    </div>
                    
                    {/* Registration Date */}
                    <p className="text-xs text-mainGreen">
                      Registration Date: {formattedDate(business.createdAt)}
                    </p>
                  </div>

                  {/* Business Description */}
                  <div className="text-xs sm:text-sm md:text-base">{business.description}</div>

                  {/* Business Details */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 text-xs mt-3 sm:mt-4 md:mt-5">
                    <p className="flex items-center gap-2">
                      <FaLayerGroup className="text-mainGreen" /> 
                      Industry: {business.industry.toLowerCase()}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaLocationDot className="text-mainGreen" />
                      Location: {business.location}
                    </p>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="hidden md:flex justify-end">
                  <div className="text-2xl md:text-3xl shadow shadow-white rounded-full w-8 h-8 md:w-10 md:h-10 p-1 flex items-center justify-center">
                    <GoArrowUpRight />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-8 sm:py-10 md:py-12">
          <p className="w-full max-w-xs text-sm mb-4 sm:mb-5">
            Your SMEs will appear here. Create a business to get started and run fundability test
          </p>
          <Link 
            href="/dashboard/register-business"
            className="bg-black text-white rounded py-2 px-3 sm:py-3 sm:px-4 hover:bg-gray-900 transition-colors"
          >
            Add Business
          </Link>
        </div>
      )}
    </div>
  );
}