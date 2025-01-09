import Link from "next/link";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="relative bg-white text-black grid mt-28 lg:mt-0 pt-24 pb-10 lg:pb-20 px-[5%] lg:grid-cols-10">
        
        <div className="absolute px-[5%] lg:px-[20%] top-[-8%] lg:top-[-20%] w-full">
        <div className=" bg-mainGreen  rounded items-center lg:flex-row flex flex-col justify-center lg:gap-0 gap-5  lg:justify-between py-6 lg:py-7 px-8 text-white">
            <p className="text-2xl font-semibold font-serif">
            Ready to Take <br /> the Next Step?
            </p>
            <Link href={'/login'} className="bg-black py-3 px-5 lg:px-12 rounded-lg">
                Get Started
            </Link>

        </div>
        </div>
      
      <div className="col-span-3 mb-7 lg:mb-0">
        <p className="text-3xl font-bold mt-10 lg:mt-0 font-serif">
          Become a <br></br> Triber
        </p>
        <p>© {currentYear} Triber. All Rights Reserved.</p>
      </div>
      <div className="col-span-7 flex-col flex gap-10 lg:flex-row lg:gap-16">
        <div>
          <p className="text-xl font-semibold font-serif">Product</p>
          <div className="flex flex-col gap-2 mt-2">
            <Link href={"/login"}>Fundability Test</Link>
            <Link href={"/login"}>Valuation</Link>
            <Link href={"/login"}>Deal Room</Link>
            <Link href={"/login"}>Database</Link>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold font-serif">Collaborations</p>
          <div className="flex flex-col gap-2 mt-2">
            <Link href={"/"}>Business Accelerators</Link>
            <Link href={"/"}>Financial Institutions </Link>
            <Link href={"/"}>Private Equity Firms</Link>
            <Link href={"/"}>Venture Services</Link>
          </div>
        </div>
       
        <div>
          <p className="text-xl font-semibold font-serif">Product</p>
          <div className="flex flex-col gap-2 mt-2">
            <Link href={"/login"}>Fundability Test</Link>
            <Link href={"/login"}>Valuation</Link>
            <Link href={"/login"}>Deal Room</Link>
            <Link href={"/login"}>Database</Link>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold font-serif">About Us</p>
          <div className="flex flex-col gap-2 mt-2">
            <Link href={"/teams"}>Team</Link>
            <Link href={"/career"}>Careers</Link>
            <Link href={"/team"}>Research</Link>
            <Link href={"/team"}>Partners</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
