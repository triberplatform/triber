"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "@/app/loading";
import Link from "next/link";
import { login } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import { loginpayload } from "@/app/type";
import TextInput from "@/app/components/dashboard/TextInput";
import Modal from "./Modal";


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
        setModalMessage(data.error)
        setModalOpen(true);
        return; 
      }

      if (response.ok){
        const data = await response.json(); 
        localStorage.setItem("token", data.token);
        setModalMessage(data.message || "Login successful!");
        setModalOpen(true);
        router.push("/dashboard");
        setTimeout(() => {
          setModalOpen(false);
        }, 3000);
      }
  
     
    } catch (error: any) {
      setModalMessage(error.message || "An unexpected error occurred.");
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

  if (loading) {
    return <Loading text={"Logging in..."} />;
  }

  return (
    <div className="my-12 px-5 lg:w-[40%]">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched, handleChange, handleBlur }) =>
          isSubmitting ? (
            <Loading text="Logging In" />
          ) : (
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
          )
        }
      </Formik>
      <p className="mt-5 font-serif">
        Want to become a Tribe member?{" "}
        <Link href="/signup" className="text-mainGreen underline">
          Sign up
        </Link>
      </p>

      {/* Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Login Status"
        message={modalMessage}
      />
    </div>
  );
}
