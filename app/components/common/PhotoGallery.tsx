"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

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
    <div className="flex justify-center items-center gap-2 p-10">
      {photos.map((photo, index) => (
        <motion.div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-100"
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          animate={{
            flex: hoveredIndex === index ? 3 : 1, // Expand hovered item
          }}
          style={{
            height: "400px", // Set a fixed height for each photo container
          }}
        >
          <img
            src={photo.src}
            alt={photo.label}
            className="w-full h-full object-cover"
          />
          {hoveredIndex === index && (
            <div className="absolute inset-0 flex flex-col justify-center items-start bg-black bg-opacity-60 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{photo.label}</h3>
              {photo.description && (
                <p className="text-sm">{photo.description}</p>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const Photos: React.FC = () => {
  const photos: Photo[] = [
    {
      src: "/assets/grid-1.png",
      label: "Fundability Test",
      description: "Description for Fundability Test",
    },
    {
      src: "/assets/grid-1.png",
      label: "Valuation",
      description:
        "Are you curious about the true value of your business? Our valuation process is tailored to your specific industry and business model.",
    },
    {
      src: "/assets/grid-1.png",
      label: "Business Acceleration",
      description: "Description for Business Acceleration",
    },
    {
      src: "/assets/grid-1.png",
      label: "Deal Room",
      description: "Description for Deal Room",
    },
  ];

  return <PhotoGallery photos={photos} />;
};

export default Photos;
