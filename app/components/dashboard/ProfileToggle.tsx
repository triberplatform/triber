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

// Type definitions
interface MobileProfileButtonProps {
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

// Define the CustomEvent interface
interface ProfileChangeEvent extends CustomEvent {
  detail: {
    profile: string;
  };
}

const ProfileToggle = () => {
  // Hooks and state
  const { user } = useUser()
  const router = useRouter()
  const [isBusinessProfile, setIsBusinessProfile] = useState(() => {
    // Fix: Check if running in browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const currentProfile = localStorage.getItem('currentProfile')
      return currentProfile !== 'investor'
    }
    return true // Default to business profile if not in browser
  })
  const [showModal, setShowModal] = useState(false)

  // Profile checks
  const hasInvestorProfile = user?.investorProfile && 
    Object.keys(user.investorProfile).length > 0

  // Profile toggle handler
  const toggleProfile = () => {
    // Check if user is trying to switch FROM business TO investor profile but doesn't have one
    // isBusinessProfile === true means we're currently on business and trying to switch to investor
    if (isBusinessProfile && !hasInvestorProfile) {
      setShowModal(true)
      return
    }

    const newValue = !isBusinessProfile
    setIsBusinessProfile(newValue)
    
    // Set correct profile value in localStorage
    const newProfile = newValue ? 'business' : 'investor'
    localStorage.setItem('currentProfile', newProfile)
    
    // Create and dispatch a custom event with profile data
    const event = new CustomEvent('profileChange', { 
      detail: { profile: newProfile } 
    }) as ProfileChangeEvent
    window.dispatchEvent(event)
    
    // Force-redirect to the appropriate dashboard
    router.push(newValue ? '/dashboard' : '/dashboard/investor')
  }

  // localStorage sync effect
  useEffect(() => {
    const handleProfileChange = (e: Event | ProfileChangeEvent) => {
      // Check if this is our custom event
      if ('detail' in e && e.type === 'profileChange' && e.detail && e.detail.profile) {
        setIsBusinessProfile(e.detail.profile === 'business')
      } else {
        // This is a standard storage event
        const currentProfile = localStorage.getItem('currentProfile')
        setIsBusinessProfile(currentProfile !== 'investor')
      }
    }

    // Add event listeners for both standard storage and custom events
    window.addEventListener('storage', handleProfileChange as EventListener)
    window.addEventListener('profileChange', handleProfileChange as EventListener)
    
    // Initialize state on component mount
    if (typeof window !== 'undefined') {
      const currentProfile = localStorage.getItem('currentProfile')
      setIsBusinessProfile(currentProfile !== 'investor')
    }
    
    return () => {
      window.removeEventListener('storage', handleProfileChange as EventListener)
      window.removeEventListener('profileChange', handleProfileChange as EventListener)
    }
  }, [])

  // Mobile Profile Button Component
  const MobileProfileButton: React.FC<MobileProfileButtonProps> = ({ type, icon: Icon, isActive }) => (
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
          <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-mainBlack rounded-lg mx-4 md:mx-0">
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
                href="/dashboard/investor-register"
                onClick={() => setShowModal(false)}
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