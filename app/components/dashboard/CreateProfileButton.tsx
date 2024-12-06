import Link from "next/link";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { VscTriangleDown } from "react-icons/vsc";

const CreateProfileButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };



  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-mainGreen text-white px-4 py-2 text-sm rounded-md shadow-md  items-center flex gap-1 hover:bg-green-600 focus:outline-none"
      >
      <CgProfile/>  Add a Profile <VscTriangleDown/>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-mainBlack border-mainGreen border-t-2 flex items-center flex-col text-sm rounded-md shadow-lg z-10">
         <Link href={'/dashboard/register-business'} className="hover:bg-mainGreen px-3 py-3 w-full mt-3" onClick={toggleDropdown}>
             Add Business Profile
         </Link>
            
         
         <Link href={''} className="hover:bg-mainGreen px-3 py-3 w-full mb-3" onClick={toggleDropdown}>Add  Investor Profile</Link>
          

        </div>
      )}
    </div>
  );
};

export default CreateProfileButton;
