"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React, { useState } from "react";

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    infinite: true,
    dots: true,
    speed: 500,
    autoplay: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  
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
        className="w-2 h-2 lg:w-5 lg:h-5 rounded-full mt-5 border-2 border-white cursor-pointer relative flex items-center justify-center" // responsive size
      >
        <div
          className={`w-full h-full rounded-full transition-colors duration-300 ${
            i === activeIndex ? "bg-white" : "bg-transparent"
          }`}
        />
      </div>
    ),
  };

  return (
    <div className="lg:px-[10%] px-5 pt-5 pb-16 lg:py-16">
      <Slider {...settings}>
        <div className="slide1 flex flex-col justify-center relative z-30 items-center ">
          <div className="flex justify-center items-center h-[80vh]">
            <div className="absolute inset-0 z-40 bg-black bg-opacity-30"></div>
            <div className="z-50">
              <p className="lg:text-5xl text-center text-3xl  font-serif font-bold">
                Grow a Stronger, Smarter <br /> Business at Every Stage.
              </p>
            </div>
          </div>
        </div>

        <div className="slide2 flex flex-col justify-center relative z-30 items-center">
          <div className="flex relative flex-col font-serif px-5 lg:px-[20%] gap-6 text-center justify-center items-center h-[80vh]">
            <div className="absolute inset-0 z-40 bg-black bg-opacity-30"></div>

            <div className="z-50">
              <p className="lg:text-5xl text-4xl font-serif font-bold text-white">
                Connect
              </p>
              <p className="lg:text-2xl text-lg lg:mt-5 mt-3 text-white">
                We empower SMEs and startups by enabling them to become
                fundable, evaluate their company with precision, and generate
                actionable insights that drive success.
              </p>
            </div>
          </div>
        </div>
        <div className="slide3 flex flex-col justify-center relative z-30 items-center ">
          <div className="flex flex-col font-serif px-5 lg:px-[20%] gap-6  text-center justify-center items-center h-[80vh]">
            <div className="absolute inset-0 z-40 bg-black bg-opacity-30"></div>

            <div className="z-50">
              <p className="lg:text-5xl text-4xl font-serif font-bold text-white">Grow</p>
              <p className="lg:text-2xl text-lg lg:mt-5 mt-3 text-white">
                We empower SMEs and startups by enabling them to become
                fundable, evaluate their company with precision, and generate
                actionable insights that drive success.
              </p>
            </div>
          </div>
        </div>
        <div className="slide4 flex flex-col justify-center relative z-30 items-center ">
          <div className="flex flex-col font-serif px-5 lg:px-[20%] gap-6  text-center justify-center items-center h-[80vh]">
            <div className="absolute inset-0 z-40 bg-black bg-opacity-30"></div>

            <div className="z-50">
              <p className="lg:text-5xl text-4xl font-serif font-bold text-white">Suceed</p>
              <p className="lg:text-2xl text-lg lg:mt-5 mt-3 text-white">
                We empower SMEs and startups by enabling them to become
                fundable, evaluate their company with precision, and generate
                actionable insights that drive success.
              </p>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}
