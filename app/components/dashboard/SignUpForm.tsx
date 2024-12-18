"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { signup } from "@/app/services/auth";
import { signUpPayload } from "@/app/type";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "./Modal";
import Loading from "@/app/loading";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";

const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
        const data = await response.json();
        setModalMessage(data.error);
        setModalOpen(true);
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

                <p className="mt-4 text-sm">
                  Already a triber?{" "}
                  <Link href={"/login"}>
                    <span className="underline text-mainGreen">Log In</span>
                  </Link>{" "}
                </p>
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
      {loading && <Loading text="signing up" />}
    </div>
  );
};

export default SignUpForm;
