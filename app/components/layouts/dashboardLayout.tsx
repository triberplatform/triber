"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import SearchForm from "../dashboard/SearchForm";
import { IoSettingsOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import CreateProfileButton from "../dashboard/CreateProfileButton";
import { LuLayoutDashboard } from "react-icons/lu";
import Link from "next/link";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState<boolean>(true);
  const toggleDrawerHandler = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div className="flex">
      {/* Drawer */}
      <div
        className={`bg-mainBlack text-white fixed flex py-7 items-center flex-col top-0 left-0 h-full transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-44`}
      >
        <Image
          src={"/assets/logo.svg"}
          height={80}
          width={70}
          alt="triber-logo"
          className=" lg:w-[70px] w-[50px]"
        />
        <nav className="py-16 space-y-6 ">
          <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
          <LuLayoutDashboard /> Home
          </Link>
          <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
          <MdOutlineBusinessCenter /> Fundability Test
          </Link>
          <Link href="#" className="items-center gap-2 hover:text-mainGreen flex">
          <BsGraphUp />  Deal Room
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          open ? "ml-44" : "ml-0"
        }`}
      >
        <header className="bg-mainBlack p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-10">
          <button
            onClick={toggleDrawerHandler}
            className="text-2xl"
          >
            <FaBars/>
          </button>
          <SearchForm/>

          </div>
          <div className="flex items-center gap-7">
           <CreateProfileButton/>
          <div className="flex items-center text-2xl gap-4">
            <IoSettingsOutline/>
            <GrAnnounce/>
         </div>
          </div>
       
       
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
