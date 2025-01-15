"use client";
import React, { useState } from "react";
import { useUser } from "@/app/components/layouts/UserContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaCalendarAlt, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { IoCallOutline, IoLocation } from "react-icons/io5";
import { MdEmail, MdOutlinePermIdentity } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import Link from "next/link";

export default function BusinessDetail() {
  const [currentStep, setCurrentStep] = useState(0);

  const { id } = useParams(); // Extract the dynamic ID from the route
  const { businessDetails } = useUser();

  const business = businessDetails.find((b) => b.publicId === id);

  if (!business) {
    return <p className="text-center text-white">Business not found</p>;
  }
  console.log(business);

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-mainBlack gap-5 pb-12 py-8 px-5">
            <div className="grid grid-cols-12">
              <div className="col-span-2">
                <Image
                  src={business.businessLogo}
                  width={130}
                  height={100}
                  alt="test"
                  className="rounded-full object-cover w-[100px] h-[100px]"
                />
              </div>
              <div className="col-span-5 flex flex-col">
                <p className="text-2xl mb-4">{business.businessName}</p>
                <p className="text-xs">{business.description}</p>
              </div>
              <div className="col-span-2 flex gap-2 text-xl self-end">
                <FaInstagram /> <FaLinkedin /> <FaXTwitter /> <FaFacebook />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-2 ">
                <Link  href={`/dashboard/register-business/${business.publicId}`} className="bg-black shadow shadow-white px-3 py-1 rounded text-sm">
                  Edit Details
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-12 py-10 text-xs">
              <div className="col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <IoCallOutline className="text-mainGreen text-lg" /> Contact
                  Number: {business.businessPhone}
                </div>
                <div className="flex items-center gap-1">
                  <MdEmail className="text-mainGreen text-lg" /> Address:{" "}
                  {business.businessEmail}
                </div>
                <div className="flex items-center gap-1">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />{" "}
                  Number of Employees: {business.numOfEmployees}
                </div>
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-mainGreen text-lg" />{" "}
                  Established: {business.yearEstablished}
                </div>
                <div className="flex items-center gap-1">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />{" "}
                  Legal Entity: {business.businessLegalEntity}
                </div>
                <div className="flex items-center gap-1">
                  <LiaIndustrySolid className="text-mainGreen text-lg" />{" "}
                  Industry: {business.industry}
                </div>
              </div>
              <div className="col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  <IoLocation className="text-mainGreen text-lg" /> Location:{" "}
                  {business.location}
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex justify-center items-center h-[80vh] bg-mainBlack">
            <div className="text-sm text-center">
              <p>
                {" "}
                Your fundability test will appear here. Check how ready your
                business is for funding
              </p>

              <Link href={`/dashboard/fundability-test/${id}`}>
                {" "}
                <button className="bg-black shadow mt-3 shadow-white text-center px-3 py-1 rounded text-sm">
                  Fundability Check
                </button>
              </Link>
            </div>
          </div>
        );
      case 2:
        return <div>Work in Progress...</div>;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="font-sansSerif">
      <div className="flex gap-7">
        <p
          className={`cursor-pointer ${
            currentStep === 0 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(0)}
        >
          Business Overview
        </p>
        <p
          className={`cursor-pointer ${
            currentStep === 1 ? "border-b-2 font-bold border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(1)}
        >
          Fundability Check
        </p>
        <p
          className={`cursor-pointer ${
            currentStep === 2 ? "border-b-2 font-bold border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(2)}
        >
          Investment Proposals
        </p>
      </div>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}
