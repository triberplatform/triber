"use client";
import React, { useEffect, useState } from "react";
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
import { getBusinessProposals } from "@/app/services/dashboard";
import { Proposal } from "@/app/type";
import { BusinessDetails } from "@/app/type"; 

export default function BusinessDetail() {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const { businessDetails } = useUser();
  const [proposal, setProposal] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [business, setBusiness] = useState<BusinessDetails | null>(null);

  // Find the business first
  useEffect(() => {
    if (businessDetails && businessDetails.length > 0) {
      const foundBusiness = businessDetails.find((b) => b.publicId === id);
      setBusiness(foundBusiness || null);
    }
  }, [businessDetails, id]);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;
      
      setLoading(true);
      try {
        const response = await getBusinessProposals(token, Array.isArray(id) ? id[0] : id);
        if (response.success) {
          setProposal(response.data);
          console.log(response.data);
        } else {
          console.error('Failed to fetch proposals:', response.message);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProposals();
  }, [id]);

  // If no business is found, show loading or not found message
  if (!business) {
    return <p className="text-center text-white">Business not found</p>;
  }

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="lg:bg-mainBlack gap-5 pb-8 lg:pb-12 py-4 lg:py-8 px-4 lg:px-5">
            {/* Header Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-4">
              {/* Logo and Business Name */}
              <div className="flex items-start lg:col-span-7 gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={business.businessLogoUrl || "/assets/logos.svg"}
                    width={80}
                    height={100}
                    alt="business logo"
                    className="rounded-full object-cover w-[50px] h-[50px] lg:w-[100px] lg:h-[100px]"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-xl lg:text-2xl mb-2">
                    {business.businessName}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-300 line-clamp-3 lg:line-clamp-none">
                    {business.description}
                  </p>
                </div>
              </div>

              {/* Social Icons */}
              <div className="lg:col-span-2 flex lg:justify-start gap-4 lg:gap-2 text-xl lg:self-start">
                <FaInstagram className="cursor-pointer hover:text-mainGreen" />
                <FaLinkedin className="cursor-pointer hover:text-mainGreen" />
                <FaXTwitter className="cursor-pointer hover:text-mainGreen" />
                <FaFacebook className="cursor-pointer hover:text-mainGreen" />
              </div>

              <div className="lg:col-span-1"></div>

              {/* Edit Button */}
              <div className="lg:col-span-2 flex lg:justify-start">
                <button>
                  <Link
                    href={`/dashboard/register-business/${business.publicId}`}
                    className="bg-black shadow shadow-white px-3 py-1.5 rounded inline text-sm hover:bg-gray-900 transition"
                  >
                    Edit Details
                  </Link>
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 py-6 lg:py-10 text-xs gap-6 lg:gap-0">
              {/* Contact Details */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IoCallOutline className="text-mainGreen text-lg" />
                  <span className="break-all">
                    Contact: {business.businessPhone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MdEmail className="text-mainGreen text-lg" />
                  <span className="break-all">
                    Email: {business.businessEmail}
                  </span>
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
                  <span>
                    Location: {business.location} {business.businessStage}
                  </span>
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
                <p className="mb-5 font-semibold text-xl lg:text-2xl">
                  Fundability Score
                </p>
                <CircularProgress
                  value={business.fundabilityTestDetails.score}
                />
                <p className="mt-4 text-xs lg:text-sm">
                  Your current fundability score
                </p>
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
          return (
            <div className="flex flex-col h-[80vh] lg:h-[80vh] lg:bg-mainBlack p-4">
              <div className="w-full overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Loading proposals...</p>
                  </div>
                ) : business?.dealRoomDetails ? (
                  proposal?.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-mainGreen/20">
                        <tr>
                          <th className="px-4 py-3 text-left">Sl. No</th>
                          <th className="px-4 py-3 text-left">Proposal Date</th>
                          <th className="px-4 py-3 text-left">Investor Name</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Proposal</th>
                      
                        </tr>
                      </thead>
                      <tbody>
                        {proposal.map((item, index) => (
                          <tr key={item.publicId} className="border-b border-gray-800">
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3 text-mainGreen">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {item.investor?.companyLogoUrl && (
                                  <Image
                                    src={item.investor.companyLogoUrl}
                                    width={30}
                                    height={30}
                                    alt="company logo"
                                    className="rounded-full"
                                  />
                                )}
                                <span>{item.investor?.companyName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  item.status === 'PENDING' 
                                    ? 'bg-yellow-500/20 text-yellow-500'
                                    : item.status === 'ACCEPTED'
                                    ? 'bg-mainGreen/20 text-mainGreen'
                                    : 'bg-red-500/20 text-red-500'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-xs">
                              <p className="truncate">{item.proposal}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-[70vh] px-4 py-8 text-center">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No Investment Proposals Yet</h3>
                        <p className="text-gray-400 text-sm max-w-md mb-6">
                          When investors show interest in your business, their proposals will appear here. Keep your business profile updated to attract potential investors.
                        </p>
                        <Link 
                          href={`/dashboard/deal-room/investor-dashboard?id=${id}`}
                          className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                        >
                          See Investors
                        </Link>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col justify-center items-center h-[70vh] px-4 py-8 text-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">No Deal Room Profile</h3>
                      <p className="text-gray-400 text-sm max-w-md mb-6">
                        Create a Deal Room profile to showcase your business to potential investors and receive investment proposals.
                      </p>
                      <Link 
                        href={`/dashboard/deal-room/valuation?id=${id}`}
                        className="bg-mainGreen text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-mainGreen/90 transition-colors"
                      >
                        Create Deal Room Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
      
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
        <p
          className={`cursor-pointer pb-1 ${
            currentStep === 2 ? "border-b-2 border-mainGreen" : ""
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