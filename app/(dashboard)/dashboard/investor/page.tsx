"use client";
import { useUser } from "@/app/components/layouts/UserContext";
import React from "react";
import Image from "next/image";
import { BsArrowUpRight } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

export default function InvestorProfile() {
  const { user } = useUser();
  
  if (!user) {
    return <p>No user details available</p>;
  }

  return (
    <div className="">
   

      {/* Title */}
      <h1 className="lg:text-2xl text-lg mb-4">
        {user.firstname} {user.lastname}
      </h1>
      
      {/* Main Grid */}
      <div className="lg:grid lg:grid-cols-10 gap-4 mb-4">
        {/* Profile Info */}
        <div className="col-span-6 bg-mainBlack p-4 mb-3 lg:mb-0 rounded-xl">
          <div className="flex lg:gap-6">
            <div className="w-24 shrink-0">
            {user.investorProfile.companyLogoUrl ? ( <Image
                src={user.investorProfile.companyLogoUrl}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full"
              />): (<CgProfile/>)} 
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Date Joined:</span>
                <span>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Company Name:</span>
                <span>{user.investorProfile?.companyName || 'Fintech'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Location:</span>
                <span>{user.investorProfile?.location || 'Nigeria'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Email Address:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="col-span-2 mb-3 lg:mb-0 flex flex-col justify-between bg-mainBlack p-4 rounded-xl">
          <p className=" mb-2 text-sm">Total Businesses Engaged</p>
          <p className="text-xl">0</p>
        </div>

        <div className="col-span-2 flex lg:flex-col justify-between gap-2">
          <div className="bg-mainBlack w-full p-4 rounded-xl">
            <p className="mb-1 text-sm">Proposals Submitted</p>
            <p className="text-xl">0</p>
          </div>
          
          <div className="bg-mainBlack w-full p-4 rounded-xl">
            <p className=" text-sm mb-1">Deals Closed</p>
            <p className="text-xl">0</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid lg:grid-cols-9 gap-4 font-sansSerif mb-4">
        <div className="col-span-3 bg-mainGreens p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsArrowUpRight />
            <p>Buy a Business<br />Invest Equity in a Business</p>
          </div>
          <p className="w-[70%] text-sm">
            Connect, and close deals with top investors today!
          </p>
        </div>

        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsArrowUpRight />
            <p>Fund a Business<br />Debt Transaction</p>
          </div>
          <p className="w-[70%] text-sm">
            Find opportunities, connect with founders, and grow your portfolio.
          </p>
        </div>

        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsArrowUpRight />
            <p>Deal Room</p>
          </div>
          <p className="w-[70%] text-sm">
            Connect, negotiate, and finalize investments all in one place.
          </p>
        </div>
      </div>

     
    </div>
  );
}