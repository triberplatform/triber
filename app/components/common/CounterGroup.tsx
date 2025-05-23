import React from "react";
import Counter from "./Counter";

export default function CounterGroup() {
  return (
    <div className="bg-white py-1 px-[10%]">
      <section className="lg:my-10 my-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-3xl text-black text-center">
        <div className="flex flex-col items-center lg:border-r border-gray-300 last:border-none">
          <Counter targetNumber={3} duration={2} text="Years of Fund raising" />
        </div>
        <div className="flex flex-col items-center lg:border-r border-gray-300 last:border-none">
          <Counter
            targetNumber={200}
            duration={2}
            text="Business Accelerators"
          />
        </div>
        <div className="flex flex-col items-center lg:border-r border-gray-300 last:border-none">
          <Counter targetNumber={8} duration={2} text="Banking Partners" />
        </div>
        <div className="flex flex-col items-center lg:border-r  border-gray-300 last:border-none">
          <Counter targetNumber={1.61} Amt="Bn" duration={2} text="Fund raised" />
        </div>
        <div className="flex flex-col items-center">
          <Counter targetNumber={300} duration={2} text="Financial Experts" />
        </div>
      </section>
    </div>
  );
}
