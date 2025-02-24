"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import OptionInput from "./OptionInput";
import { StartupFundabilityPayload } from "@/app/type";
import Modal from "./Modal";
import { FaRegThumbsUp } from "react-icons/fa";
import { startupFundabilityTest } from "@/app/services/dashboard";
import ArrayInput from "./ArrayInput";
import Loading from "@/app/loading";
import DocumentUpload from "./DocumentUpload";
import { useUser } from "../layouts/UserContext";
import CircularProgress from "./Circular";

interface FundabilityFormProps {
  id: string;
}

export default function StartupFundability({ id }: FundabilityFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modal, showModal] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<number>(0);
  const [modalErrors, setModalErrors] = useState<string[]>([]);

  const { businessDetails } = useUser();
  const business = businessDetails.find((b) => b.publicId === id);

  const validationSchema = Yup.object().shape({
    registeredCompany: Yup.boolean().required("This field is required"),
    legalName: Yup.string().required("Legal Name is required"),
    companyRegistration: Yup.string().required(
      "Company Registration type is required"
    ),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    industry: Yup.string().required("Industry is required"),
    registeredAddress: Yup.string().required("Registered Address is required"),
    companyEmail: Yup.string()
      .email("Invalid email address")
      .required("Company Email is required"),
    contactNumber: Yup.string()
      .matches(/^\+234\d{10}$/, "Must be a valid phone number")
      .required("Contact Number is required"),
    principalAddress: Yup.string().required("Principal Address is required"),
    applicantsAddress: Yup.string().required("Applicant's Address is required"),
    position: Yup.string().required("Position is required"),
    totalAddressableMarket: Yup.string().required("Position is required"),
    title: Yup.string().required("Title is required"),
    yearsOfOperation: Yup.number()
      .min(0, "Years of Operation cannot be negative")
      .notRequired(),
    companySize: Yup.number()
      .min(0, "Company Size cannot be negative")
      .required("Company Size is required"),
    companyLegalCases: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company Legal Cases is required"),
    startupStage: Yup.string().required("Startup Stage is required"),
    ownership: Yup.array().of(
      Yup.string().required("Ownership cannot be empty")
    ),
    executiveManagement: Yup.array()
      .of(Yup.string().required("Executive Management cannot be empty"))
      .required("Executive Management is required"),
    boardOfDirectors: Yup.array()
      .of(Yup.string().required("Board of Directors cannot be empty"))
      .required("Board of Directors is required"),
    isicIndustry: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("ISIC industry is required"),
    isicActivity: Yup.string().notRequired(),
    legalAdvisors: Yup.array().of(Yup.string()).notRequired(),
    customerAcquisitionCost: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("This field is required"),
    customerLifetimeValue: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("This field is required"),
    expectedAnnualRevenueGrowthRate: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be 0 or higher")
      .max(100, "Must be 100 or lower"),
    licensesToOperate: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Audited Financial Statement is required"),
    companyPitchDeck: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company Pitch Deck is required"),
    companyBusinessPlan: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company Business Plan is required"),
    company5yearCashFlow: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company 5 year Cash flow is required"),
    companySolidAssetHolding: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company Solid Asset Holding is required"),
    companyLargeInventory: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company Large Inventory is required"),
    company3YearProfitable: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company 3 year Profitable is required"),
    companyHighScalibilty: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company High Scalibilty is required"),
    companyCurrentLiabilities: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Company Current Liabilities is required"),
    ownerCurrentLiabilities: Yup.mixed()
      .test(
        "is-boolean-or-empty",
        "This field is required",
        (value) => value === true || value === false || value === ""
      )
      .required("Owner Current Liabilities is required"),
  });

  const initialValues = {
    registeredCompany: "" as boolean | string,
    legalName: "",
    companyRegistration: "",
    city: "",
    country: "",
    industry: "",
    registeredAddress: "",
    companyEmail: "",
    contactNumber: "+234",
    principalAddress: "",
    applicantsAddress: "",
    position: "",
    title: "",
    yearsOfOperation: 0,
    companySize: 0,
    companyLegalCases: "" as boolean | string,
    startupStage: "",
    ownership: [""],
    executiveManagement: [""],
    boardOfDirectors: [""],
    isicIndustry: "" as boolean | string,
    isicActivity: "",
    legalAdvisors: [""],
    customerAcquisitionCost: 0,
    totalAddressableMarket: "",
    licensesToOperate: "" as boolean | string,
    customerLifetimeValue: 0,
    expectedAnnualGrowthRate: 0,
    companyPitchDeck: "" as boolean | string,
    companyBusinessPlan: "" as boolean | string,
    company5yearCashFlow: "" as boolean | string,
    companySolidAssetHolding: "" as boolean | string,
    companyLargeInventory: "" as boolean | string,
    company3YearProfitable: "" as boolean | string,
    companyHighScalibilty: "" as boolean | string,
    companyCurrentLiabilities: "" as boolean | string,
    ownerCurrentLiabilities: "" as boolean | string,
    certificateOfIncorporation: null as File | null,
    memorandumOfAssociation: null as File | null,
    statusReport: null as File | null,
    letterOfGoodStanding: null as File | null,
    companyLiabilitySchedule: null as File | null,
    businessPlan: null as File | null,
    financialStatements: null as File | null,
    relevantLicenses: null as File | null,
    businessId: id,
  };

  const handleRefreshRedirect = () => {
    window.location.href = "/dashboard"; // Replace with the desired path
  };
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: StartupFundabilityPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create a new FormData object
      const formData = new FormData();
      // Append each field to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File || value instanceof Blob) {
          // Append files directly
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          // Convert array to JSON string and append
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "boolean" || typeof value === "number") {
          // Convert booleans and numbers to strings
          formData.append(key, String(value));
        } else if (value !== null && value !== undefined) {
          // Append all other values as strings
          formData.append(key, String(value));
        }
      });

      // Debugging: Log FormData key-value pairs
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Call the API
      const response = await startupFundabilityTest(formData, token || "");

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setModalMessage(data.score);
        showModal(true);
        return;
      }

      if (!response) {
        alert("An Error Occurred. Please try again.");
      }
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (
    formikProps: FormikProps<StartupFundabilityPayload>
  ) => {
    switch (currentStep) {
      case 0:
        return (
          <div className=" lg:bg-mainBlack gap-5 lg:pb-12 py-8 lg:px-5">
            <div className="grid lg:grid-cols-2 gap-5 items-end">
              <OptionInput
                label="Are you a registered Company?"
                name="registeredCompany"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.registeredCompany.toString()}
                onBlur={formikProps.handleBlur}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue("registeredCompany", booleanValue);
                }}
                error={formikProps.errors.registeredCompany}
                touched={formikProps.touched.registeredCompany}
              />
              <FormInput
                label="Legal Name (Company Name as on the Company registration document)"
                name="legalName"
                placeholder="example company name"
                value={formikProps.values.legalName}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.legalName}
                touched={formikProps.touched.legalName}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 gap-3 items-end">
              <OptionInput
                label="Type of Company Registration"
                name="companyRegistration"
                options={[
                  { value: "LTD", label: "LTD" },
                  { value: "Enterprise", label: "Enterprise" },
                  {
                    value: "Sole Proprietorship",
                    label: "Sole Proprietorship",
                  },
                  { value: "others", label: "others" },
                ]}
                value={formikProps.values.companyRegistration}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyRegistration}
                touched={formikProps.touched.companyRegistration}
              />
              <FormInput
                label="City"
                name="city"
                placeholder="Enter your city"
                value={formikProps.values.city}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.city}
                touched={formikProps.touched.city}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 gap-5 items-end">
              <FormInput
                label="Country"
                name="country"
                placeholder="Country"
                value={formikProps.values.country}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.country}
                touched={formikProps.touched.country}
              />

              <OptionInput
                label="Industry"
                name="industry"
                options={[
                  { value: "Agriculture", label: "Agriculture" },
                  { value: "Mining", label: "Mining" },
                  { value: "Manufacturing", label: "Manufacturing" },
                  { value: "Electricity", label: "Electricity" },
                  { value: "Water Supply", label: "Water Supply" },
                  { value: "Construction", label: "Construction" },
                  { value: "Wholesales", label: "Wholesales" },
                  { value: "Transportation", label: "Transportation" },
                  { value: "Accomodation", label: "Accomodation" },
                  {
                    value: "Information Technology",
                    label: "Information Technology",
                  },
                  { value: "Finance", label: "Finance" },
                  { value: "Real Estate", label: "Real Estate" },
                  { value: "Legal", label: "Legal" },
                  { value: "Education", label: "Education" },
                  {
                    value: "Public Administration",
                    label: "Public Administration",
                  },
                  { value: "Health", label: "Health" },
                  {
                    value: "Arts and Entertainment",
                    label: "Arts and Entertainment",
                  },
                  { value: "Others", label: "Others" },
                ]}
                value={formikProps.values.industry}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.industry}
                touched={formikProps.touched.industry}
              />
            </div>

            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 gap-5 items-end">
              <FormInput
                label="Registered Address"
                name="registeredAddress"
                placeholder="Registered Address"
                value={formikProps.values.registeredAddress}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.registeredAddress}
                touched={formikProps.touched.registeredAddress}
              />

              <FormInput
                label="Company Email Address (Official Mail)"
                name="companyEmail"
                placeholder="contact@tech.com"
                value={formikProps.values.companyEmail}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyEmail}
                touched={formikProps.touched.companyEmail}
              />
            </div>

            <div className="grid mt-5 lg:mt-0 lg:grid-cols-2 gap-5 items-end">
              <FormInput
                label="Contact Number"
                name="contactNumber"
                placeholder="+443648292"
                value={formikProps.values.contactNumber}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.contactNumber}
                touched={formikProps.touched.contactNumber}
              />
              <OptionInput
                label="Current Business Stage"
                name="startupStage"
                options={[
                  { value: "post-revenue", label: "Post-revenue" },
                  { value: "pre-revenue", label: "Pre-revenue" },
                ]}
                value={formikProps.values.startupStage}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.startupStage}
                touched={formikProps.touched.startupStage}
              />
            </div>

            <div className="grid mt-5 lg:mt-0 lg:grid-cols-2 gap-5 items-end">
              <FormInput
                label="Principal address of the business"
                name="principalAddress"
                placeholder="no.5 wall street"
                value={formikProps.values.principalAddress}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.principalAddress}
                touched={formikProps.touched.principalAddress}
              />
              <FormInput
                label="Applicants mail address"
                name="applicantsAddress"
                placeholder="johndoe@mail.com"
                value={formikProps.values.applicantsAddress}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.applicantsAddress}
                touched={formikProps.touched.applicantsAddress}
              />
            </div>
            <div className="grid mt-5 lg:mt-0 lg:grid-cols-2 gap-5 items-end">
              <OptionInput
                label="Position"
                name="position"
                options={[
                  { value: "exec", label: "Executive" },
                  {
                    value: "mid",
                    label: "Mid Level Management",
                  },
                  {
                    value: "mid",
                    label: "Lower Level Management",
                  },
                  { value: "mid", label: "Other" },
                ]}
                value={formikProps.values.position}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.position}
                touched={formikProps.touched.position}
              />
              <FormInput
                label="Title"
                name="title"
                placeholder="e.g Chief Executive officer"
                value={formikProps.values.title}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.title}
                touched={formikProps.touched.title}
              />
            </div>

            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 gap-5 items-end">
              <FormInput
                label="Years of Operation"
                name="yearsOfOperation"
                type="number"
                placeholder="Years of Operation"
                value={formikProps.values.yearsOfOperation}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.yearsOfOperation}
                touched={formikProps.touched.yearsOfOperation}
              />
              <FormInput
                label="Company Size (number of employees)"
                name="companySize"
                type="number"
                placeholder="Company Size"
                value={formikProps.values.companySize}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companySize}
                touched={formikProps.touched.companySize}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-5 mt-5 lg:mt-0 items-end">
              <OptionInput
                label="Have your company been involved in a legal case?"
                name="companyLegalCases"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                value={formikProps.values.companyLegalCases.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue("companyLegalCases", booleanValue);
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyLegalCases}
                touched={formikProps.touched.companyLegalCases}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className=" lg:bg-mainBlack gap-5 py-8 lg:px-5">
            {/* Left Column */}
            <div className="grid lg:grid-cols-2 lg:gap-5 items-end">
              <ArrayInput
                label="Ownership (who owns the business)"
                name="ownership"
                values={formikProps.values.ownership}
                onChange={(newValues) =>
                  formikProps.setFieldValue("ownership", newValues)
                }
              />
              <ArrayInput
                label="Executive Management"
                name="executiveManagement"
                values={formikProps.values.executiveManagement}
                onChange={(newValues) =>
                  formikProps.setFieldValue("executiveManagement", newValues)
                }
              />
            </div>
            <div className="grid lg:grid-cols-2 lg:mt-0 lg:gap-5 items-end">
              <ArrayInput
                label="Legal Advisors "
                name="legalAdvisors"
                values={formikProps.values.legalAdvisors}
                onChange={(newValues) =>
                  formikProps.setFieldValue("legalAdvisors", newValues)
                }
              />
              <ArrayInput
                label="Board of Directions"
                name="boardOfDirectors"
                values={formikProps.values.boardOfDirectors}
                onChange={(newValues) =>
                  formikProps.setFieldValue("boardOfDirectors", newValues)
                }
              />
            </div>

            {/* Right Column */}
            <div className="grid lg:grid-cols-2 gap-5 items-end">
              <OptionInput
                label="ISIC Industry (do you belong to any industry Association)"
                name="isicIndustry"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.isicIndustry.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue("isicIndustry", booleanValue);
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.isicIndustry}
                touched={formikProps.touched.isicIndustry}
              />
              <FormInput
                label="ISIC Activities (International standard industrial classification)"
                name="isicActivity"
                placeholder="e.g., Selling"
                value={formikProps.values.isicActivity}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.isicActivity}
                touched={formikProps.touched.isicActivity}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 gap-5 items-end">
              <OptionInput
                label="What is your Total Addressable Market Size (TAM)"
                name="totalAddressableMarket"
                options={[
                  { value: "20", label: "Post-revenue" },
                  { value: "20", label: "Pre-revenue" },
                ]}
                value={formikProps.values.totalAddressableMarket}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.totalAddressableMarket}
                touched={formikProps.touched.totalAddressableMarket}
              />

              <FormInput
                label="What is your Customer Lifetime Value"
                name="customerLifetimeValue"
                type="text" // Use text to allow formatted input
                placeholder="e.g., 5,000,000"
                value={
                  formikProps.values.customerLifetimeValue !== undefined &&
                  formikProps.values.customerLifetimeValue !== null
                    ? formikProps.values.customerLifetimeValue
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                  const numericValue = Number(rawValue); // Convert to number
                  if (!isNaN(numericValue)) {
                    formikProps.setFieldValue(
                      "customerLifetimeValue",
                      numericValue
                    ); // Store numeric value
                  }
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.customerLifetimeValue}
                touched={formikProps.touched.customerLifetimeValue}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className=" lg:bg-mainBlack gap-5 py-8 lg:px-5">
            <div className="grid lg:grid-cols-2 items-end gap-5">
              <FormInput
                label="What is your Customer Acquisition Cost"
                name="customerAcquisitionCost"
                type="text" // Use text to allow formatted input
                placeholder="e.g., 1,000,000"
                value={
                  formikProps.values.customerAcquisitionCost !== undefined &&
                  formikProps.values.customerAcquisitionCost !== null
                    ? formikProps.values.customerAcquisitionCost
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                  const numericValue = Number(rawValue); // Convert to number
                  if (!isNaN(numericValue)) {
                    formikProps.setFieldValue(
                      "customerAcquisitionCost",
                      numericValue
                    ); // Store numeric value
                  }
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.customerAcquisitionCost}
                touched={formikProps.touched.customerAcquisitionCost}
              />

              <FormInput
                label="Expected Annual Growth Rate"
                name="expectedAnnualGrowthRate"
                type="text" // Use "text" to allow a percentage sign
                placeholder="e.g., 60"
                value={
                  formikProps.values.expectedAnnualGrowthRate !== undefined &&
                  formikProps.values.expectedAnnualGrowthRate !== null
                    ? `${formikProps.values.expectedAnnualGrowthRate}%` // Append % sign for display
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/%/g, ""); // Remove % sign
                  const numericValue = Number(rawValue); // Convert to number
                  if (!isNaN(numericValue)) {
                    formikProps.setFieldValue(
                      "expectedAnnualGrowthRate",
                      numericValue
                    ); // Store numeric value
                  }
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.expectedAnnualGrowthRate}
                touched={formikProps.touched.expectedAnnualGrowthRate}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <OptionInput
                label="Do you have all necessary Licenses to Operate?"
                name="licensesToOperate"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.licensesToOperate.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue("licensesToOperate", booleanValue);
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.licensesToOperate}
                touched={formikProps.touched.licensesToOperate}
              />
              <OptionInput
                label="Do you have a company pitch deck?"
                name="companyPitchDeck"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.companyPitchDeck.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue("companyPitchDeck", booleanValue);
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyPitchDeck}
                touched={formikProps.touched.companyPitchDeck}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <OptionInput
                label="Does your company have a business Plan?"
                name="companyBusinessPlan"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.companyBusinessPlan.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "companyBusinessPlan",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyBusinessPlan}
                touched={formikProps.touched.companyBusinessPlan}
              />
              <OptionInput
                label="Company has a 5-year Financial Cashflow (3 model Financial Analysis)"
                name="company5yearCashFlow"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.company5yearCashFlow.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "company5yearCashFlow",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.company5yearCashFlow}
                touched={formikProps.touched.company5yearCashFlow}
              />
            </div>

            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <OptionInput
                label="Does your company possess significant SOLID asset holding?(Asset Base)"
                name="companySolidAssetHolding"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.companySolidAssetHolding.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "companySolidAssetHolding",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companySolidAssetHolding}
                touched={formikProps.touched.companySolidAssetHolding}
              />
              <OptionInput
                label="Does the company possessa large inventory value?(Inventory Base)"
                name="companyLargeInventory"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.companyLargeInventory.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "companyLargeInventory",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyLargeInventory}
                touched={formikProps.touched.companyLargeInventory}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <OptionInput
                label="Has the company been 3 years profitable"
                name="company3YearProfitable" 
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.company3YearProfitable.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "company3YearProfitable",
                    booleanValue
                  ); // Correct key
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.company3YearProfitable}
                touched={formikProps.touched.company3YearProfitable}
              />

              <OptionInput
                label="Does the company have a high growth potential"
                name="companyHighScalibilty"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.companyHighScalibilty.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "companyHighScalibilty",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyHighScalibilty}
                touched={formikProps.touched.companyHighScalibilty}
              />
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <OptionInput
                label="Does the company possess any current Liabilities/Debt"
                name="companyCurrentLiabilities"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.companyCurrentLiabilities.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "companyCurrentLiabilities",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.companyCurrentLiabilities}
                touched={formikProps.touched.companyCurrentLiabilities}
              />
              <OptionInput
                label="Does the Owner/Proprietor possess any current Liabilities/Debt"
                name="ownerCurrentLiabilities"
                options={[
                  { value: "", label: "Select an Option" },
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.ownerCurrentLiabilities.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "ownerCurrentLiabilities",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.ownerCurrentLiabilities}
                touched={formikProps.touched.ownerCurrentLiabilities}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className=" lg:bg-mainBlack gap-5 py-8 lg:px-5">
            <div className="grid lg:grid-cols-2 items-end gap-5">
              <div className="col-span-1">
                <DocumentUpload
                  label="Certificate of Incorporation"
                  name="certificateOfIncorporation"
                  onChange={(file) =>
                    formikProps.setFieldValue(
                      "certificateOfIncorporation",
                      file
                    )
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.certificateOfIncorporation}
                  touched={formikProps.touched.certificateOfIncorporation}
                  accept="application/pdf, image/*"
                />
              </div>
              <div className="col-span-1">
                <DocumentUpload
                  label="memorandumOfAssociation"
                  name="memorandumOfAssociation"
                  onChange={(file) =>
                    formikProps.setFieldValue("memorandumOfAssociation", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.memorandumOfAssociation}
                  touched={formikProps.touched.memorandumOfAssociation}
                  accept="application/pdf, image/*"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <div className="col-span-1">
                <DocumentUpload
                  label="Status Report"
                  name="statusReport"
                  onChange={(file) =>
                    formikProps.setFieldValue("statusReport", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.statusReport}
                  touched={formikProps.touched.statusReport}
                  accept="application/pdf, image/*"
                />
              </div>
              <div className="col-span-1">
                <DocumentUpload
                  label="Letter of Good Standing"
                  name="letterOfGoodStanding"
                  onChange={(file) =>
                    formikProps.setFieldValue("letterOfGoodStanding", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.letterOfGoodStanding}
                  touched={formikProps.touched.letterOfGoodStanding}
                  accept="application/pdf, image/*"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <div className="col-span-1">
                <DocumentUpload
                  label="Company Liability Schedule"
                  name="companyLiabilitySchedule"
                  onChange={(file) =>
                    formikProps.setFieldValue("companyLiabilitySchedule", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.companyLiabilitySchedule}
                  touched={formikProps.touched.companyLiabilitySchedule}
                  accept="application/pdf, image/*"
                />
              </div>
              <div className="col-span-1">
                <DocumentUpload
                  label="Business Plan"
                  name="businessPlan"
                  onChange={(file) =>
                    formikProps.setFieldValue("businessPlan", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.businessPlan}
                  touched={formikProps.touched.businessPlan}
                  accept="application/pdf, image/*"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 mt-5 lg:mt-0 items-end gap-5">
              <div className="col-span-1">
                <DocumentUpload
                  label="Financial Statements"
                  name="financialStatements"
                  onChange={(file) =>
                    formikProps.setFieldValue("financialStatements", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.financialStatements}
                  touched={formikProps.touched.financialStatements}
                  accept="application/pdf, image/*"
                />
              </div>
              <div className="col-span-1">
                <DocumentUpload
                  label="Relevant Licenses"
                  name="relevantLicenses"
                  onChange={(file) =>
                    formikProps.setFieldValue("relevantLicenses", file)
                  }
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.relevantLicenses}
                  touched={formikProps.touched.relevantLicenses}
                  accept="application/pdf, image/*"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="col-span-3 map-bg pt-12 lg:pb-36">
        <p className="lg:text-3xl text-2xl font-serif  mb-4">
          Fundability Check for Start Up <br />{" "}
          <span className="text-lg">(readiness assessment)</span>
        </p>
        <p className="text-sm">
          Please enter your details here. Information entered here is not
          publicly displayed. <br />{" "}
          <p className="mt-3 text-base font-semibold">
            Business:{" "}
            <span className="text-mainGreen text-sm font-normal">
              ({business?.businessName})
            </span>{" "}
          </p>
        </p>
      </div>
      <div className="col-span-8 mt-7 lg:mt-0">
        <div className="flex lg:gap-7 text-sm">
          <p
            className={`cursor-pointer ${
              currentStep === 0 ? "border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(0)}
          >
            General Information
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
            Financial Information
          </p>
          <p
            className={`cursor-pointer ${
              currentStep === 3 ? " border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(3)}
          >
            Documents Upload
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
                  {/* Previous Button */}
                  <button
                    className={`px-4 py-2 text-white bg-gray-500 rounded ${
                      currentStep === 0 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handlePrevious();
                    }}
                    disabled={currentStep === 0}
                    type="button" // Ensure this does not submit the form
                  >
                    Previous
                  </button>

                  {/* Next/Submit Button */}
                  <button
                    className="px-4 py-2 text-white bg-mainGreen rounded"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default form submission behavior
                      if (currentStep === 3) {
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
                    type="button" // Always use type="button" to prevent default form submission
                  >
                    {currentStep === 3 ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {loading && <Loading text="Calculating" />}

      {modal && (
        <Modal>
          <div className="bg-mainBlack h-[80vh] lg:h-auto p-8 rounded-lg text-white">
            <div className="grid lg:grid-cols-10 gap-4">
              {/* Left Section */}
              <div className="col-span-6">
                <p className="text-2xl mb-4 font-bold">
                  Your Fundability Score is Ready!
                </p>
                <p className="text-sm hidden lg:block mb-4">
                  Your business profile has been successfully submitted. We’re
                  now reviewing your information and verifying your financial
                  records. This process may take up to 48 hours.
                </p>
                <p className="text-sm flex items-center gap-2">
                  <FaRegThumbsUp className="text-mainGreen" />
                  <span>Well done!</span>
                </p>
              </div>

              {/* Right Section */}
              <div className="col-span-4 flex  lg:justify-normal mt-4 lg:mt-0  lg:ml-3">
                <div className="w-24 h-24 ">
                  <CircularProgress value={modalMessage} />
                </div>
              </div>
            </div>
            <p className="text-sm lg:hidden mt-32  mb-4">
                  Your business profile has been successfully submitted. We’re
                  now reviewing your information and verifying your financial
                  records. This process may take up to 48 hours.
                </p>

            {/* Buttons */}
            <div className="flex lg:justify-center justify-between gap-6 mt-5  lg:mt-8">
              <button
                className="bg-black text-white py-2 px-3 lg:px-6 rounded text-sm hover:bg-gray-800"
                onClick={handleRefreshRedirect}
              >
                View Dashboard
              </button>
              <button
                className="bg-mainGreen text-white py-2 px-3 lg:px-6 rounded text-sm hover:bg-green-600"
                onClick={() => showModal(false)}
              >
                Retake Test
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
    </div>
  );
}
