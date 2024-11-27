"use client";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { signup } from "@/app/services/auth";
import { signUpPayload } from "@/app/type";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()


  const handleSubmit = async (values: signUpPayload) => {
    try {
      setLoading(true);
      const response = await signup(values);

      if (!response) {
        throw new Error("No response received from the server");
      }
     if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Signup failed.");
    }

      if (response.ok) {
        localStorage.setItem("userEmail", values.email);
        router.push("/confirm-email");
      }
    } catch (error:any) {
      alert(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };


  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    companyName: Yup.string().required("companyName is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  if (loading) {
    return <Loading text={'Creating Account'} />;
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
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="grid lg:grid-cols-2 px-5 lg:px-[15%] gap-4 lg:gap-7">
                <div className="col-span-1">
                  <TextInput
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName ? errors.firstName : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label="Last Name"
                    name="lastName"
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
                    label="Email"
                    name="email"
                    type="email"
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
                    label="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : undefined}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
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
              <button
                type="submit"
className="mt-4 py-2 px-5 bg-mainGreen text-white rounded hover:bg-green-700"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpForm;
