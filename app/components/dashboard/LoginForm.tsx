"use client";

import TextInput from "@/app/components/dashboard/TextInput";
import React, { Suspense } from "react";
import { Formik, Form } from "formik";
import Loading from "@/app/loading";
import Link from "next/link";

export default function LoginForm() {
  const  handleSubmit = async (values: { email: string; password: string }) => {
    console.log(values);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay
  };

  return (
    <div className="my-12 px-5 lg:w-[40%]">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) =>
          isSubmitting ? (

            <Loading text={'Logging In'}/>
          ) : (
            <Form className="flex flex-col gap-4 justify-center">
              <TextInput
                label={"Enter your email address *"}
                name={"email"}
                placeholder={"example@gmail.com"}
                type={"text"}
              />
              <TextInput
                label={"Password"}
                name={"password"}
                placeholder={"password"}
                type={"password"}
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
      <p className="mt-5 font-serif">Want to become a Tribe member? <Link href={'/signup'} className="text-mainGreen underline ">Sign up</Link> </p>
    </div>
  );
}
