"use client";

import TextInput from "@/app/components/dashboard/TextInput";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "@/app/loading";
import Link from "next/link";
import { login } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import { loginpayload } from "@/app/type";

export default function LoginForm() {
  const [loading,setLoading]= useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: loginpayload) => {
    try {
      setLoading(true);
      const response = await login(values);
      const data = await response.json(); // Parse the response body once
  
      if (!response.ok) {
        // Handle the error based on the response data
        const data = await response.json();
        alert(data.message);
        return; // Exit the function early if there's an error
      }
  
      // Save the token to localStorage and navigate to the dashboard
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (error: any) {
      // Catch any unexpected errors
      alert(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Validation schema for form fields
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
            <Form className="flex flex-col gap-4 justify-center">
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
              <p className="text-mainGreen text-right text-sm">Forgot Password?</p>
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
    </div>
  );
}
