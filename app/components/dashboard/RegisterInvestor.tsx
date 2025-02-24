"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import OptionInput from "./OptionInput";
import { registerInvestor } from "@/app/services/dashboard";
import { InvestorProfilePayload } from "@/app/type";
import Modal from "./Modal";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import DocumentUpload from "./DocumentUpload";
import ArrayInput from "./ArrayInput";

export default function RegisterInvestor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .required("Business Phone is required")
      .matches(/^\+234\d{10}$/, "Must be a valid phone number"),
    companyName: Yup.string().required("Company name is required"),
    about: Yup.string().required("About is required"),
    companyWebsiteUrl: Yup.string().required("Website URL is required"),
    companyType: Yup.string().required("Company type is required"),
    location: Yup.string().required("Location is required"),
    interestedLocations: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one location"),
    designation: Yup.string().required("Designation is required"),
    numOfExpectedDeals: Yup.string().required("Expected deals is required"),
    fundsUnderManagement: Yup.string().required(
      "Funds under management is required"
    ),
    interestedFactors: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one factor"),
    termsOfAgreement: Yup.mixed().required(
      "Terms agreement document is required"
    ),
    proofOfBusiness: Yup.mixed().required("Business proof is required"),
    logo: Yup.mixed()
      .nullable()
      .test("fileType", "Only JPG/PNG allowed", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(
          (value as File).type
        );
      }),
  });

  const initialValues = {
    email: "",
    companyName: "",
    phoneNumber: "+234",
    about: "",
    companyWebsiteUrl: "",
    companyType: "",
    location: "",
    interestedLocations: [""],
    designation: "",
    numOfExpectedDeals: "",
    fundsUnderManagement: "",
    interestedFactors: [""],
    termsOfAgreement: null as File | null,
    proofOfBusiness: null as File | null,
    logo: null as File | null,
  };
  const handleRefreshRedirect = () => {
    window.location.href = "/dashboard"; // Replace with the desired path
  };

  const handleNext = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: InvestorProfilePayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await registerInvestor(values, token ?? "");

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        showModal(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (
    formikProps: FormikProps<InvestorProfilePayload>
  ) => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid lg:grid-cols-2 lg:bg-mainBlack gap-5 pb-12 lg:pb-32 py-8 lg:px-5">
            <FormInput
              label="Email"
              name="email"
              placeholder="Enter Email Address"
              value={formikProps.values.email}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.email}
              touched={formikProps.touched.email}
            />
            <FormInput
              label="Company Name"
              name="companyName"
              placeholder="e.g Abc Limited"
              value={formikProps.values.companyName}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.companyName}
              touched={formikProps.touched.companyName}
            />
            <FormInput
              label="About"
              name="about"
              placeholder="About the company"
              value={formikProps.values.about}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.about}
              touched={formikProps.touched.about}
            />
            <FormInput
              label="Company Website"
              name="companyWebsiteUrl"
              placeholder="company.com"
              value={formikProps.values.companyWebsiteUrl}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.companyWebsiteUrl}
              touched={formikProps.touched.companyWebsiteUrl}
            />
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              placeholder="+2348000000000"
              value={formikProps.values.phoneNumber}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.phoneNumber}
              touched={formikProps.touched.phoneNumber}
            />
          </div>
        );

      case 1:
        return (
          <div className="grid lg:grid-cols-2 lg:bg-mainBlack gap-5 py-8 lg:px-5">
            {/* Left Column */}
            <div className="space-y-5 ">
              <OptionInput
                label="Company Type"
                name="companyType"
                options={[
                  { value: "PRIVATE_EQUITY", label: "Private Equity" },
                  { value: "VENTURE_CAPITAL", label: "Venture Capital" },
                  { value: "BANK", label: "Bank" },
                  {
                    value: "INSTITUTIONAL_INVESTOR",
                    label: "Institutional Investor",
                  },
                  { value: "PRIVATE_INVESTOR", label: "Private Investor" },
                  { value: "OTHER", label: "Others" },
                ]}
                value={formikProps.values.companyType}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyType}
                touched={formikProps.touched.companyType}
              />

              <FormInput
                label="Company Location"
                name="location"
                placeholder="e.g.,Lagos, Nigeria"
                value={formikProps.values.location}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.location}
                touched={formikProps.touched.location}
              />

              <FormInput
                label="Funds Under Management"
                name="fundsUnderManagement"
                type="text"
                placeholder="e.g., 50,000,000"
                value={
                  formikProps.values.fundsUnderManagement !== undefined &&
                  formikProps.values.fundsUnderManagement !== null
                    ? formikProps.values.fundsUnderManagement
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                  const numericValue = Number(rawValue); // Convert to number
                  if (!isNaN(numericValue)) {
                    formikProps.setFieldValue(
                      "fundsUnderManagement",
                      numericValue
                    ); // Store numeric value
                  }
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.fundsUnderManagement}
                touched={formikProps.touched.fundsUnderManagement}
              />
              <FormInput
                label="Designation"
                name="designation"
                placeholder="input designation"
                value={formikProps.values.designation}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.designation}
                touched={formikProps.touched.designation}
              />

              <OptionInput
                label="Number of Expected Deals"
                name="numOfExpectedDeals"
                options={[
                  { value: "ONE_TO_THREE", label: "1 - 3" },
                  { value: "FOUR_TO_NINE", label: "4 - 9" },
                  { value: "TEN_TO_FIFTEEN", label: "10 - 15" },
                ]}
                value={formikProps.values.numOfExpectedDeals}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.numOfExpectedDeals}
                touched={formikProps.touched.numOfExpectedDeals}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5 ">
              <ArrayInput
                label="Interested Factors"
                name="interestedFactors"
                values={formikProps.values.interestedFactors}
                onChange={(newValues) =>
                  formikProps.setFieldValue("interestedFactors", newValues)
                }
              />
              <ArrayInput
                label="Interested Locations"
                name="interestedLocations"
                values={formikProps.values.interestedLocations}
                onChange={(newValues) =>
                  formikProps.setFieldValue("interestedLocations", newValues)
                }
              />

              <DocumentUpload
                label="Logo"
                name="logo"
                onChange={(file) => formikProps.setFieldValue("logo", file)}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.logo}
                touched={formikProps.touched.logo}
                accept="application/pdf, image/*"
              />
              <DocumentUpload
                label="Terms of Agreement"
                name="termsOfAgreement"
                onChange={(file) =>
                  formikProps.setFieldValue("termsOfAgreement", file)
                }
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.termsOfAgreement}
                touched={formikProps.touched.termsOfAgreement}
                accept="application/pdf, image/*"
              />
              <DocumentUpload
                label="Proof Of Business"
                name="proofOfBusiness"
                onChange={(file) =>
                  formikProps.setFieldValue("proofOfBusiness", file)
                }
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.proofOfBusiness}
                touched={formikProps.touched.proofOfBusiness}
                accept="application/pdf, image/*"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="col-span-3 map-bg pt-12 pb-8 lg:pb-36">
        <p className="text-3xl mb-4">Register Investor Profile</p>
        <p className="text-sm">
          Information entered here is displayed publicly to match you with the
          right set of investors and buyers. Do not mention business
          name/information which can identify the business.
        </p>
      </div>
      <div className="col-span-8">
        <div className="flex lg:gap-7 justify-between lg:justify-normal">
          <p
            className={`cursor-pointer ${
              currentStep === 0 ? "border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(0)}
          >
            Confidential Information
          </p>
          <p
            className={`cursor-pointer ${
              currentStep === 1 ? " border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(1)}
          >
            Business Information
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(formikProps) => (
            <Form>
              <div>
                {renderStepContent(formikProps)}
                <div className="flex justify-between mt-4">
                  <button
                    className={`px-4 py-2 text-white bg-gray-500 rounded ${
                      currentStep === 0 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  <button
                    className={`px-4 py-2 text-white bg-mainGreen rounded ${
                      currentStep === 2 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default form submission behavior
                      if (currentStep === 1) {
                        if (Object.keys(formikProps.errors).length > 0) {
                          setModalErrors(
                            Object.values(formikProps.errors) as string[]
                          );
                          showErrorModal(true);
                        } else {
                          formikProps.handleSubmit(); // Ensure Formik handles the submit process
                        }
                      } else {
                        handleNext(); // Call handleNext for non-final steps
                      }
                    }}
                    type={currentStep === 1 ? "submit" : "button"}
                  >
                    {currentStep === 1 ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {loading && <Loading text="Registering Profile" />}

      {modal && (
        <Modal>
          {" "}
          <div className="bg-mainBlack p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Submitted!</p>
                <p className="text-sm lg:text-base">
                  Your Investor profile has been successfully submitted. We’re
                  now reviewing your information and verifying your financial
                  records. This process may take up to 48 hours.
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <div className="flex mt-8 gap-6">
              <button
                className="bg-black py-1 px-3 rounded"
                onClick={handleRefreshRedirect}
              >
                View Dashboard
              </button>
            </div>
          </div>
        </Modal>
      )}
      {errorModal && (
        <Modal>
          <div className="p-6 flex flex-col rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.007M21.25 12A9.25 9.25 0 1 1 3.75 12a9.25 9.25 0 0 1 17.5 0z"
                    />
                  </svg>
                </span>
                Missing Required Fields
              </h2>
              <button onClick={() => showErrorModal(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-400 mb-3">
              Please ensure the following fields are filled correctly:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400">
              {modalErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>

            <button
              className="mt-5 px-6 py-2 bg-mainGreen text-white font-medium rounded hover:bg-green-700 transition duration-300"
              onClick={() => showErrorModal(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      {/* <div className="hidden">{modalMessage}</div> */}
    </div>
  );
}
