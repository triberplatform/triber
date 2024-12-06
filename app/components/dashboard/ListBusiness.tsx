"use client";
import React from "react";
import { useUser } from "../layouts/UserContext";
import Link from "next/link";

export default function ListBusiness() {
  const { businessDetails } = useUser();
  return (
    <div className="bg-mainBlack p-4 rounded-xl font-serif">
      <p className="text-xl">Business Profiles Created</p>
      {businessDetails.length > 0 ? (
        businessDetails.map((business) => (
          <div key={business.id} className="flex items-center">
            <div></div>
            <div></div>
            {business.businessName}, {business.businessEmail}
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <p className="w-52 text-sm mb-5">
            Your business will appear here. Create a business to get started
          </p>
          <button className="bg-black text-white rounded py-3 px-4">
            <Link href="/dashboard/register-business">
            Add Business
            </Link>
         
          </button>
        </div>
      )}
    </div>
  );
}
