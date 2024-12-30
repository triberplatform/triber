import Sponsor from "@/app/components/common/Sponsor";
import Image from "next/image";
import React from "react";

export default function Sponsors() {
  return (
    <div className="pt-16 pb-20 lg:pb-32 mx-5 text-center">
      <p className="lg:text-4xl text-3xl font-serif font-semibold">
        We&apos;re Not Just Building a Platform
      </p>
      <p className="mt-3">We&apos;re building a movement.</p>
      <div className="lg:flex-row flex-col flex items-center justify-center mt-10 mb-20">
        <div className="mt-7">
          <Image
            src={"/assets/team-chat2.png"}
            width={200}
            height={20}
            alt="chat"
          />
        </div>
        <div className="flex flex-col mt-6 lg:mt-0 gap-6">
          <Image
            src={"/assets/team-chat1.png"}
            width={200}
            height={20}
            alt="chat"
            className="lg:ml-7"
          />
          <Image
            src={"/assets/team-chat3.png"}
            width={200}
            height={20}
            alt="chat"
          />
        </div>
      </div>
      <div>
        <p className="lg:text-4xl text-3xl hidden lg:block font-serif font-semibold mb-8">
          Empowering Growth Through <br /> Our Strategic Partnerships
        </p>
        <p className="lg:text-4xl text-3xl font-serif lg:hidden font-semibold mb-8">
          Empowering Growth Through Strategic Partnerships
        </p>
       <Sponsor/>
      </div>
    </div>
  );
}
