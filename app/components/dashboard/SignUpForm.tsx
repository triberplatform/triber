"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { signup } from "@/app/services/auth";
import { signUpPayload } from "@/app/type";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (values: signUpPayload) => {
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions to sign up.");
      return;
    }
    setError(""); // Clear error if checkbox is checked

    try {
      setLoading(true);
      const response = await signup(values);

      if (!response) {
        throw new Error("No response received from the server");
      }
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Signup failed.");
        return;
      }

      if (response.ok) {
        localStorage.setItem("userEmail", values.email);
        router.push("/confirm-email");
      }
    } catch (error: any) {
      alert(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text={"Creating Account"} />;
  }

  return (
    <div className="w-full">
      <div className="my-10 lg:my-7 flex flex-col justify-center">
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
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="grid lg:grid-cols-2 px-5 lg:px-[15%] gap-4 lg:gap-7">
                <div className="col-span-1">
                  <TextInput
                    label="Enter your first name *"
                    name="firstName"
                    placeholder={"John"}
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName ? errors.firstName : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label="Enter your last name *"
                    name="lastName"
                    placeholder={"Doe"}
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName ? errors.lastName : undefined}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 px-5 lg:px-[15%] gap-4 lg:gap-7">
                <div className="col-span-1">
                  <TextInput
                    label="Enter your email address *"
                    name="email"
                    type="email"
                    placeholder={"john.doe@gmail.com"}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email ? errors.email : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label="Company Name"
                    name="companyName"
                    type="text"
                    placeholder={"Doe Ltd."}
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.companyName ? errors.companyName : undefined}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2 px-5 lg:px-[15%] mb-4 gap-4 lg:gap-7">
                <div className="col-span-1">
                  <TextInput
                    label="Create a new password"
                    name="password"
                    type="password"
                    placeholder={"********"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder={"********"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword
                        ? errors.confirmPassword
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="px-5 lg:px-[15%] flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-white cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="text-mainGreen underline">
                    Terms and Conditions
                  </span>{" "}
                  and the{" "}
                  <span className="text-mainGreen underline">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>
              <div className="relative">
                {error && (
                  <div className="text-red-500 text-left px-5 lg:px-[15%] absolute italic text-sm">
                    {error}
                  </div>
                )}
              </div>

              <div className="px-5 lg:px-[15%]">
                <button
                  type="submit"
                  className="mt-4 py-2 px-5 bg-mainGreen text-white rounded hover:bg-green-700"
                >
                  Sign Up
                </button>

                <p className="mt-4 text-sm">Already a triber? <Link href={"/login"}><span className="underline text-mainGreen">Log In</span></Link> </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpForm;
