import React from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div><Navbar/>{children}<Footer/></div>;
}
