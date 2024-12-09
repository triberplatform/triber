"use client"
import ListBusiness from "@/app/components/dashboard/ListBusiness";
import { useUser } from "@/app/components/layouts/UserContext";
import React from "react";
import { BsBuildingsFill } from "react-icons/bs";
import { GiProgression } from "react-icons/gi";
import { IoPricetagOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

export default function page() {

  const { user } = useUser();

  if (!user) {
    return <p>No user details available</p>;
  }

  return (
    <div className="">
      <div className="font-serif text-2xl mb-4">Hi, {user.firstname} welcome to Triber</div>
      <div className="grid grid-cols-10 gap-4 font-serif mb-4">
        <div className="col-span-6 bg-mainBlack p-4 rounded-xl">
          <p className="text-lg mb-4">
            Ready to Take your Business to the Next Level?
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm flex gap-2">
              <TiTick /> Complete the Fundability Test to understand where your
              business stands.
            </p>
            <p className="text-sm flex gap-2">
              <TiTick /> Get your Valuation Score in just a few clicks.
            </p>
            <p className="text-sm flex gap-2">
              <TiTick /> Go to the Deal Room to explore active funding
              opportunities and connect with investors.
            </p>
          </div>
        </div>
        <div className="col-span-2 bg-mainBlack flex flex-col justify-between p-4 rounded-xl">
          <p>Profile Views</p>
          <p>0</p>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <div className=" bg-mainBlack flex flex-col justify-between p-4 rounded-xl">
            <p>Total Businesses</p>
            <p>0</p>
          </div>
          <div className=" bg-mainBlack flex flex-col justify-between p-4 rounded-xl">
            <p>Listed Connections</p>
            <p>0</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-9 gap-4 font-serif mb-4">
        <div className="col-span-3 bg-mainGreens p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
          <IoPricetagOutline />
          <p>Sell your Business Find Investors</p>

          </div>
          <p className="w-[70%] text-sm">List, connect, and close deals with top investors today!</p>
         
        </div>
        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
          <GiProgression />
          <p>Buy a BusinessInvest in a Business</p>

          </div>
          <p className="w-[70%] text-sm">Find opportunities, connect with founders, and grow your portfolio.</p>
         
        </div>
        <div className="col-span-3 bg-mainBlack p-4 flex flex-col gap-5 rounded-xl">
          <div className="flex gap-2 items-center">
          <BsBuildingsFill />
          <p>Deal Room</p>

          </div>
          <p className="w-[70%]">Connect, negotiate, and finalize investments all in one place.</p>
         
        </div>
      </div>
      <div>
          <ListBusiness/>
      </div>
    </div>
  );
}
