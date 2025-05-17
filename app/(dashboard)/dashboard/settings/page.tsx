"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { changePassword } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import { changePasswordPayload } from "@/app/type";
import TextInput from "@/app/components/dashboard/TextInput";
import Modal from "@/app/components/common/Modal";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import Loading from "@/app/loading";
import { useUser } from "@/app/components/layouts/UserContext";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [formValues, setFormValues] = useState<changePasswordPayload | null>(null);
  const [error, setError] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
  });
  
  const router = useRouter();
  const {user} = useUser();
  const userEmail = user?.email;
  const token = localStorage.getItem("token")

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

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
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

    // Clear any previous errors
    setError("");
    
    // Store values and show confirmation modal
    setFormValues({
      email: userEmail || "",
      newPassword: values.newPassword
    });
    setConfirmModalOpen(true);
  };

  const confirmChangePassword = async () => {
    if (!formValues) return;
    
    try {
      setLoading(true);
      setConfirmModalOpen(false);
      const response = await changePassword(formValues, token || "");

      if (!response) {
        console.log("No response from server");
        return;
      }
      if (!response.ok) {
        const data = await response.json();
        setModalMessage(data.error);
        setModalOpen(true);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setModalMessage(data.message || "Password changed successfully!");
        setModalOpen(true);
        router.push("/login");
        setTimeout(() => {
          setModalOpen(false);
        }, 3000);
      }
    } catch {
      setModalMessage("An error occurred");
      setModalOpen(true);
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
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <div className="my-12 px-5 lg:w-[40%] mx-auto">
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
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
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="New password"
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

            <div className="lg:my-0 mt-6 mb-5">
              <TextInput
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
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
              <div className="text-red-500 text-left italic text-sm mb-2">
                {error}
              </div>
            )}
          
            <button
              type="submit"
              className="mt-2 py-2 px-5 bg-mainGreen text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Change Password"}
            </button>
          </Form>
        )}
      </Formik>
      
      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <Modal>
          <div className="p-8 bg-black text-white rounded-lg shadow-md relative">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setConfirmModalOpen(false)}
              aria-label="Close modal"
            >
              <AiOutlineClose size={20} />
            </button>

            <div className="text-center">
              <AiOutlineInfoCircle
                size={40}
                className="mx-auto text-mainGreen mb-4"
              />
              <p className="text-sm text-gray-300 mb-6">Do you want to change your password?</p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded shadow hover:bg-gray-700 focus:outline-none"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 text-sm font-medium text-white bg-mainGreen rounded shadow hover:bg-green-600 focus:outline-none"
                onClick={confirmChangePassword}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Result Modal */}
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
              <AiOutlineInfoCircle
                size={40}
                className="mx-auto text-mainGreen mb-4"
              />
              <p className="text-sm text-gray-300 mb-6">{modalMessage}</p>
            </div>

            <div className="flex justify-center">
              <button
                className="px-6 py-2 text-sm font-medium text-white bg-mainGreen rounded shadow hover:bg-green-600 focus:outline-none"
                onClick={() => setModalOpen(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </Modal>
      )}
      {loading && <Loading text="Changing password"/>}
    </div>
  );
}