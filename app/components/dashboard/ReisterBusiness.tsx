"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import OptionInput from "./OptionInput";
import { registerBusiness } from "@/app/services/dashboard";
import { RegisterBusinessPayload } from "@/app/type";
import Modal from "./Modal";
import { FaCheckDouble } from "react-icons/fa";
import Link from "next/link";
import Loading from "@/app/loading";

export default function RegisterBusiness() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  

  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required("Business Name is required"),
    businessPhone: Yup.string()
      .required("Business Phone is required")
      .matches(/^\+234\d{10}$/, "Must be a valid phone number"),
    businessEmail: Yup.string()
      .email("Invalid email address")
      .required("Business Email is required"),
    businessStatus: Yup.string().required("Business Status is required"),
    interestedIn: Yup.string().required("This field is required"),
    industry: Yup.string().required("Industry is required"),
    businessLegalEntity: Yup.string().required("Legal Entity Type is required"),
    description: Yup.string().required("Description is required"),
    reportedSales: Yup.string().required("Reported Sales is required"),
    numOfEmployees: Yup.string().required("Number of Employees is required"),
    yearEstablished: Yup.number()
      .max(new Date().getFullYear(), "Year cannot be in the future")
      .required("Year Established is required"),
    location: Yup.string().required("Location is required"),
    assets: Yup.string().required("Assets description is required"),
  });

  const initialValues = {
    businessName: "",
    businessPhone: "",
    businessEmail: "",
    businessStatus: "",
    interestedIn: "",
    industry: "",
    businessLegalEntity: "",
    description: "",
    reportedSales: "",
    numOfEmployees: "",
    yearEstablished: 0,
    location: "",
    assets: "",
  };
  const handleRefreshRedirect = () => {
    window.location.href = "/dashboard"; // Replace with the desired path
  };
  const handleNext = (isValid: boolean, errors: object) => {
    if (isValid && Object.keys(errors).length === 0 && currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: RegisterBusinessPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await registerBusiness(values, token);

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setModalMessage(data.message);
        showModal(true);
        return;
      }
      if (!response) {
        setModalMessage("An Error Occured try again");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const renderStepContent = (formikProps: FormikProps<RegisterBusinessPayload>) => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 bg-mainBlack gap-5 pb-32 py-8 px-5">
            <FormInput
              label="Business Name"
              name="businessName"
              placeholder="Business Name"
              value={formikProps.values.businessName}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.businessName}
              touched={formikProps.touched.businessName}
            />
            <FormInput
              label="Business Phone Number"
              name="businessPhone"
              placeholder="+2348000000000"
              value={formikProps.values.businessPhone}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.businessPhone}
              touched={formikProps.touched.businessPhone}
            />
            <FormInput
              label="Business Email"
              name="businessEmail"
              placeholder="Business Email"
              value={formikProps.values.businessEmail}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.businessEmail}
              touched={formikProps.touched.businessEmail}
            />
            <OptionInput
              label="Business Status"
              name="businessStatus"
              options={[
                { value: "OWNER", label: "Owner" },
                { value: "MEMBER", label: "Member" },
                { value: "BROKER", label: "Broker" },
              ]}
              value={formikProps.values.businessStatus}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.businessStatus}
              touched={formikProps.touched.businessStatus}
            />
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-2 bg-mainBlack gap-5 py-8 px-5">
            {/* Left Column */}
            <div>
              <OptionInput
                label="You are interested in"
                name="interestedIn"
                options={[
                  {
                    value: "FULL_SALE_OF_BUSINESS",
                    label: "Full Sale of Business",
                  },
                  { value: "PARTIAL_STAKE", label: "Partial Stake" },
                  { value: "LOAN", label: "Loan" },
                  {
                    value: "SELL_OR_LEASE_OF_BUSINESS_ASSETS",
                    label: "Sell or Lease Business Assets",
                  },
                ]}
                value={formikProps.values.interestedIn}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.interestedIn}
                touched={formikProps.touched.interestedIn}
              />
              <OptionInput
                label="Select business industry"
                name="industry"
                options={[
                  { value: "IT", label: "IT" },
                  { value: "FINANCE", label: "Finance" },
                  { value: "HEALTH", label: "Health" },
                  { value: "EDUCATION", label: "Education" },
                  { value: "MEDIA", label: "Media" },
                  { value: "OTHER", label: "Other" },
                ]}
                value={formikProps.values.industry}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.industry}
                touched={formikProps.touched.industry}
              />
              <OptionInput
                label="Select business legal entity type"
                name="businessLegalEntity"
                options={[
                  {
                    value: "PRIVATE_LIABILITY_COMPANY",
                    label: "Private Liability Company",
                  },
                  {
                    value: "LIMITED_LIABILITY_COMPANY",
                    label: "Limited Liability Company",
                  },
                  {
                    value: "PUBLIC_LIMITED_COMPANY",
                    label: "Public Limited Company",
                  },
                  {
                    value: "GENERAL_PARTNERSHIP",
                    label: "General Partnership",
                  },
                  {
                    value: "SOLE_PROPRIETORSHIP",
                    label: "Sole Proprietorship",
                  },
                ]}
                value={formikProps.values.businessLegalEntity}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.businessLegalEntity}
                touched={formikProps.touched.businessLegalEntity}
              />
              <FormInput
                label="Describe the business in a single line"
                name="description"
                placeholder="e.g., Public company for sale in Lagos, Nigeria"
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.description}
                touched={formikProps.touched.description}
              />
             
                <FormInput
                label="Describe your facility such as built-up area, number of floors, rental/lease details"
                name="assets"
                placeholder="e.g., 5000 sqft, 2 floors, leased property"
                value={formikProps.values.assets}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.assets}
                touched={formikProps.touched.assets}
              />
            </div>

            {/* Right Column */}
            <div>
              <OptionInput
                label="How many employees does the business have?"
                name="numOfEmployees"
                options={[
                  { value: "LESS_THAN_10", label: "Less than 10" },
                  { value: "BETWEEN_10_AND_50", label: "10-50" },
                  { value: "BETWEEN_50_AND_100", label: "50-100" },
                  { value: "BETWEEN_100_AND_500", label: "100-500" },
                  { value: "BETWEEN_500_AND_1000", label: "500-1000" },
                  { value: "OVER_1000", label: "Over 1000" },
                ]}
                value={formikProps.values.numOfEmployees}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.numOfEmployees}
                touched={formikProps.touched.numOfEmployees}
              />
              <FormInput
                label="When was the business established?"
                name="yearEstablished"
                type="number"
                placeholder="e.g., 2020"
                value={formikProps.values.yearEstablished}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.yearEstablished}
                touched={formikProps.touched.yearEstablished}
              />
              <FormInput
                label="Where is the business located / headquartered?"
                name="location"
                placeholder="e.g., Lagos"
                value={formikProps.values.location}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.location}
                touched={formikProps.touched.location}
              />
             <OptionInput
                label="At present, what is your average monthly sales?"
                name="reportedSales"
                options={[
                  { value: "0-100000", label: "0-100,000" },
                  { value: "100000-1000000", label: "100,000-1,000,000" },
                ]}
                value={formikProps.values.reportedSales}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.reportedSales}
                touched={formikProps.touched.reportedSales}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-mainBlack py-8 px-5 pb-">
            <div className="font-sansSerif text-sm text-white p-6 rounded-lg space-y-8">
              {/* Stepper Section */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full"></div>
                  <p className="font-semibold ">
                    Business Information (Complete)
                  </p>
                </div>
                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-green-500 rounded-full"></div>
                  <p className="font-semibold">Verification</p>
                </div>
                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-green-500 rounded-full"></div>
                  <p className="font-semibold">Approval</p>
                </div>
              </div>

              {/* What's Next Section */}
              <div>
                <h3 className="text-xl font-semibold">What’s Next?</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Check your dashboard for real-time updates on your profile
                    status.
                  </li>
                  <li>
                    Once verified, your business will be visible in the Deal
                    Room, ready for investor connections!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-11 gap-4 font-serif">
      <div className="col-span-3 map-bg pt-12 pb-36">
        <p className="text-3xl mb-4">Register a Business</p>
        <p className="text-sm">
          Information entered here is displayed publicly to match you with the
          right set of investors and buyers. Do not mention business
          name/information which can identify the business.
        </p>
      </div>
      <div className="col-span-8">
        <div className="flex gap-7">
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
          <p
            className={`cursor-pointer ${
              currentStep === 2 ? " border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(2)}
          >
            Profile Status
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                   onClick={() =>
                  handleNext(formikProps.isValid, formikProps.errors)
                }
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
      {loading && (
      <Loading text="Registering"/>
      )}

      {modal && (
        <Modal>
          {" "}
          <div className="bg-mainBlack p-6">
            <div className="grid grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Submitted!</p>
                <p>
                  Your business profile has been successfully submitted. We’re
                  now reviewing your information and verifying your financial
                  records. This process may take up to 48 hours.
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <div className="flex mt-8 gap-6">
              <button className="bg-mainGreen py-2 px-4 rounded">
                <Link href="/dashboard">Take Fundability test</Link>
              </button>
              <button className="bg-black py-1 px-3 rounded" onClick={handleRefreshRedirect}>
                 View Dashboard
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="hidden">{modalMessage}</div>
    </div>
  );
}
