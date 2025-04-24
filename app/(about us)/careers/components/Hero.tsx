"use client";
import Image from "next/image";
import React from "react";

export default function Hero() {

  return (
    <div className="mt-3 mb-10 text-center mx-5 lg:px-[10%]">
      <p className="lg:text-[3.2rem] text-4xl lg:mb-5  font-semibold font-serif">
        Join Our Tribe
      </p>
      <p className="mb-3 mt-4 lg:mt-0 mx-auto lg:w-[60%]">
        At Triber, we&apos;re more than just a team—we&apos;re a community of innovators,{" "}
        strategists, and dreamers. Together, we&apos;re building, and leverage our
        resources and expertise that empowers Startups, small & growing
        businesses to thrive. We&apos;re driving entrepreneurship and economic
        development.{" "}
      </p>
      <Image src={"/assets/careers.png"} width={2000} height={20} alt="chat" />
    </div>
  );
}