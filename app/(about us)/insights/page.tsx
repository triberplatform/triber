import LandingLayout from "@/app/components/layouts/landingLayout";
import React from "react";
import Hero from "./components/Hero";
import ImageGrid from "./components/ImageGrid";
import Photos from "@/app/components/common/PhotoGallery";
import PhotoGalleryMobile from "@/app/components/common/PhotoGalleryMobile";

export default function page() {
  return (
    <LandingLayout>
      <Hero />
      <div className="hidden lg:block">
        <Photos />
      </div>
      <div className="lg:hidden">
        <PhotoGalleryMobile />
      </div>
      <ImageGrid />
    </LandingLayout>
  );
}
