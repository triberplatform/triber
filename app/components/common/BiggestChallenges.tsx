import Image from "next/image";
import React from "react";
import BlackCard from "./blackCard";
import BlackCardCarousel from "./blackCardCarousel";

export default function BiggestChallenges() {
  return (
    <div className="bg-white text-black  mt-10  px-[10%] py-20">
      <div className="flex items-end gap-5">
        <h1 className="font-serif text-3xl lg:w-[50%] lg:text-left text-center lg:text-4xl font-semibold">
          Biggest challenges faced by  Businesses and founders today
        </h1>
        {/* <Image
          src={"/assets/arrow.png"}
          width={80}
          height={50}
          alt="chat box"
          className="mb-1 hidden lg:block"
        /> */}
      </div>
      <div className=" lg:block hidden">
      <div className="grid lg:grid-cols-9 mt-8 gap-8 ">
        <BlackCard
          heading={"Poor Financial Record"}
          body={
            "Without clear financial data, it’s difficult to prove the business’s viability and growth potential"
          }
        />
        <BlackCard
          heading={"Access to Funding"}
          body={
            "Traditional funding sources, like banks, have strict requirements, and securing investors can be a long, challenging process."
          }
        />
        <BlackCard heading={" Complex Business Valuation"} body={"Founders often misvalue their businesses, leading to missed opportunities or unfavorable investment terms."} />
      </div>
      <div className="grid lg:grid-cols-9 mt-8 gap-8">
        <BlackCard
          heading={"Lenghty Evaluations"}
          body={
            "The process of getting evaluated for investment can be time-consuming, with multiple rounds of due diligence that drains resources and momentum."
          }
        />
        <BlackCard
          heading={"Right Investor Connection"}
          body={
            "Investment-ready SMEs & startups, find it difficult connecting with the right investors who share their vision and industry  interest."
          }
        />
        <BlackCard heading={" Market Visibility"} body={"SMEs & startups struggle to gain visibility and attract attention in a crowded market, making it difficult to stand out and secure investment."} />
      </div>
      </div>
      <div className="lg:hidden">
        <BlackCardCarousel/>
      </div>
     
    </div>
  );
}
