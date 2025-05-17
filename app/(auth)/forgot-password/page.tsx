"use client";

import Navbar from "@/app/components/common/Navbar";
import ForgotPasswordForm from "@/app/components/common/ForgotPassword";
import React from "react";

export default function ForgotPasswordPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}