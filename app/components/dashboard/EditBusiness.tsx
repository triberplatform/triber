"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import OptionInput from "./OptionInput";
import { editBusiness } from "@/app/services/dashboard";
import { RegisterBusinessPayload } from "@/app/type";
import Modal from "./Modal";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import DocumentUpload from "./DocumentUpload";
import Link from "next/link";
import { useUser } from "../layouts/UserContext";

export default function EditBusiness({ id }: { id: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const {businessDetails} = useUser();
  
const business = businessDetails.find((b) => b.publicId === id);
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
    businessStage: Yup.string().required("Business Stage is required"),
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
    logo: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // Allow null if no file
        const file = value as File;
        return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      }),
  });

  const initialValues: RegisterBusinessPayload = {
    businessName: business?.businessName ?? "",
    businessPhone: business?.businessPhone ?? "",
    businessEmail: business?.businessEmail ?? "",
    businessStatus: business?.businessStatus ?? "",
    interestedIn: business?.interestedIn ?? "",
    industry: business?.industry ?? "",
    businessLegalEntity: business?.businessLegalEntity ?? "",
    description: business?.description ?? "",
    businessStage: business?.businessStage ?? "",
    reportedSales: business?.reportedSales ?? "",
    numOfEmployees: business?.numOfEmployees ?? "",
    yearEstablished: business?.yearEstablished ?? 0,
    location: business?.location ?? "",
    assets: business?.assets ?? "",
    logo: null,
  };

  const handleNext = () => {
    if (currentStep < 1) {
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
      const response = await editBusiness(values, token ?? "", id);

      if (response.ok) {
        const data = await response.json();
        setModalMessage(data.message);
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
    formikProps: FormikProps<RegisterBusinessPayload>
  ) => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid lg:grid-cols-2 lg:bg-mainBlack lg:gap-5 lg:pb-32 lg:py-8 py-8 gap-5 lg:px-5">
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
              value={formikProps.values.businessStatus}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.businessStatus}
              touched={formikProps.touched.businessStatus}
            />
            <OptionInput
              label="Business Stage"
              name="businessStage"
              options={[
                { value: "SME", label: "SME" },
                { value: "Startup", label: "Start up" },
              ]}
              value={formikProps.values.businessStage}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.businessStage}
              touched={formikProps.touched.businessStage}
            />
          </div>
        );

      case 1:
        return (
          <div className="grid lg:grid-cols-2 lg:bg-mainBlack lg:gap-5 py-8 lg:py-8 lg:px-5">
            {/* Left Column */}
            <div className="space-y-5 ">
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
              <FormInput
                label="Select business industry"
                name="industry"
                placeholder="e.g finance"
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
            <div className="space-y-5 mt-5 lg:mt-0">
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
               <FormInput
                label="At present, what is your average monthly sales?"
                name="reportedSales"
                placeholder="10,000,000"
                value={formikProps.values.reportedSales}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.reportedSales}
                touched={formikProps.touched.reportedSales}
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
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="col-span-3 map-bg lg:pt-12 py-5 lg:pb-36">
        <p className="lg:text-3xl font-serif text-2xl mb-4">Edit Business Details</p>
        <p className="lg:text-sm text-xs">
          Information entered here is displayed publicly to match you with the
          right set of investors and buyers. Do not mention business
          name/information which can identify the business.
        </p>
      </div>
      <div className="col-span-8">
        <div className="flex gap-5 justify-between lg:justify-normal text-sm lg:text-base lg:gap-7">
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
                      if (currentStep < 1) {
                        e.preventDefault(); // Prevent form submission
                        handleNext();
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
      {loading && <Loading text="Editing" />}

      {modal && (
        <Modal>
          <div className="bg-mainBlack flex flex-col gap-5 p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Updated!</p>
                <p className="hidden">{modalMessage}</p>
                <p className="lg:text-base text-sm">
                  Your business profile has been successfully updated. 
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <div className="flex mt-5 justify-between lg:justify-normal lg:mt-8 gap-3 lg:gap-6">
              <Link href="/dashboard">
                <button className="bg-mainGreen lg:text-base text-xs py-2 px-2 lg:px-4 rounded">
                  View Dashboard
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}




