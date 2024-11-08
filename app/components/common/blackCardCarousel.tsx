"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";
import Slider from "react-slick";
import BlackCard from "./blackCard";
export default function BlackCardCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    const settings = {
      infinite: true,
      dots: true,
      speed: 500,
      autoplay: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      beforeChange: (current: number, next: number) => {
        setActiveIndex(next);
      },
      appendDots: (dots: JSX.Element[]) => (
        <div
          className="flex lg:gap-6 gap-3 lg:py-4" // responsive gap and padding
        >
          <ul className="flex justify-center lg:gap-3 p-0 list-none">{dots}</ul>
        </div>
      ),
      customPaging: (i: number) => (
        <div
          className="w-2 h-2 lg:w-5 lg:h-5 rounded-full mt-5 border-2 border-black cursor-pointer relative flex items-center justify-center" // responsive size
        >
          <div
            className={`w-full h-full rounded-full transition-colors duration-300 ${
              i === activeIndex ? "bg-black" : "bg-transparent"
            }`}
          />
        </div>
      ),
    };

  return (
    <div className="bg-white py-5 lg:px-[10%]">
      
      <Slider {...settings}>
        <BlackCard
          heading={"Poor Financial Record"}
          body={
            "Without clear financial data, it’s difficult to prove the business’s viability and growth potential."
          }
        />
        <BlackCard
          heading={"Access to Funding"}
          body={
            "Traditional funding sources, like banks, have strict requirements, and securing investors can be a long, challenging process."
          }
        />
        <BlackCard
          heading={"Complex Business Valuation"}
          body={
            "Founders often misvalue their businesses, leading to missed opportunities or unfavorable investment terms."
          }
        />
        <BlackCard
          heading={"Lengthy Evaluations"}
          body={
            "The process of getting evaluated for investment can be time-consuming, with multiple rounds of due diligence that drains resources and momentum."
          }
        />
        <BlackCard
          heading={"Right Investor Connection"}
          body={
            "Investment-ready SMEs & startups, find it difficult connecting with the right investors who share their vision and industry interest."
          }
        />
        <BlackCard
          heading={"Market Visibility"}
          body={
            "SMEs & startups struggle to gain visibility and attract attention in a crowded market, making it difficult to stand out and secure investment."
          }
        />
      </Slider>
    </div>
  );
}
