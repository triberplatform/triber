"use client";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import SearchForm from "../dashboard/SearchForm";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import CreateProfileButton from "../dashboard/CreateProfileButton";
import { LuLayoutDashboard } from "react-icons/lu";
import Link from "next/link";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { useLogout } from "@/app/services/auth";
import Loading from "@/app/loading";
import { getUserDetails } from "@/app/services/dashboard";
import { UserDetails } from "@/app/type";
import { UserProvider } from "./UserContext";
import Modal from "../dashboard/Modal";
import ProfileToggle from "../dashboard/ProfileToggle";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<null | UserDetails>(null);
  const [modal, showModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logout = useLogout();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicId = localStorage.getItem("publicId");
    setLoading(true);
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(token as string, publicId as string);
        setUser(userDetails.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [router]);

  if (loading) {
    return <Loading text="Loading" />;
  }

  return (
    <UserProvider user={user}>
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex bg-mainBlack text-white fixed py-7 items-center flex-col top-0 left-0 h-full w-44">
          <Image
            src={"/assets/logos.svg"}
            height={80}
            width={70}
            alt="triber-logo"
            className="w-[70px]"
          />
          <nav className="py-10 flex flex-col gap-52 text-base">
            <div className="flex flex-col gap-6">
              <Link href="/dashboard" className="items-center gap-2 hover:text-mainGreen flex">
                <LuLayoutDashboard /> Home
              </Link>
              <Link href="/dashboard/fundability-test" className="items-center gap-2 hover:text-mainGreen flex">
                <MdOutlineBusinessCenter /> Fundability Check
              </Link>
              <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
                <BsGraphUp /> Deal Room
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
                <IoSettingsOutline /> Settings
              </Link>
              <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
                <BiSupport /> Support
              </Link>
              <button onClick={()=>showModal(true)} className="items-center gap-2 hover:text-mainGreen flex">
                <IoLogOutOutline /> Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black map-bgs text-white z-50 overflow-y-auto">
            <div className="p-4">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <Image
                  src={"/assets/logos.svg"}
                  height={40}
                  width={40}
                  alt="triber-logo"
                />
              
                <button onClick={toggleMobileMenu} className="text-2xl">
                  <IoClose />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <SearchForm />
              </div>

              {/* Add Profile Button */}
             {/* Add Profile Button */}
<div className="mb-8">
  <CreateProfileButton onMobileItemClick={toggleMobileMenu} />
</div>

              {/* Navigation Links */}
              <nav className="flex flex-col pb-12 gap-6">
                <Link href="/dashboard" onClick={toggleMobileMenu} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <LuLayoutDashboard /> Profile
                </Link>
                <Link href="/dashboard/fundability-test" onClick={toggleMobileMenu} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <MdOutlineBusinessCenter /> Fundability test
                </Link>
                <Link href="#" onClick={toggleMobileMenu} className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <BsGraphUp /> Valuation
                </Link>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded" onClick={toggleMobileMenu}>
                  <BsGraphUp /> Deal Room
                </div>
              </nav>

              {/* Bottom Section */}
              <div className="mt-auto pt-12 border-t border-gray-700 flex flex-col gap-6">
                <Link href="#" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <IoSettingsOutline /> Settings
                </Link>
                <Link href="#" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
                  <BiSupport /> Support
                </Link>
                <button 
                  onClick={()=>showModal(true)} 
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
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Link href={'/dashboard'}>       <Image
                src={"/assets/logos.svg"}
                height={40}
                width={40}
                alt="triber-logo"
              /></Link>
       
            </div>
            
            {/* Desktop Items */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-4">
                <SearchForm />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-7">
              <ProfileToggle/>
              <CreateProfileButton />
              <div className="flex items-center text-2xl gap-4">
                <IoSettingsOutline />
                <GrAnnounce />
              </div>
            </div>
            <div className="lg:hidden">
            <ProfileToggle/>
            </div>
            
            {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="text-2xl lg:hidden">
              <FaBars />
            </button>
          </header>

          <main className="p-6">{children}</main>
        </div>
        
        {modal && <Modal>
          <div className="flex flex-col p-4 gap-8 bg-mainBlack">
            <p>Are you sure you want to log out? You will need to sign in again to access your account.</p>
            <div className="flex gap-4">
              <button className="px-3 py-1 shadow text-sm rounded shadow-white" onClick={logout}>
                Logout
              </button>
              <button className="px-3 py-1 text-sm rounded bg-mainGreen" onClick={()=>showModal(false)}>
                No
              </button>
            </div>
          </div>
        </Modal>}
      </div>
    </UserProvider>
  );
}