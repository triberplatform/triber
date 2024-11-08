import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="text-center lg:mt-3">
      <p className="lg:text-[3.2rem] text-4xl mx-auto font-semibold lg:w-full w-[50%] font-serif">Connect. Grow. Succeed.</p>
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
    </div>
  );
}
