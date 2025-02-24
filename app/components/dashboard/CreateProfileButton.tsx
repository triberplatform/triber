import React, { useState, useContext } from 'react';
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { VscTriangleDown } from "react-icons/vsc";

import Modal from '@/app/components/dashboard/Modal';
import { useUser } from '../layouts/UserContext';

interface CreateProfileButtonProps {
  onMobileItemClick?: () => void;
}

const CreateProfileButton = ({ onMobileItemClick }: CreateProfileButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileClick = () => {
    toggleDropdown();
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  const handleInvestorProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user?.user?.investorProfile) {
      setShowModal(true);
      toggleDropdown();
    } else {
      // Navigate to investor registration
      window.location.href = '/dashboard/investor-register';
    }
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="relative hidden text-sm lg:inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="bg-mainGreen text-white px-4 py-2 text-sm rounded-md shadow-md items-center flex gap-1 hover:bg-green-600 focus:outline-none"
        >
          <CgProfile /> Add a Profile <VscTriangleDown />
        </button>
        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-mainBlack border-mainGreen border-t-2 flex items-center flex-col text-sm rounded-md shadow-lg z-10">
            <Link
              href="/dashboard/register-business"
              className="hover:bg-mainGreen px-3 py-3 w-full mt-3"
              onClick={toggleDropdown}
            >
              Add Business Profile
            </Link>
            
            <button
              onClick={handleInvestorProfileClick}
              className="hover:bg-mainGreen px-3 py-3 w-full mb-3 text-left"
            >
              Add Investor Profile
            </button>
          </div>
        )}
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden w-full">
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/dashboard/register-business"
            className="flex items-center gap-2 px-4 py-3 hover:bg-mainGreen rounded-lg transition-colors w-full"
            onClick={handleMobileClick}
          >
            <CgProfile />
            <span>Add Business Profile</span>
          </Link>
          
          <button
            onClick={handleInvestorProfileClick}
            className="flex items-center gap-2 px-4 py-3 hover:bg-mainGreen rounded-lg transition-colors w-full text-left"
          >
            <CgProfile />
            <span>Add Investor Profile</span>
          </button>
        </div>
      </div>

      {/* Modal for existing investor profile */}
      {showModal && (
        <Modal>
          <div className="flex flex-col p-4 gap-4 bg-mainBlack">
            <p className="text-white">
              You already have an investor profile. You cannot create multiple investor profiles.
            </p>
            <button
              className="px-3 py-1 w-44 mx-auto  text-sm rounded bg-mainGreen text-white"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateProfileButton;