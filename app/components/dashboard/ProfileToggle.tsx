import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../layouts/UserContext';
import { BsBuildingsFill } from "react-icons/bs";
import { MdBusinessCenter } from "react-icons/md";
import Modal from '../dashboard/Modal';
import Link from 'next/link';

const ProfileToggle = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isBusinessProfile, setIsBusinessProfile] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const hasInvestorProfile = user?.investorProfile && Object.keys(user.investorProfile).length > 0;

  const toggleProfile = () => {
    if (!isBusinessProfile && !hasInvestorProfile) {
      setShowModal(true);
      return;
    }

    const newValue = !isBusinessProfile;
    setIsBusinessProfile(newValue);
    router.push(newValue ? '/dashboard' : '/dashboard/investor');
  };

  return (
    <>
      <div className="flex items-center gap-4 bg-mainBlack p-2 rounded-lg">
        <button
          onClick={toggleProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
        >
          <div className="relative flex items-center">
            <div className={`flex gap-2 items-center ${isBusinessProfile ? 'text-mainGreen' : 'text-gray-400'}`}>
              <BsBuildingsFill className='text-mainGreen'/>
              <span className="text-sm">Business Profile</span>
            </div>
            <div className={`flex gap-2 items-center ml-4 ${!isBusinessProfile ? 'text-mainGreen' : 'text-gray-400'}`}>
              <MdBusinessCenter  className='text-mainGreen'/>
              <span className="text-sm">Investor Profile</span>
            </div>
            <div 
              className={`absolute h-full w-1/2 bg-mainBlack border-b-2 border-mainGreen transition-transform duration-300 ${
                isBusinessProfile ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
          </div>
        </button>
      </div>

      {showModal && (
        <Modal>
          <div className="flex flex-col p-6 gap-6 bg-mainBlack rounded-lg max-w-md">
            <h3 className="text-xl font-medium">Create Investor Profile</h3>
            <p className="text-gray-400">
              You need to create an investor profile before accessing the investor dashboard.
              Would you like to create one now?
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <Link 
                href="/dashboard/create-investor-profile" 
                className="px-4 py-2 rounded-lg bg-mainGreen text-white"
              >
                Create Profile
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileToggle;