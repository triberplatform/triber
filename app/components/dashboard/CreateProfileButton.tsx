"use client";
import Link from "next/link";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { VscTriangleDown } from "react-icons/vsc";

interface CreateProfileButtonProps {
  onMobileItemClick?: () => void;
}

const CreateProfileButton = ({ onMobileItemClick }: CreateProfileButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMobileClick = () => {
    toggleDropdown();
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="relative hidden lg:inline-block text-left">
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
            
            <Link
              href="/dashboard/investor-register"
              className="hover:bg-mainGreen px-3 py-3 w-full mb-3"
              onClick={toggleDropdown}
            >
              Add Investor Profile
            </Link>
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
          
          <Link
            href="/dashboard/investor-register"
            className="flex items-center gap-2 px-4 py-3 hover:bg-mainGreen rounded-lg transition-colors w-full"
            onClick={handleMobileClick}
          >
            <CgProfile />
            <span>Add Investor Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CreateProfileButton;