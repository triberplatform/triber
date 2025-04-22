"use client";
import React, { useState } from "react";
import { useUser } from "../layouts/UserContext";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { FaBusinessTime, FaLayerGroup } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import Image from "next/image";
import { BusinessDetails } from "@/app/type";

export default function ListBusiness() {
  const [showAll, setShowAll] = useState(false);
  
  const formattedDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const { businessDetails } = useUser();
  
  const displayedBusinesses = showAll 
    ? businessDetails 
    : businessDetails.slice(0, 2);

  const BusinessCard = ({ business }: { business: BusinessDetails }) => (
    <Link href={`/dashboard/${business.publicId}`} key={business.publicId}>
      <div className="flex flex-col lg:grid lg:grid-cols-10 relative bg-black my-4 lg:my-6 justify-between rounded-xl items-start lg:items-center p-4 lg:px-8 lg:py-4 cursor-pointer hover:bg-gray-900 hover:bg-opacity-20 transition">
        <div className="w-full lg:grid lg:grid-cols-9 gap-2 lg:col-span-8 items-end">
          <div className="lg:col-span-9">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-7 mb-4">
              <div className="flex items-center gap-4 min-w-0">
                {business.businessLogoUrl ? (
                  <Image
                    src={business.businessLogoUrl} 
                    alt={`${business.businessName} logo`}
                    width={12}
                    height={12}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover bg-gray-800 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <FaBusinessTime className="text-mainGreen text-lg lg:text-xl" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-base lg:text-xl line-clamp-2 overflow-hidden">{business.businessName}</p>
                  <div className="flex items-center">
                    {business.businessVerificationStatus ? (
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
                </div>
              </div>
              <p className="text-xs lg:text-sm text-mainGreen whitespace-nowrap">
                Registration Date: {formattedDate(business.createdAt)}
              </p>
            </div>
            <div className="text-sm lg:text-base ">{business.description}</div>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 text-xs lg:text-sm mt-4 lg:mt-5">
              <p className="flex items-center gap-2">
                <FaLayerGroup className="text-mainGreen flex-shrink-0" /> 
                <span className="truncate">Industry: {business.industry.toLowerCase()}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaLocationDot className="text-mainGreen flex-shrink-0" />
                <span className="truncate">Location: {business.location}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:col-span-2 justify-end">
          <div className="text-3xl shadow shadow-white rounded-full w-10 h-10 p-1 self-end">
            <GoArrowUpRight />
          </div>
        </div>
        {/* Mobile arrow - shown at the top right */}
        <div className="absolute top-4 right-4 hidden lg:hidden">
          <div className="text-2xl lg:text-3xl shadow shadow-white rounded-full w-8 h-8 lg:w-10 lg:h-10 p-1 flex items-center justify-center">
            <GoArrowUpRight />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-mainBlack p-3 lg:p-4 rounded-xl font-sansSerif">
      <div className="flex justify-between items-center mb-4">
        <p className="text-base lg:text-xl">Business Profiles Created</p>
        {businessDetails.length > 2 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="bg-black hover:bg-gray-900 text-white px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base rounded transition"
          >
            {showAll ? "Show Less" : "See All"}
          </button>
        )}
      </div>
      
      {businessDetails.length > 0 ? (
        <div>
          {displayedBusinesses.map((business) => (
            <BusinessCard key={business.publicId} business={business} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-8 lg:py-12">
          <p className="w-52 text-xs lg:text-sm mb-4 lg:mb-5">
            Your business will appear here. Create a business to get started
          </p>
          <button className="bg-mainGreen text-white w-full lg:max-w-full rounded py-2 lg:py-3 px-4 text-sm lg:text-base">
            <Link href="/dashboard/register-business">Add Business</Link>
          </button>
        </div>
      )}
    </div>
  );
}