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
import { FaCheck, FaTimes } from "react-icons/fa";

const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
  });

  const router = useRouter();

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

  const handleSubmit = async (values: signUpPayload) => {
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions to sign up.");
      return;
    }
    setError(""); // Clear error if checkbox is checked

    // Validate password
    if (!validatePassword(values.password)) {
      setError("Password does not meet all requirements.");
      return;
    }

    // Confirm passwords match
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
    } catch {
      alert("An unexpected error occurred.");
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
                    onChange={(e) => {
                      handleChange(e);
                      validatePassword(e.target.value);
                    }}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : undefined}
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
                  {values.confirmPassword && values.password !== values.confirmPassword && (
                    <div className="mt-1 text-red-500 text-sm">Passwords do not match</div>
                  )}
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