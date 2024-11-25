"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Button from "./Button";
import { LiaAngleDownSolid } from "react-icons/lia";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <nav className="flex justify-between py-7  px-[5%] items-center relative">
        <Link href={"/"}>
          <Image
            src={"/assets/logo.svg"}
            height={80}
            width={70}
            alt="triber-logo"
            className=" lg:w-[80px] w-[50px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-7 items-center">
          <Link className="hover:text-mainGreen" href="/login">
            Fundability test
          </Link>
          <Link className="hover:text-mainGreen" href="/login">
            Valuation
          </Link>
          <Link className="hover:text-mainGreen" href="/login">
            Deal Room
          </Link>
          <Link className="hover:text-mainGreen" href="/login">
            Database
          </Link>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className={`flex items-center hover:text-mainGreen ${
                isDropdownOpen ? "text-mainGreen" : ""
              }`}
            >
              About Us <LiaAngleDownSolid className="pl-3 text-2xl" />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute top-full mt-2 w-[150px] bg-black z-10 text-sm shadow-white shadow-sm bg-drop rounded-lg p-4"
                onClick={() => setDropdownOpen(false)}
              >
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link className="hover:text-mainGreen" href="/teams">
                      Team
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-mainGreen" href="/careers">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link className="hover:text-mainGreen" href="/insights">
                      Insights
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-2xl relative z-30"
        >
          <div
            className={`transform transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-90" : ""
            }`}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </button>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 z-20 transform transition-transform duration-500 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col px-5 text-sm pt-20">
            <Link
              className="text-white text-lg py-3 hover:text-mainGreen"
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fundability test
            </Link>
            <Link
              className="text-white text-lg py-3 hover:text-mainGreen"
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Valuation
            </Link>
            <Link
              className="text-white text-lg py-3 hover:text-mainGreen"
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Deal Room
            </Link>
            <Link
              className="text-white text-lg py-3 hover:text-mainGreen"
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              Database
            </Link>
            <div className="relative mt-2">
              <button
                onClick={toggleDropdown}
                className="text-white text-lg flex items-center hover:text-mainGreen"
              >
                About Us <LiaAngleDownSolid className="pl-2 text-xl" />
              </button>
              {isDropdownOpen && (
                <div className="mt-2 w-full bg-drop-mobile  shadow-lg rounded-lg p-4">
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        className="hover:text-mainGreen"
                        href="/teams"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Team
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-mainGreen"
                        href="/careers"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-mainGreen"
                        href="/insights"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Insights
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-10">
              <Button link="/signup" text="Get Started" />
            </div>
          </div>
        </div>

        {/* Desktop Get Started Button */}
        <div className="hidden lg:block">
          <Button link="/signup" text="Get Started" />
        </div>
      </nav>
    </div>
  );
}
