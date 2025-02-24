'use client'

// React and Next.js imports
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Context and hooks
import { useUser } from '../layouts/UserContext'

// Components
import Modal from '../dashboard/Modal'

// Icons
import { BsBuildingsFill } from "react-icons/bs"
import { MdBusinessCenter } from "react-icons/md"

const ProfileToggle = () => {
  // Hooks and state
  const { user } = useUser()
  const router = useRouter()
  const [isBusinessProfile, setIsBusinessProfile] = useState(() => 
    localStorage.getItem('currentProfile') !== 'investor'
  )
  const [showModal, setShowModal] = useState(false)

  // Profile checks
  const hasInvestorProfile = user?.investorProfile && 
    Object.keys(user.investorProfile).length > 0

  // Profile toggle handler
  const toggleProfile = () => {
    if (!isBusinessProfile && !hasInvestorProfile) {
      setShowModal(true)
      return
    }

    const newValue = !isBusinessProfile
    setIsBusinessProfile(newValue)
    
    localStorage.setItem('currentProfile', newValue ? 'business' : 'investor')
    window.dispatchEvent(new Event('storage'))
    router.push(newValue ? '/dashboard' : '/dashboard/investor')
  }

  // localStorage sync effect
  useEffect(() => {
    const handleStorageChange = () => {
      const currentProfile = localStorage.getItem('currentProfile')
      setIsBusinessProfile(currentProfile !== 'investor')
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Mobile Profile Button Component
  const MobileProfileButton = ({ type, icon: Icon, isActive }: { type: string, icon: React.ComponentType<{ className?: string }>, isActive: boolean }) => (
    <button
      onClick={toggleProfile}
      className={`flex items-center justify-center w-full gap-2 p-3 rounded-lg transition-all duration-300
        ${isActive ? 'bg-black/40 text-mainGreen border-b-2 border-mainGreen' : 'text-gray-400'}`}
    >
      <Icon className={`text-lg ${isActive ? 'text-mainGreen' : 'text-gray-500'}`} />
      <span className="text-sm">{type}</span>
    </button>
  )

  return (
    <>
      {/* Desktop Toggle */}
      <div className="hidden md:flex items-center bg-mainBlack/90 p-1.5 rounded-xl shadow-lg">
        <button
          onClick={toggleProfile}
          className="relative flex items-center gap-8 px-3 py-2 rounded-lg transition-all duration-300"
        >
          {/* Business Profile Option */}
          <div className={`flex items-center gap-2 transition-colors duration-300 z-10
            ${isBusinessProfile ? 'text-mainGreen font-medium' : 'text-gray-400'}`}
          >
            <BsBuildingsFill className={`text-lg ${isBusinessProfile ? 'text-mainGreen' : 'text-gray-500'}`} />
            <span className="text-sm whitespace-nowrap">Business Profile</span>
          </div>

          {/* Investor Profile Option */}
          <div className={`flex items-center gap-2 transition-colors duration-300 z-10
            ${!isBusinessProfile ? 'text-mainGreen font-medium' : 'text-gray-400'}`}
          >
            <MdBusinessCenter className={`text-lg ${!isBusinessProfile ? 'text-mainGreen' : 'text-gray-500'}`} />
            <span className="text-sm whitespace-nowrap">Investor Profile</span>
          </div>

          {/* Sliding Background Indicator */}
          <div
            className={`absolute top-0 h-full w-1/2 bg-black/40 rounded-lg 
              border-b-2 border-mainGreen transition-transform duration-300 ease-in-out
              ${isBusinessProfile ? 'translate-x-0' : 'translate-x-full'}`}
          />
        </button>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden flex flex-col bg-mainBlack/90 rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-1 p-1">
          <MobileProfileButton 
            type="Business"
            icon={BsBuildingsFill}
            isActive={isBusinessProfile}
          />
          <MobileProfileButton 
            type="Investor"
            icon={MdBusinessCenter}
            isActive={!isBusinessProfile}
          />
        </div>
      </div>

      {/* Create Profile Modal */}
      {showModal && (
        <Modal>
          <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-mainBlack rounded-lg w-[90vw] max-w-md mx-4 md:mx-0">
            <h3 className="text-lg md:text-xl font-medium">Create Investor Profile</h3>
            <p className="text-gray-400 text-sm md:text-base">
              You need to create an investor profile before accessing the investor dashboard.
              Would you like to create one now?
            </p>
            <div className="flex gap-3 md:gap-4 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 md:px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-400 
                  hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <Link
                href="/dashboard/create-investor-profile"
                className="px-3 md:px-4 py-2 text-sm rounded-lg bg-mainGreen text-white 
                  hover:bg-mainGreen/90 transition-colors duration-200"
              >
                Create Profile
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ProfileToggle