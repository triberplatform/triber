"use client";
import BlackCard from "@/app/components/common/blackCard";
import React, { useState } from "react";

export default function OpenRoles() {
  const [displayRoles, setDisplayRoles] = useState<number>(1);

  return (
    <div className="bg-white py-12 text-black px-5 lg:px-[7%]">
      <p className="lg:text-4xl text-3xl font-semibold font-serif">Open Roles</p>

      {/* Buttons to toggle roles display */}
      <div className="flex gap-5 mt-4 mb-7">
        <button
          onClick={() => setDisplayRoles(1)}
          className={`lg:px-6 px-2 py-2 text-sm rounded  ${
            displayRoles === 1 ? "bg-mainGreen text-white" : "bg-green-200 text-black"
          }`}
        >
          Trainee
        </button>
        <button
          onClick={() => setDisplayRoles(2)}
          className={`lg:px-6 px-2 text-sm py-2 rounded ${
            displayRoles === 2 ? "bg-mainGreen text-white" : "bg-green-200 text-black"
          }`}
        >
          Financial Evaluator
        </button>
        <button
          onClick={() => setDisplayRoles(3)}
          className={`lg:px-6 px-2 py-2 text-sm rounded  ${
            displayRoles === 3 ? "bg-mainGreen text-white" : "bg-green-200 text-black"
          }`}
        >
          Business Accelerator
        </button>
      </div>

      {/* Conditionally rendered role sets */}
      {displayRoles === 1 && (
        <div className="grid lg:grid-cols-9 mt-8 gap-8">
          <BlackCard
            heading={"Trainee"}
            body={
              "Are you a talented undergrad seeking a transformative internship? Apply now to join our firm. Gain hands-on experience, develop professional skills, and network with industry leaders and kickstart your career."
            }
          />
          <BlackCard
            heading={"Trainee"}
            body={
              "Are you a talented undergrad seeking a transformative internship? Apply now to join our firm. Gain hands-on experience, develop professional skills, and network with industry leaders and kickstart your career."
            }
          />
          <BlackCard
            heading={"Trainee"}
            body={
              "Are you a talented undergrad seeking a transformative internship? Apply now to join our firm. Gain hands-on experience, develop professional skills, and network with industry leaders and kickstart your career."
            }
          />
        </div>
      )}

      {displayRoles === 2 && (
        <div className="grid lg:grid-cols-9 mt-8 gap-8">
          <BlackCard
            heading={"Financial Evaluator"}
            body={
              "We invite you to join our network of experts providing critical financial guidance to SMEs and startups."
            }
          />
          <BlackCard
            heading={"Financial Evaluator"}
            body={
              "We invite you to join our network of experts providing critical financial guidance to SMEs and startups."
            }
          />
          <BlackCard
            heading={"Financial Evaluator"}
            body={
              "We invite you to join our network of experts providing critical financial guidance to SMEs and startups."
            }
          />
        </div>
      )}

      {displayRoles === 3 && (
        <div className="grid lg:grid-cols-9 mt-8 gap-8">
          <BlackCard
            heading={"Business Accelerator"}
            body={
              "Join our team of business accelerators! We&apos;re looking for partners to help support small businesses and startups. Collaborating, leveraging resources and expertise to drive entrepreneurship and economic development."
            }
          />
          <BlackCard
            heading={"Business Accelerator"}
            body={
              "Join our team of business accelerators! We&apos;re looking for partners to help support small businesses and startups. Collaborating, leveraging resources and expertise to drive entrepreneurship and economic development."
            }
          />
          <BlackCard
            heading={"Business Accelerator"}
            body={
              "Join our team of business accelerators! We&apos;re looking for partners to help support small businesses and startups. Collaborating, leveraging resources and expertise to drive entrepreneurship and economic development."
            }
          />
        </div>
      )}
    </div>
  );
}
