"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
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
    <div className="lg:px-[5%] px-5 pt-5 pb-16 lg:py-16">
      <Slider {...settings}>
        <Image
          src={"/assets/slide1.png"}
          width={1000}
          height={500}
          alt="slide-1"
        />
        <Image
          src={"/assets/slide2.png"}
          width={1000}
          height={500}
          alt="slide-2"
        />
        <Image
          src={"/assets/slide3.png"}
          width={1000}
          height={500}
          alt="slide-3"
        />
        <Image
          src={"/assets/slide4.png"}
          width={1000}
          height={500}
          alt="slide-4"
        />
      </Slider>
    </div>
  );
}
