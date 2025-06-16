"use client"
import ListBusiness from "@/app/components/dashboard/ListBusiness";
import { useUser } from "@/app/components/layouts/UserContext";
import SubscriptionStatus from "@/app/components/dashboard/SubscriptionStatus";
import React from "react";
import { BsBuildingsFill } from "react-icons/bs";
import { GiProgression } from "react-icons/gi";
import { IoPricetagOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

export default function Page() {
  const { user, businessDetails } = useUser();

  const handleUpgradeSuccess = (packageId: number) => {
    console.log("User selected package:", packageId);
    // Handle successful upgrade if needed
    // The component will automatically redirect to payment
  };

  if (!user) {
    return <p>No user details available</p>;
  }
  
  return (
    <div className="">
      {/* Clean header with subscription status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div className="lg:text-2xl text-lg font-medium">
          Hi {user.firstname}, Welcome to Triber
        </div>
        <SubscriptionStatus 
          variant="card" 
          className="lg:ml-auto" 
          onUpgradeSuccess={handleUpgradeSuccess}
          businessName="Premium Dashboard Features"
        />
      </div>

      <div className="lg:grid lg:grid-cols-10 gap-4 mb-4">
        <div className="col-span-6 bg-mainBlack p-4 mb-3 lg:mb-0 rounded-xl">
          <p className="text-lg mb-4">
            Ready to Take your Business to the Next Level?
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm flex gap-2 items-center">
              <TiTick className="text-mainGreen flex-shrink-0" /> 
              Complete the Fundability Test to understand where your business stands.
            </p>
            <p className="text-sm flex gap-2 items-center">
              <TiTick className="text-mainGreen flex-shrink-0" /> 
              Get your Valuation Score in just a few clicks.
            </p>
            <p className="text-sm flex gap-2 items-center">
              <TiTick className="text-mainGreen flex-shrink-0" /> 
              Go to the Deal Room to explore active funding opportunities and connect with investors.
            </p>
          </div>
        </div>
        
        <div className="col-span-2 mb-3 bg-mainBlack flex flex-col justify-between p-4 rounded-xl">
          <p className="text-sm text-gray-400">Profile Views</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="col-span-2 flex lg:flex-col justify-between gap-2">
          <div className="bg-mainBlack flex w-full flex-col justify-between p-4 rounded-xl">
            <p className="text-sm text-gray-400">Total Businesses</p>
            <p className="text-2xl font-bold">{businessDetails?.length || 0}</p>
          </div>
          <div className="bg-mainBlack w-full flex flex-col justify-between p-4 rounded-xl">
            <p className="text-sm text-gray-400">Listed Connections</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-9 gap-4 font-sansSerif mb-4">
        <div className="col-span-3 bg-mainGreens p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <IoPricetagOutline className="text-xl" />
            <p className="font-medium">Sell your Business Find Investors</p>
          </div>
          <p className="text-sm opacity-90">
            List, connect, and close deals with top investors today!
          </p>
        </div>
        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <GiProgression className="text-xl" />
            <p className="font-medium">Buy a BusinessInvest in a Business</p>
          </div>
          <p className="text-sm text-gray-300">
            Find opportunities, connect with founders, and grow your portfolio.
          </p>
        </div>
        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
            <BsBuildingsFill className="text-xl" />
            <p className="font-medium">Deal Room</p>
          </div>
          <p className="text-sm text-gray-300">
            Connect, negotiate, and finalize investments all in one place.
          </p>
        </div>
      </div>
      
      <div>
        <ListBusiness />
      </div>
    </div>
  );
}