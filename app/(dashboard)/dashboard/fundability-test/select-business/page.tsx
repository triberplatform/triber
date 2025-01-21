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

  return (
    <div className="bg-mainBlack p-4 rounded-xl font-sansSerif">
      <p className="text-xl">Please select a business to take a test</p>
      {businessDetails.length > 0 ? (
        businessDetails.map((business) => (
          <Link href={`/dashboard/fundability-test/${business.publicId}`} key={business.publicId}>
            <div className="grid grid-cols-10 bg-black my-6 justify-between rounded-xl items-center px-8 py-4 cursor-pointer hover:bg-gray-900 hover:bg-opacity-20 transition">
              <div className="grid grid-cols-11 gap-2 col-span-8 items-end">
                <div className="col-span-9">
                  <div className="flex items-center gap-7 mb-4">
                    <div className="flex items-center gap-4">
                      {business.businessLogoUrl ? (
                        <Image
                          src={business.businessLogoUrl} 
                          alt={`${business.businessName} logo`}
                          className="w-10 h-10 rounded-full object-cover bg-gray-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                          <FaBusinessTime className="text-mainGreen text-lg" />
                        </div>
                      )}
                      <p className="text-lg">{business.businessName}</p>
                    </div>
                    <p className="text-xs text-mainGreen">
                      Registration Date: {formattedDate(business.createdAt)}
                    </p>
                  </div>
                  <div className="text-sm">{business.description}</div>
                  <div className="flex gap-5 text-xs mt-5">
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
        ))
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <p className="w-52 text-sm mb-5">
            Your business will appear here. Create a business to get started and run fundability test
          </p>
          <button className="bg-black text-white rounded py-3 px-4">
            <Link href="/dashboard/register-business">Add Business</Link>
          </button>
        </div>
      )}
    </div>
  );
}