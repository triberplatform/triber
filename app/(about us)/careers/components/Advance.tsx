import Image from "next/image";
import React from "react";

export default function Advance() {
  return (
    <div className="lg:px-[7%] mx-5">
      <div className="lg:px-[15%] bg-black-horizontal text-center py-16">
        <p className="text-4xl font-serif">
          At Triber, we are advancing the future of small businesses and
          startups through easy access to funding, education, and strategic
          partnerships.{" "}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 my-10 lg:my-16">
        <div className="col-span-1 mb-5 lg:mb-0 pt-5">
          <p className="text-xl font-semibold mb-5">
            Training 1 Million Graduates
          </p>
          <p>
            We’re committed to equipping the next generation of entrepreneurs
            and business leaders with the skills and knowledge they need to
            succeed
          </p>
        </div>
        <div className="col-span-1  lg:flex justify-end">
          <Image
            src={"/assets/career-image.png"}
            height={50}
            width={350}
            alt="career-image"
            className=""
          />
        </div>
      </div>
      <div className="lg:grid flex flex-col-reverse lg:grid-cols-2 my-10  lg:my-16">
        <div className="col-span-1 flex justify-start">
          <Image
            src={"/assets/career-image2.png"}
            height={50}
            width={350}
            alt="career-image"
            className="s"
          />
        </div>
        <div className="col-span-1 mb-5 lg:mb-0 pt-5">
          <p className="text-xl font-semibold mb-5">
            Building a Network of 1,000 Financial Evaluators
          </p>
          <p>
            A robust team of financial evaluators working directly with SMEs &
            startups, providing expert insights and accurate valuations to
            ensure businesses are set up for funding success.
          </p>
        </div>
      </div>
      <div className="bg-career-map pt-12 pb-10 lg:pb-52">
        <p className="lg:text-3xl text-2xl font-serif font-semibold">
          Partnering with 500 Business Accelerators
        </p>
        <p className="lg:w-[30%] mt-4">
          We are working to create a global network of business accelerators
          that will fast-track the growth of startups. Partnering with MBA
          institutes and industry leaders. Offer cutting-edge insights and
          mentorship that elevate businesses to supreme heights
        </p>
        <Image
            src={"/assets/career-map-mobile.png"}
            height={50}
            width={350}
            alt="career-image"
            className="py-7 lg:hidden"
          />
      </div>
    </div>
  );
}
