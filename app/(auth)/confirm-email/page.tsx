"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/components/dashboard/TextInput";
import { confirmEmail, resendEmail } from "@/app/services/auth";
import { emailPayload } from "@/app/type";
import Loading from "@/app/loading";
import Modal from "@/app/components/dashboard/Modal";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import Navbar from "@/app/components/common/Navbar";

// Define the resendPayload type
interface resendPayload {
  email: string;
}

const ConfirmEmailForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);
  }, []);

  const showModal = (message: string, success: boolean = false) => {
    setModalMessage(message);
    setIsSuccess(success);
    setModalOpen(true);
    
    if (success) {
      // Auto-close modal and redirect after successful confirmation
      setTimeout(() => {
        setModalOpen(false);
        if (message.includes("confirmed successfully")) {
          router.push("/login");
        }
      }, 3000);
    }
  };

  const handleSubmit = async (values: { otp: string }) => {
    try {
      setLoading(true);

      if (!email) {
        showModal("Email not found. Please sign up again.");
        return;
      }

      // Prepare the payload
      const payload: emailPayload = {
        email: email,
        code: values.otp,
      };
      const response = await confirmEmail(payload);

      if (response) {
        showModal("Email confirmed successfully!", true);
      }
    } catch {
      showModal("Failed to confirm email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setResending(true);

      if (!email) {
        showModal("Email not found. Please sign up again.");
        return;
      }

      // Prepare the payload for resending
      const payload: resendPayload = {
        email: email,
      };
      
      const response = await resendEmail(payload);

      if (response) {
        showModal("Verification code has been resent to your email!", true);
      }
    } catch {
      showModal("Failed to resend verification code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  });

  if (loading) {
    return <Loading text={"Confirming Email"} />;
  }

  return (
    <div className="w-full">
       <Navbar />
          <div className="text-center flex flex-col items-center justify-center">
            <p className="font-semibold text-3xl font-serif">Become a Triber</p>
            <p className="font-serif">Get started by signing up</p></div>
      <div className="my-10 lg:my-7 flex flex-col justify-center">
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="px-5 lg:px-[15%]">
                <p className="mb-4 text-center">
                  A confirmation code was sent to <strong>{email}</strong>.
                  Enter the code below to confirm your email.
                </p>
                <TextInput
                  label="OTP Code"
                  name="otp"
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.otp ? errors.otp : undefined}
                />
                <div className="flex flex-col justify-center sm:flex-row sm:items-center gap-3 mt-4">
                  <button
                    type="submit"
                    className="py-2 px-5 bg-mainGreen text-white rounded hover:bg-green-700"
                  >
                    Confirm Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="py-2 px-5 text-mainGreen border border-mainGreen disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend verification code"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {modalOpen && (
        <Modal>
          <div className="p-8 bg-black text-white rounded-lg shadow-md relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              <AiOutlineClose size={20} />
            </button>

            {/* Icon and Heading */}
            <div className="text-center">
              <AiOutlineInfoCircle
                size={40}
                className={`mx-auto ${isSuccess ? "text-mainGreen" : "text-red-500"} mb-4`}
              />
              <p className="text-sm text-gray-300 mb-6">{modalMessage}</p>
            </div>

            {/* Action Buttons */}
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

      {resending && <Loading text="Resending code" />}
    </div>
  );
};

export default ConfirmEmailForm;