"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextInput from "@/app/components/dashboard/TextInput";
import Modal from "@/app/components/common/Modal";
import { AiOutlineClose, AiOutlineInfoCircle, AiOutlineLock } from "react-icons/ai";
import Loading from "@/app/loading";
import { FaCheck, FaTimes } from "react-icons/fa";
import { resetPassword } from "@/app/services/auth";

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
  });
  
  const router = useRouter();
  
  // Get email from localStorage if available (passed from forgot password page)
  const [email, setEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userEmail') || '';
    }
    return '';
  });

  // Password validation functions
  const hasMinLength = (password: string) => password.length >= 8;
  const hasUppercase = (password: string) => /[A-Z]/.test(password);
  const hasLowercase = (password: string) => /[a-z]/.test(password);
  const hasSpecialChar = (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const validatePassword = (password: string) => {
    const strength = {
      length: hasMinLength(password),
      uppercase: hasUppercase(password),
      lowercase: hasLowercase(password),
      special: hasSpecialChar(password)
    };
    setPasswordStrength(strength);
    return strength.length && strength.uppercase && strength.lowercase && strength.special;
  };


  

  const handleSubmit = async (values: { email: string; otp: string; newPassword: string; confirmPassword: string }) => {
    // Validate password
    if (!validatePassword(values.newPassword)) {
      setError("Password does not meet all requirements.");
      return;
    }

    // Confirm passwords match
    if (values.newPassword !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await resetPassword({
        email: values.email || email, // Use form value or stored email
        otp: values.otp,
        newPassword: values.newPassword
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || data.message || "Failed to reset password. Please try again.");
        return;
      }

      const data = await response.json();
      setModalOpen(true);
      
      // Clear stored email after successful reset
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmail');
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Password requirement indicator component
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <FaCheck className="text-green-500" />
      ) : (
        <FaTimes className="text-red-500" />
      )}
      <span className={met ? "text-green-500" : "text-gray-400"}>{text}</span>
    </div>
  );

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^[0-9]+$/, "OTP must contain only numbers"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <div className="my-12 px-5 lg:w-[40%] mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
        <p className="text-gray-400">
          Enter the OTP code sent to your email and create a new password.
        </p>
      </div>
      
      <Formik
        initialValues={{ email: email, otp: "", newPassword: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
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
              placeholder="Enter your email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
             
            />
            
            <div className="mt-4">
              <TextInput
                label="OTP Code"
                name="otp"
                type="text"
                placeholder="Enter the code sent to your email"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.otp ? errors.otp : undefined}
              />
            </div>
            
            <div className="mt-4">
              <TextInput
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="Create a new password"
                value={values.newPassword}
                onChange={(e) => {
                  handleChange(e);
                  validatePassword(e.target.value);
                }}
                onBlur={handleBlur}
                error={touched.newPassword ? errors.newPassword : undefined}
              />
              
              {/* Password requirements */}
              <div className="mt-2 bg-zinc-900 p-3 rounded">
                <div className="grid grid-cols-2 gap-2">
                  <PasswordRequirement met={passwordStrength.length} text="At least 8 characters" />
                  <PasswordRequirement met={passwordStrength.uppercase} text="One uppercase letter" />
                  <PasswordRequirement met={passwordStrength.lowercase} text="One lowercase letter" />
                  <PasswordRequirement met={passwordStrength.special} text="One special character" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <TextInput
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />
              {values.confirmPassword && values.newPassword !== values.confirmPassword && (
                <div className="mt-1 text-red-500 text-sm">Passwords do not match</div>
              )}
            </div>
            
            {error && (
              <div className="text-red-500 text-left italic text-sm my-2">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="mt-6 py-2 px-5 bg-mainGreen text-white rounded"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? "Resetting..." : "Reset Password"}
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
              <AiOutlineLock
                size={50}
                className="mx-auto text-mainGreen mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Password Reset Successful!</h3>
              <p className="text-sm text-gray-300 mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>

            <div className="flex justify-center">
              <Link href="/login">
                <button
                  className="px-6 py-2 text-sm font-medium text-white bg-mainGreen rounded shadow hover:bg-green-600 focus:outline-none"
                >
                  Go to Login
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
      
      {loading && <Loading text="Resetting password" />}
    </div>
  );
}