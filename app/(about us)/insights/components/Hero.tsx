import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="mt-3 mb-10 text-center px-[10%]">
      <p className="lg:text-[3.2rem] font-semibold text-4xl mb-2 font-serif">Resources & Insights</p>
      <p className="mb-3 mx-auto lg:w-[60%]">
        Triber, we’re more than just a team—we’re a community of innovators,
        strategists, and dreamers. Together, we’re building a platform that
        empowers small businesses to thrive.
      </p>
    </div>
  );
}
