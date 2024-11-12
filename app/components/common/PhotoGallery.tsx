"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import Button from "./Button";

type Photo = {
  src: string;
  label: string;
  description?: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex lg:flex-row pb-12 px-[7%]">
      {photos.map((photo, index) => (
        <motion.div
          key={index}
          className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-100"
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          animate={{
            flex: hoveredIndex === index ? 3 : 1, // Expand hovered item
          }}
          style={{
            height: "400px", // Set a fixed height for each photo container
          }}
        >
          {/* Apply conditional clip-path for inner images */}
          <div
            className="relative px-0 w-full h-full"
            style={{
              clipPath:
                index === 0
                  ? "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)" // Straight left edge for the first item
                  : index === photos.length - 1
                  ? "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)" // Straight right edge for the last item
                  : "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)", // Tilted inner edges
            }}
          >
            <Image
              src={photo.src}
              alt={photo.label}
              width={500}
              height={500}
              className="w-full h-full object-cover"
            />
            {/* Label always visible */}
            {hoveredIndex !== index &&  ( <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-white font-bold text-lg">{photo.label}</h3>
            </div>)}
           

            {/* Description shown on hover */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 flex flex-col items-start bg-black bg-opacity-60 px-16 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 mt-12">{photo.label}</h3>
                {photo.description && (
                  <p className="text-sm mb-12">{photo.description}</p>
                )}
                <Button link={'/'} text={'Get Started'}/>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};


export const photos: Photo[] = [
  {
    src: "/assets/fundability.png",
    label: "Fundability Test",
    description: "Discover if your Business is ready for funding with our comprehensive assessment. Let’s get you to the next level",
  },
  {
    src: "/assets/valuation3.png",
    label: "Valuation",
    description:
      "Are you curious about the true value of your business? Do you want to make informed decisions about growth, acquisitions, or investments? Our valuation process is tailored to your specific industry and business model",
  },
  {
    src: "/assets/business-accelerator.png",
    label: "Business Acceleration",
    description: "Join our Tribe and get connected to our accelerators to drive your growth and 10x your business potential",
  },
  {
    src: "/assets/deal-room.png",
    label: "Deal Room",
    description: "Connect with thousands of investors near you, and secure funding for your business",
  },
];

export const photosMobile: Photo[] = [
  {
    src: "/assets/fundability-mobile.jpg",
    label: "Fundability Test",
    description: "Discover if your Business is ready for funding with our comprehensive assessment. Let’s get you to the next level",
  },
  {
    src: "/assets/valuation3.png",
    label: "Valuation",
    description:
      "Are you curious about the true value of your business? Do you want to make informed decisions about growth, acquisitions, or investments? Our valuation process is tailored to your specific industry and business model",
  },
  {
    src: "/assets/chart-mobile.png",
    label: "Business Acceleration",
    description: "Join our Tribe and get connected to our accelerators to drive your growth and 10x your business potential",
  },
  {
    src: "/assets/shake-mobile.png",
    label: "Deal Room",
    description: "Connect with thousands of investors near you, and secure funding for your business",
  },
];

const Photos: React.FC = () => {
  

  return <PhotoGallery photos={photos} />;
};

export default Photos;
