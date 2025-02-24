'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FaBars } from 'react-icons/fa6'
import { IoClose, IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5'
import { GrAnnounce } from 'react-icons/gr'
import { LuLayoutDashboard } from 'react-icons/lu'
import { MdOutlineBusinessCenter } from 'react-icons/md'
import { BsGraphUp, BsBuilding } from 'react-icons/bs'
import { BiSupport } from 'react-icons/bi'
import Link from 'next/link'
import { useLogout } from '@/app/services/auth'
import Loading from '@/app/loading'
import { getUserDetails } from '@/app/services/dashboard'
import Modal from '@/app/components/dashboard/Modal'
import CreateProfileButton from '@/app/components/dashboard/CreateProfileButton'
import ProfileToggle from '@/app/components/dashboard/ProfileToggle'
import SearchForm from '@/app/components/dashboard/SearchForm'
import { UserProvider } from '@/app/components/layouts/UserContext'
import type { UserDetails } from '@/app/type'

// Separate navigation components into their own client components
const BusinessNavLinks = () => (
  <div className="flex flex-col gap-6">
    <Link href="/dashboard" className="items-center gap-2 hover:text-mainGreen flex">
      <LuLayoutDashboard />  Home
    </Link>
    <Link href="/dashboard/fundability-test" className="items-center gap-2 hover:text-mainGreen flex">
      <MdOutlineBusinessCenter /> Fundability Check
    </Link>
    <Link href="/dashboard/deal-room" className="items-center gap-2 hover:text-mainGreen flex">
      <BsGraphUp /> Deal Room
    </Link>
  </div>
)
const InvestorNavLinks = () => (
  <div className="flex flex-col gap-6">
    <Link href="/dashboard/investor" className="items-center gap-2 hover:text-mainGreen flex">
      <LuLayoutDashboard />  Home
    </Link>
    <Link href="/dashboard/deal-room/dashboard" className="items-center gap-2 hover:text-mainGreen flex">
      <BsBuilding />Deal Room
    </Link>
  </div>
)

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserDetails | null>(null)
  const [modal, showModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isBusinessProfile, setIsBusinessProfile] = useState(true)
  const router = useRouter()
  const logout = useLogout()

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  // Listen to localStorage changes for profile switches
  useEffect(() => {
    const handleStorageChange = () => {
      const currentProfile = localStorage.getItem('currentProfile') || 'business'
      setIsBusinessProfile(currentProfile === 'business')
    }

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange)
    
    // Initialize profile state
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Handle user authentication and data fetching
  useEffect(() => {
    const initializeLayout = async () => {
      const token = localStorage.getItem('token')
      const publicId = localStorage.getItem('publicId')
      
      if (!token || !publicId) {
        router.push('/login')
        return
      }

      try {
        const userDetails = await getUserDetails(token, publicId)
        setUser(userDetails.data)
        console.log(userDetails.data)
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializeLayout()
  }, [router])

  if (loading) {
    return <Loading text="Loading" />
  }

  return (
    <UserProvider user={user}>
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex bg-mainBlack text-white text-sm fixed py-7  flex-col top-0 left-0 h-full w-44">
          <Image
            src="/assets/logos.svg"
            height={80}
            width={70}
            alt="triber-logo"
            className="w-16 self-center"
            priority
          />
          <nav className="py-10 flex flex-col relative ml-2 h-screen items-start  text-base">
            <div className='text-sm'>
            {isBusinessProfile ? <BusinessNavLinks /> : <InvestorNavLinks />}
            </div>
           

            <div className="flex flex-col absolute bottom-0 text-sm left-0  gap-6">
              <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
                <IoSettingsOutline /> Settings
              </Link>
              <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
                <BiSupport /> Support
              </Link>
              <button 
                onClick={() => showModal(true)} 
                className="items-center gap-2 hover:text-mainGreen flex"
              >
                <IoLogOutOutline /> Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 map-bgs bg-black text-white z-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <Image 
                  src="/assets/logos.svg" 
                  height={40} 
                  width={40} 
                  alt="triber-logo"
                  priority 
                />
                <button onClick={toggleMobileMenu} className="text-2xl">
                  <IoClose />
                </button>
              </div>

              <div className="my-8 flex flex-col gap-6">
                <SearchForm />
                <CreateProfileButton onMobileItemClick={toggleMobileMenu} />
              </div>

              <nav className="flex flex-col pb-16 gap-6" onClick={toggleMobileMenu}>
                {isBusinessProfile ? <BusinessNavLinks /> : <InvestorNavLinks />}
              </nav>

              <div className="mt-auto pt-16 border-t text-sm border-gray-700 flex flex-col gap-6">
                <Link href="#" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <IoSettingsOutline /> Settings
                </Link>
                <Link href="#" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <BiSupport /> Support
                </Link>
                <button 
                  onClick={() => showModal(true)} 
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded"
                >
                  <IoLogOutOutline /> Log out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${!mobileMenuOpen ? "lg:ml-44" : ""}`}>
          <header className="bg-mainBlack p-4 shadow-md flex items-center justify-between">
            <div className="lg:hidden">
              <Link href="/dashboard">
                <Image 
                  src="/assets/logos.svg" 
                  height={40} 
                  width={40} 
                  alt="triber-logo"
                  priority 
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-10">
              <SearchForm />
            </div>

            <div className="hidden lg:flex items-center gap-7">
              <ProfileToggle />
              <CreateProfileButton />
              <div className="flex items-center text-2xl gap-4">
                <IoSettingsOutline />
                <GrAnnounce />
              </div>
            </div>

            <div className="lg:hidden">
              <ProfileToggle />
            </div>

            <button onClick={toggleMobileMenu} className="text-2xl lg:hidden">
              <FaBars />
            </button>
          </header>

          <main className="p-6">{children}</main>
        </div>

        {modal && (
          <Modal>
            <div className="flex flex-col p-4 gap-8 bg-mainBlack">
              <p>
                Are you sure you want to log out? You will need to sign in again
                to access your account.
              </p>
              <div className="flex gap-4">
                <button
                  className="px-3 py-1 shadow text-sm rounded shadow-white"
                  onClick={logout}
                >
                  Logout
                </button>
                <button
                  className="px-3 py-1 text-sm rounded bg-mainGreen"
                  onClick={() => showModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </UserProvider>
  )
}