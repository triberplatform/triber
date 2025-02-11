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
import CircularProgress from "@/app/components/dashboard/Circular";

export default function BusinessDetail() {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const { businessDetails } = useUser();

  const business = businessDetails.find((b) => b.publicId === id);

  if (!business) {
    return <p className="text-center text-white">Business not found</p>;
  }

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="lg:bg-mainBlack gap-5 pb-8 lg:pb-12 py-4 lg:py-8 px-4 lg:px-5">
            {/* Header Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-0">
              {/* Logo and Business Name Section - Combined for mobile */}
              <div className="flex items-center lg:col-span-7 gap-4">
                <div className="flex justify-center lg:justify-start">
                  <Image
                    src={business.businessLogoUrl}
                    width={100}
                    height={100}
                    alt="business logo"
                    className="rounded-full object-cover w-[50px] h-[50px] lg:w-[100px] lg:h-[100px]"
                  />
                </div>
                <div className="flex flex-col lg:ml-4">
                  <p className="text-xl lg:text-2xl mb-2 lg:mb-4">{business.businessName}</p>
                 
                </div>
              </div>
              <div> <p className="text-xs">{business.description}</p></div>

              {/* Social Icons */}
              <div className="lg:col-span-2 flex  lg:justify-start gap-4 lg:gap-2 text-xl lg:self-end order-last lg:order-none">
                <FaInstagram className="cursor-pointer hover:text-mainGreen" />
                <FaLinkedin className="cursor-pointer hover:text-mainGreen" />
                <FaXTwitter className="cursor-pointer hover:text-mainGreen" />
                <FaFacebook className="cursor-pointer hover:text-mainGreen" />
              </div>

              <div className="lg:col-span-1"></div>

              {/* Edit Button */}
              <div className="lg:col-span-2 flex  lg:justify-start">
                <Link
                  href={`/dashboard/register-business/${business.publicId}`}
                  className="bg-black shadow shadow-white px-3 py-1.5 rounded text-sm hover:bg-gray-900 transition"
                >
                  Edit Details
                </Link>
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 py-6 lg:py-10 text-xs gap-6 lg:gap-0">
              {/* Contact Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IoCallOutline className="text-mainGreen text-lg" />
                  <span className="break-all">Contact: {business.businessPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-mainGreen text-lg" />
                  <span className="break-all">Email: {business.businessEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />
                  <span>Employees: {business.numOfEmployees}</span>
                </div>
              </div>

              {/* Business Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-mainGreen text-lg" />
                  <span>Established: {business.yearEstablished}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePermIdentity className="text-mainGreen text-lg" />
                  <span>Legal Entity: {business.businessLegalEntity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LiaIndustrySolid className="text-mainGreen text-lg" />
                  <span>Industry: {business.industry}</span>
                </div>
              </div>

              {/* Location Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IoLocation className="text-mainGreen text-lg" />
                  <span>Location: {business.location} {business.businessStage}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex justify-center items-center h-[80vh] lg:h-[80vh] lg:bg-mainBlack p-4">
            {business?.fundabilityTestDetails?.score !== undefined ? (
              <div className="text-center">
                <p className="mb-5 font-semibold text-xl lg:text-2xl">Fundability Score</p>
                <CircularProgress value={business.fundabilityTestDetails.score} />
                <p className="mt-4 text-xs lg:text-sm">Your current fundability score</p>
              </div>
            ) : (
              <div className="text-xs lg:text-sm text-center px-4">
                <p>
                  Your fundability test will appear here. Check how ready your
                  business is for funding
                </p>
                <Link href={`/dashboard/fundability-test/${id}`}>
                  <button className="bg-black shadow mt-3 shadow-white text-center px-3 py-1.5 rounded text-sm hover:bg-gray-900 transition">
                    Fundability Check
                  </button>
                </Link>
              </div>
            )}
          </div>
        );

      case 2:
        return <div className="p-4">Work in Progress...</div>;

      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="font-sansSerif">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 lg:gap-7 text-sm lg:text-base px-2 lg:px-0">
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 0 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(0)}
        >
          Business Overview
        </p>
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 1 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(1)}
        >
          Fundability Check
        </p>
        {/* <p
          className={`cursor-pointer pb-1 ${
            currentStep === 2 ? "border-b-2 border-mainGreen" : ""
          }`}
          onClick={() => setCurrentStep(2)}
        >
          Investment Proposals
        </p> */}
      </div>

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
}