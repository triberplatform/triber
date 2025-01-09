"use client";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../dashboard/Modal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="text-center lg:pb-10 lg:mt-3">
      <p className="lg:text-[3.2rem] text-4xl mx-auto font-semibold lg:w-full w-[50%] font-serif">
        Connect. Grow. Succeed.
      </p>
      <p className="my-8 mx-3">
        The Pioneering Platform Connecting SMEs and Startups with Investors
      </p>
      <Image
        src="/assets/map.png"
        width={800}
        height={50}
        alt="hero map"
        className="object-contain mx-auto hidden lg:block "
      />

      <Image
        src="/assets/hero-mobile.png"
        width={800}
        height={50}
        alt="hero map"
        className="object-contain px-10 mt-16 pb-10 lg:hidden"
      />
      {isModalOpen && (
        <Modal>
          <div className="max-h-[85vh] lg:h-[85vh] py-10 modal-scroll px-5 w-full">
            <button
              onClick={toggleModal}
              className=" text-3xl text-mainGreen  float-right"
            >
                &times;
            </button>
            <p className="lg:text-2xl text-xl font-semibold mb-2 font-serif text-white">
              Welcome to Triber <span className="text-mainGreen">Connect</span>  Directly <br /> with our Partners
            </p>
            <form
              action=""
              className="flex-col flex gap-3 mt-7 lg:space-y-5 text-left text-white font-serif"
            >
              <div className="lg:grid grid-cols-2 space-y-5 lg:space-y-0 gap-5">
                <div className="col-span-1 flex lg:gap-2 flex-col">
                  <label
                    htmlFor="businessName"
                    className="font-sansSerif text-sm"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Registered Business Name"
                    className="lg:w-full py-2 rounded border-gray-500 px-5 focus:outline-none border focus:ring-0"
                  />
                </div>
                <div className="col-span-1 flex lg:gap-2 flex-col">
                  <label
                    htmlFor="businessType"
                    className="font-sansSerif text-sm"
                  >
                    Business Registration
                  </label>
                  <select
                    id="businessType"
                    className="lg:w-full border-gray-500 border bg-black py-[0.7rem] rounded px-5 focus:outline-none focus:ring-0"
                  >
                    <option value="" className="hover:bg-mainGreen">
                      Select Company Type
                    </option>
                    <option value="unregistered" className="hover:bg-mainGreen">
                      Unregistered Business
                    </option>
                    <option value="llc" className="hover:bg-mainGreen">
                      Limited Liability Company
                    </option>
                    <option
                      value="soleProprietorship"
                      className="hover:bg-mainGreen"
                    >
                      Sole Proprietorship
                    </option>
                  </select>
                </div>
              </div>
              <div className="lg:grid grid-cols-2 space-y-5 lg:space-y-0 gap-5">
                <div className="col-span1 flex gap-1 flex-col">
                  <label
                    htmlFor="annualTurnover"
                    className="font-sansSerif text-sm"
                  >
                    Annual Turnover
                  </label>
                  <input
                    type="text"
                    placeholder="Annual Turnover"
                    className="lg:w-full border-gray-500 border py-2 rounded px-5 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="col-span-1 flex gap-1 flex-col">
                  <label
                    htmlFor="fundingRequirement"
                    className="font-sansSerif text-sm"
                  >
                    Funding Requirement
                  </label>
                  <input
                    type="text"
                    placeholder="Funding Requirement"
                    className="lg:w-full border-gray-500 border py-2 rounded px-5 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
              <div className="lg:grid grid-cols-2 mt-5 lg:mt-0 gap-5">
                <div className="col-span-2 flex gap-1 flex-col">
                <label
                  htmlFor="businessDescription"
                  className="font-sansSerif text-sm"
                >
                  Brief Business Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Business Description"
                  className="lg:w-full border-gray-500 border bg-black py-3 rounded px-5 focus:outline-none focus:ring-0"
                />
                </div>
                
              </div>

              <button
                type="submit"
                className="bg-mainGreen px-7 mt-4  py-2 w-full rounded-lg text-sm"
              >
                Apply
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
