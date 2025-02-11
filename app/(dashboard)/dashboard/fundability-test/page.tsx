import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function page() {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="font-semibold mt-8 lg:mt-4 py-4 rounded px-5 bg-fundability relative">
        <div className="bg-black bg-opacity-50 inset-0 absolute top-0 right-0"></div>
        <div className="relative text-white">
          Discover Your SME/Startup <br />
          Fundability Score with our <br />
          Fundability Check (Readiness assessment)
        </div>{" "}
      </div>
      <div className="py-4 px-5 bg-mainBlack text-sm lg:text-sm flex items-center gap-5">
        <AiOutlineExclamationCircle className="text-2xl" />

        <p>
          A low score does not signal an inability to secure funding. It’s
          highlights an opportunity for improvement to enable the business
          secure quicker, cheaper and flexible funding. Triber possesses the
          tools, expertise and collaborations to help boost your ability to
          secure the needed funds to grow your business
        </p>
      </div>
      <p className=" font-semibold py-2">Take Fundability test as a</p>
      <div className="grid lg:grid-cols-2  gap-6">

        <div className="bg-mainBlack p-3 flex flex-col gap-2">
            <Image src="/assets/fundability-subs.png" width={300} height={30} alt="fund" className="w-full"/>
            <p className="my-4">Startup</p>
            <Link href={'fundability-test/select-startup'} className="text-center mb-3 lg:my-3">      <span className="text-center my-3"><button className="text-center bg-mainGreen w-full lg:max-w-full lg:bg-black shadow-sm shadow-white py-1 px-5">Take Test</button></span></Link>
        </div>
        <div className="bg-mainBlack p-3 flex flex-col gap-2">
            <Image src="/assets/fundability-sub.png" width={300} height={30} alt="fund" className="w-full"/>
            <p className="my-4">SMEs</p>
           <Link href={'fundability-test/select-business'} className="text-center mb-3 lg:my-3"> <span className="text-center my-3"><button className="text-center lg:bg-black bg-mainGreen w-full max-w-full shadow-white shadow-sm py-1 px-5">Take Test</button></span></Link>
        </div>
      </div>
    </div>
  );
}
