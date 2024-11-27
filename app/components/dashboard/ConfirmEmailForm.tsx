"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { confirmEmail } from "@/app/services/auth";
import { emailPayload } from "@/app/type";
import Loading from "@/app/loading";

const ConfirmEmailForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);
  }, []);

  const handleSubmit = async (values: { otp: string }) => {
    try {
      setLoading(true);

      if (!email) {
        alert("Email not found. Please sign up again.");
        return;
      }

      // Prepare the payload
      const payload: emailPayload = {
        email:email,
        code: values.otp,
      };
      const response = await confirmEmail(payload);

      if (response) {
        alert("Email confirmed successfully!");
        router.push("/login"); // Redirect after successful confirmation
      }
    } catch (error: any) {
      alert(error.message || "Failed to confirm email. Please try again.");
    } finally {
      setLoading(false);
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
      <div className="my-10 lg:my-7 flex flex-col justify-center">
       
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form>
                <div className="px-5 lg:px-[15%]">
                  <p className="mb-4">
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
                  <button
                    type="submit"
                    className="mt-4 py-2 px-5 bg-mainGreen text-white rounded hover:bg-green-700"
                  >
                    Confirm Email
                  </button>
                </div>
              </Form>
            )}
          </Formik>

      </div>
    </div>
  );
};

export default ConfirmEmailForm;
