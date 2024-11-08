"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState } from "react";
import Slider from "react-slick";
import Card from "./Card";


export default function TeamsMobile() {
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
    <div className="bg-white py-16 px-6 lg:px-[10%]">
      <p className="text-4xl text-black pb-8 font-serif font-semibold text-center lg:text-left">
        Our Visionaries
      </p>
      <Slider {...settings}>
        <Card image={'/assets/team1.png'} title={'Founder'} name={'Gboyega Fred'} />
        <Card image={'/assets/team2.png'} title={'Co-Founder'} name={'Ade Williams'} />
        <Card image={'/assets/team3.png'} title={'CTO'} name={'Ifeoluwa Johnson'} />
      </Slider>
    </div>
  );
}
