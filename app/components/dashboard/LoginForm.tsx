"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { login } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import { loginpayload } from "@/app/type";
import TextInput from "@/app/components/dashboard/TextInput";
import Modal from "./Modal";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import Loading from "@/app/loading";

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (values: loginpayload) => {
    try {
      setLoading(true);
      const response = await login(values);

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("publicId", data.user.publicId);
        setModalMessage(data.message || "Login successful!");
        setModalOpen(true);
        router.push("/dashboard");
        setTimeout(() => {
          setModalOpen(false);
        }, 3000);
      }
    } catch {
      setModalMessage("An error occured");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="my-12 px-5 lg:w-[40%]">
      <Formik
        initialValues={{ email: "", password: "" }}
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
              label="Enter your email address *"
              name="email"
              type="text"
              placeholder="example@gmail.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
            />
            <p className="text-mainGreen text-right text-sm">
              Forgot Password?
            </p>
            <button
              type="submit"
              className="mt-2 py-2 px-5 bg-mainGreen text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
      <p className="mt-5 font-serif">
        Want to become a Tribe member?{" "}
        <Link href="/signup" className="text-mainGreen underline">
          Sign up
        </Link>
      </p>

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
                className="mx-auto text-mainGreen mb-4"
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
      {loading && <Loading text="Logging in"/>}
    </div>
  );
}
