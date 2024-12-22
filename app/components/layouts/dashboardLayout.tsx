"use client";
import Image from "next/image";
import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";
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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState<boolean>(true);
  const [user, setUser] = useState<null | UserDetails>(null);
  const [modal, showModal] = useState<boolean>(false)
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logout = useLogout();

  const toggleDrawerHandler = () => {
    setOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails(token);
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
    <UserProvider user={user} >
      <div className="flex">
        {/* Drawer */}
        <div
          className={`bg-mainBlack text-white fixed flex py-7 items-center flex-col top-0 left-0 h-full transform ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out w-44`}
        >
          <Image
            src={"/assets/logos.svg"}
            height={80}
            width={70}
            alt="triber-logo"
            className=" lg:w-[70px] w-[50px]"
          />
          <nav className="py-10 flex flex-col gap-52 text-base ">
            <div className="flex flex-col gap-6">
              <Link href="/dashboard" className="items-center gap-2 hover:text-mainGreen flex">
                <LuLayoutDashboard /> Home
              </Link>
              <Link href="/dashboard/fundability-test" className="items-center gap-2 hover:text-mainGreen flex">
                <MdOutlineBusinessCenter /> Fundability Test
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

        {/* Content */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${open ? "ml-44" : "ml-0"}`}
        >
          <header className="bg-mainBlack p-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-10">
              <button onClick={toggleDrawerHandler} className="text-2xl">
                <FaBars />
              </button>
              <SearchForm />
            </div>
            <div className="flex items-center gap-7">
              <CreateProfileButton />
              <div className="flex items-center text-2xl gap-4">
                <IoSettingsOutline />
                <GrAnnounce />
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
        {modal && <Modal>
          <div className="flex flex-col p-4 gap-8 bg-mainBlack">
            <p>Are you sure you want to log out? You will need to sign in again to access your account.</p>
            <div className="flex gap-4 ">
              <button className="px-3 py-1 shadow text-sm rounded shadow-white" onClick={logout}>
                Logout
                </button><button className="px-3 py-1 text-sm rounded bg-mainGreen" onClick={()=>showModal(false)}>No</button>
            </div>
          </div>
          </Modal>}
      </div>

    </UserProvider>
  );
}