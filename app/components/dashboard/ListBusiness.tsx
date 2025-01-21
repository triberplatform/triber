"use client";
import React, { useState } from "react";
import { useUser } from "../layouts/UserContext";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { FaBusinessTime, FaLayerGroup } from "react-icons/fa";
import Image from "next/image";

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

  const BusinessCard = ({ business }: { business: any }) => (
    <Link href={`/dashboard/${business.publicId}`} key={business.publicId}>
      <div className="grid grid-cols-10 bg-black my-6 justify-between rounded-xl items-center px-8 py-4 cursor-pointer hover:bg-gray-900 hover:bg-opacity-20  transition">
        <div className="grid grid-cols-9 gap-2 col-span-8 items-end">
          <div className="col-span-9">
            <div className="flex items-center gap-7 mb-4">
              <div className="flex items-center gap-4">
                {business.businessLogoUrl ? (
                  <Image
                    src={business.businessLogoUrl} 
                    alt={`${business.businessName} logo`}
                    width={12}
                    height={12}
                    className="w-12 h-12 rounded-full object-cover bg-gray-800"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                    <FaBusinessTime className="text-mainGreen text-xl" />
                  </div>
                )}
                <p className="text-xl">{business.businessName}</p>
              </div>
              <p className="text-sm text-mainGreen">
                Registration Date: {formattedDate(business.createdAt)}
              </p>
            </div>
            <div>{business.description}</div>
            <div className="flex gap-5 text-sm mt-5">
              <p className="flex items-center gap-2">
                <FaLayerGroup className="text-mainGreen" /> Industry:{" "}
                {business.industry.toLowerCase()}
              </p>
              <p className="flex items-center gap-2">
                <FaLocationDot className="text-mainGreen" />
                Location: {business.location}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
          <div className="text-3xl shadow shadow-white rounded-full w-10 h-10 p-1 self-end">
            <GoArrowUpRight />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-mainBlack p-4 rounded-xl font-sansSerif">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl">Business Profiles Created</p>
        {businessDetails.length > 2 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded transition"
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
        <div className="flex flex-col justify-center items-center text-center py-12">
          <p className="w-52 text-sm mb-5">
            Your business will appear here. Create a business to get started
          </p>
          <button className="bg-black text-white rounded py-3 px-4">
            <Link href="/dashboard/register-business">Add Business</Link>
          </button>
        </div>
      )}
    </div>
  );
}