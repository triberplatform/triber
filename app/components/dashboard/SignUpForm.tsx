"use client";

import React from "react";
import TextInput from "./TextInput";
import { Form, Formik } from "formik";
import Link from "next/link";

export default function SignUpForm() {
  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
  }) => {
    console.log(values);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a delay
  };

  return (
    <div className="w-full">
      <div className="my-10 lg:my-7  flex flex-col justify-center ">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            companyName: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className=" grid lg:grid-cols-2 px-5 lg:px-[15%] mb-4 gap-4 lg:gap-7">
              <div className="col-span-1">
                <TextInput
                  label={"Enter your first name"}
                  name={"firstName"}
                  placeholder={"John"}
                  type={"text"}
                />
              </div>
              <div className="col-span-1">
                <TextInput
                  label={"Enter your last name"}
                  name={"lastName"}
                  placeholder={"Doe"}
                  type={"text"}
                />
              </div>
            </div>
            <div className=" grid lg:grid-cols-2 px-5 lg:px-[15%] mb-4 gap-4 lg:gap-7">
              <div className="col-span-1">
                <TextInput
                  label={"Enter your email address *"}
                  name={"email"}
                  placeholder={"example@gmail.com"}
                  type={"text"}
                />
              </div>
              <div className="col-span-1">
                <TextInput
                  label={"Enter your company registered name *"}
                  name={"companyName"}
                  placeholder={"LTD company Name"}
                  type={"text"}
                />
              </div>
            </div>
            <div className=" grid lg:grid-cols-2 px-5 lg:px-[15%] mb-4 gap-4 lg:gap-7">
              <div className="col-span-1">
                <TextInput
                  label={"Create a new password"}
                  name={"password"}
                  placeholder={"password"}
                  type={"password"}
                />
              </div>
              <div className="col-span-1">
                <TextInput
                  label={"Confirm password"}
                  name={"confirmPassword"}
                  placeholder={"confirm password"}
                  type={"password"}
                />
              </div>
              <span className=" text-left text-sm text-nowrap -mt-5 flex item-center">
            <input type="checkbox" id="terms" name="terms" className="mr-2" />
              I agree to the{" "}
              <span
                className="font-semibold hover:underline"
              >
                Terms of Service
              </span>
              ,{" "}
              <span
                className="font-semibold hover:underline"
              >
                General Terms and Conditions
              </span>
              , and{" "}
              <span
                className="font-semibold hover:underline"
              >
                Privacy Policy
              </span>
              
            </span>
            </div>
         
            <button
              type="submit"
              className="mt-2 py-2 px-5 bg-mainGreen text-white rounded"
            >
              {" "}
              Submit
            </button>
          </Form>
        </Formik>
      </div>
      <p className="font-serif mb-5">
        Already a Triber?{" "}
        <Link href={"/login"} className="text-mainGreen underline ">
          Login
        </Link>{" "}
      </p>
    </div>
  );
}
