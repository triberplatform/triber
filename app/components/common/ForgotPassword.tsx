"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { forgotPassword } from "@/app/services/auth";
import TextInput from "@/app/components/dashboard/TextInput";
import Modal from "@/app/components/common/Modal";
import { AiOutlineClose, AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";
import Loading from "@/app/loading";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (values: { email: string }) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await forgotPassword(values.email);

      if (!response) {
        console.log("No response from server");
        setError("No response received from the server. Please try again later.");
        return;
      }
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || data.message || "An error occurred. Please try again.");
        return;
      }

      if (response.ok) {
        setEmail(values.email);
        setModalOpen(true);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  return (
    <div className="my-12 px-5 lg:w-[40%] mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Forgot Your Password?</h1>
        <p className="text-gray-400">
          Enter your email address and we'll send you a code to reset your password.
        </p>
      </div>
      
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
        }) => (
          <Form className="flex flex-col justify-center">
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="youremail@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
            />
            
            {error && (
              <div className="text-red-500 text-left italic text-sm my-2">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="mt-4 py-2 px-5 bg-mainGreen text-white rounded"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-mainGreen hover:underline">
                Return to Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      {modalOpen && (
        <Modal>
          <div className="p-8 bg-black text-white rounded-lg shadow-md relative">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              <AiOutlineClose size={20} />
            </button>

            <div className="text-center">
              <AiOutlineMail
                size={50}
                className="mx-auto text-mainGreen mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-300 mb-6">
                We've sent a password reset code to <span className="font-bold">{email}</span>. 
                Please check your inbox and spam folder.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Enter the OTP code on the next page to complete the password reset process.
              </p>
            </div>

            <div className="flex justify-center">
              <Link href="/reset-password">
                <button
                  className="px-6 py-2 text-sm font-medium text-white bg-mainGreen rounded shadow hover:bg-green-600 focus:outline-none"
                >
                  Enter OTP Code
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
      
      {loading && <Loading text="Sending reset link" />}
    </div>
  );
}