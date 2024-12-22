import React from "react";

export default function ConnectForm() {
  return (
    <div className="pt-16 pb-28 px-5 lg:px-[10%] w-full map-bgs">
      <p className="lg:text-4xl text-3xl font-semibold mb-2  font-serif">
        Connect Directly with our Partners
      </p>
      <p className="font-serif">Need Assistance? We&apos;re Here to Help</p>
      <div>
        <form
          action=""
          className="flex-col flex gap-3 mt-7 text-white font-serif"
        >
          <label htmlFor="businessName" className="font-sansSerif text-sm">
            Business Name
          </label>
          <input
            type="text"
            placeholder="Enter Registered Business Name"
            className="lg:w-[50%] py-3 rounded border-gray-500 px-5 focus:outline-none border focus:ring-0 "
          />
          <label htmlFor="businessName" className="font-sansSerif text-sm">
            Business Registration
          </label>
          <select
            id="businessName"
            className="lg:w-[50%] border-gray-500 border bg-black py-3 rounded px-5 focus:outline-none focus:ring-0"
          >
            <option value="" className='hover:bg-mainGreen'>Select Company Type</option>
            <option value="unregistered" className='hover:bg-mainGreen'>Unregistered Business</option>
            <option value="llc" className='hover:bg-mainGreen'>Limited Liability Company</option>
            <option value="soleProprietorship" className='hover:bg-mainGreen'>Sole Proprietorship</option>
          </select>

          <label htmlFor="businessName" className="font-sansSerif text-sm">
            Annual Turnover
          </label>
          <input
            type="text"
            placeholder="Annual Turnover"
            className="lg:w-[50%] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0 "
          />
          <label htmlFor="businessName" className="font-sansSerif text-sm">
            Funding Requirement
          </label>
          <input
            type="text"
            placeholder="Funding Requirement"
            className="lg:w-[50%] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0 "
          />
          <label htmlFor="businessName" className="font-sansSerif text-sm">
            Brief Business Description
          </label>
          <textarea
            rows={4}
            placeholder="Business Description"
            className="lg:w-[50%] border-gray-500 border bg-black py-3 rounded px-5 focus:outline-none focus:ring-0 "
          />
          <button
            type="submit"
            className=" bg-mainGreen px-7 py-2 mt-7 rounded-lg text-sm w-32"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
}
