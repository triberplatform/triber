"use client";
import React from 'react';
import { photosMobile } from './PhotoGallery';
import Link from 'next/link';

export default function PhotoGalleryMobile() {
  return (
    <div className="py-12 px-5">
      <div className="flex flex-col gap-5">
        {photosMobile.map((photo, index) => (
          <div
            key={index}
            className="w-full h-80 flex flex-col justify-center items-center gap-4 p-6 rounded-lg text-white"
            style={{
              backgroundImage: `url(${photo.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="bg-black bg-opacity-60 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{photo.label}</h3>
              {photo.description && (
                <p className="text-sm">{photo.description}</p>
              )}
            </div>
            <Link className={`button bg-mainGreen px-7 py-3 w-32  rounded text-sm hover:bg-green-700`} href={'/'}>
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
