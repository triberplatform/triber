import LandingLayout from "@/app/components/layouts/landingLayout";
import React from "react";
import Hero from "./components/Hero";
import OpenRoles from "./components/OpenRoles";
import Advance from "./components/Advance";

export default function page() {
  return (
    <LandingLayout>
      <Hero />
      <OpenRoles/>
      <Advance/>
    </LandingLayout>
  );
}
