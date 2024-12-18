"use client";
import React from "react";
import { useUser } from "../layouts/UserContext";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";
import { FaBusinessTime, FaLayerGroup } from "react-icons/fa";

export default function ListBusiness() {
  const formattedDate = (date: any) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const { businessDetails } = useUser();
  return (
    <div className="bg-mainBlack p-4 rounded-xl font-sansSerif">
      <p className="text-xl">Business Profiles Created</p>
      {businessDetails.length > 0 ? (
        businessDetails.map((business) => (
          <div
            key={business.id}
            className="grid grid-cols-10 bg-black my-6 justify-between rounded-xl items-center px-8 py-4"
          >
            <div className="grid grid-cols-9 gap-2 col-span-8 items-end">
              <div className="col-span-5">
                <div className="flex items-end gap-7 mb-4">
                  <p className="text-xl flex items-center gap-2">
                    <FaBusinessTime className="text-mainGreen" />
                    {business.businessName}
                  </p>
                  <p className="text-sm text-mainGreen">
                    Registration Date: {formattedDate(business.createdAt)}
                  </p>
                </div>
                <div>{business.description}</div>
                <div className="flex gap-5 text-sm mt-5">
                  <p className="flex items-center gap-2">
                    <FaLayerGroup className="text-mainGreen" /> Intustry:{" "}
                    {business.industry.toLowerCase()}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaLocationDot className="text-mainGreen" />
                    Location: {business.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-5 col-span-4 text-sm"></div>
            </div>
            <div className="col-span-2 flex justify-end">
              <div className="text-3xl shadow shadow-white  rounded-full w-10 h-10 p-1 self-end">
                <GoArrowUpRight />
              </div>
            </div>
          </div>
        ))
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
