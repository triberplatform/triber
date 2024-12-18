"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import OptionInput from "./OptionInput";
import { FundabilityPayload } from "@/app/type";
import Modal from "./Modal";
import { FaRegThumbsUp } from "react-icons/fa";
import { fundabilityTest } from "@/app/services/dashboard";
import ArrayInput from "./ArrayInput";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import Loading from "@/app/loading";

export default function FundabilityForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<number>(0);

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
    title: Yup.string().required("Title is required"),
    yearsOfOperation: Yup.number()
      .min(0, "Years of Operation cannot be negative")
      .notRequired(),
    companySize: Yup.number()
      .min(0, "Company Size cannot be negative")
      .required("Company Size is required"),
    companyLegalCases: Yup.boolean().required("This field is required"),
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
    isicIndustry: Yup.boolean().required("This field is required"),
    isicActivity: Yup.string().notRequired(),
    legalAdvisors: Yup.array().of(Yup.string()).notRequired(),
    averageAnnualRevenue: Yup.number()
      .min(0, "Revenue cannot be negative")
      .required("Average Annual Revenue is required"),
    revenueGrowthRate: Yup.number()
      .min(0, "Growth rate cannot be negative")
      .notRequired(),
    auditedFinancialStatement: Yup.boolean().required("This field is required"),
    companyPitchDeck: Yup.boolean().required("This field is required"),
    companyBusinessPlan: Yup.boolean().required("This field is required"),
    company5yearCashFlow: Yup.boolean().required("This field is required"),
    companySolidAssetHolding: Yup.boolean().required("This field is required"),
    companyLargeInventory: Yup.boolean().required("This field is required"),
    company3YearProfitable: Yup.boolean().required("This field is required"),
    companyHighScalibilty: Yup.boolean().required("This field is required"),
    companyCurrentLiabilities: Yup.boolean().required("This field is required"),
    ownerCurrentLiabilities: Yup.boolean().required("This field is required"),
  });

  const initialValues = {
    registeredCompany: true,
    legalName: "",
    companyRegistration: "",
    city: "",
    country: "",
    industry: "",
    registeredAddress: "",
    companyEmail: "",
    contactNumber: "",
    principalAddress: "",
    applicantsAddress: "",
    position: "",
    title: "",
    yearsOfOperation: 0,
    companySize: 0,
    companyLegalCases: false,
    startupStage: "",
    ownership: [""],
    executiveManagement: [""],
    boardOfDirectors: [""],
    isicIndustry: false,
    isicActivity: "",
    legalAdvisors: [""],
    averageAnnualRevenue: 0,
    revenueGrowthRate: 0,
    auditedFinancialStatement: false,
    companyPitchDeck: false,
    companyBusinessPlan: false,
    company5yearCashFlow: false,
    companySolidAssetHolding: false,
    companyLargeInventory: false,
    company3YearProfitable: false,
    companyHighScalibilty: false,
    companyCurrentLiabilities: false,
    ownerCurrentLiabilities: false,
  };

  const handleRefreshRedirect = () => {
    window.location.href = "/dashboard"; // Replace with the desired path
  };
  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: FundabilityPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fundabilityTest(values, token || "");

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
        alert("An Error Occured try again");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const renderStepContent = (formikProps: FormikProps<FundabilityPayload>) => {
    switch (currentStep) {
      case 0:
        return (
          <div className=" bg-mainBlack gap-5 pb-12 py-8 px-5">
            <div className="grid grid-cols-2 gap-5 items-end">
              <OptionInput
                label="Are you a registered Company?"
                name="registeredCompany"
                options={[
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
            <div className="grid grid-cols-2 gap-3 items-end">
              <FormInput
                label="Company registration (LTD, Enterprise, Sole proprietorship, others) *"
                name="companyRegistration"
                placeholder="Company Regisration"
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
            <div className="grid grid-cols-2 gap-5 items-end">
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

              <FormInput
                label="Industry"
                name="industry"
                placeholder="Industry"
                value={formikProps.values.industry}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.industry}
                touched={formikProps.touched.industry}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 items-end">
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

            <div className="grid grid-cols-2 gap-5 items-end">
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
                label="Startup stage"
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

            <div className="grid grid-cols-2 gap-5 items-end">
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
            <div className="grid grid-cols-2 gap-5 items-end">
              <OptionInput
                label="Position"
                name="position"
                options={[
                  { value: "exec", label: "Exec" },
                  { value: "mid", label: "Mid" },
                  { value: "other", label: "Other" },
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

            <div className="grid grid-cols-2 gap-5 items-end">
              <FormInput
                label="How many years have you been operating optional*"
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

            <div className="grid grid-cols-2 gap-5 items-end">
              <OptionInput
                label="Have your company been involved in a legal case?"
                name="companyLegalCases"
                options={[
                  { value: "true", label: "Yes" }, // Store as string
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
          <div className=" bg-mainBlack gap-5 py-8 px-5">
            {/* Left Column */}
            <div className="grid grid-cols-2 gap-5 items-end">
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
            <div className="grid grid-cols-2 gap-5 items-end">
              <ArrayInput
                label="Legal Advisors optional*"
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
            <div className="grid grid-cols-2 gap-5 items-end">
              <OptionInput
                label="ISIC Industry (do you belong to any industry Association)"
                name="isicIndustry"
                options={[
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
                label="ISIC Activities (International standard industrial classification) optional*"
                name="isicActivity"
                placeholder="e.g., Selling"
                value={formikProps.values.isicActivity}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.isicActivity}
                touched={formikProps.touched.isicActivity}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className=" bg-mainBlack gap-5 py-8 px-5">
            <div className="grid grid-cols-2 items-end gap-5">
              <FormInput
                label="Company ARR/TTM (Average Annual Revenue)"
                name="averageAnnualRevenue"
                type="number"
                placeholder="e.g, 1000000"
                value={formikProps.values.averageAnnualRevenue}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.averageAnnualRevenue}
                touched={formikProps.touched.averageAnnualRevenue}
              />
              <FormInput
                label="Revenue growth rate CAGR (%) optional*"
                name="revenueGrowthRate"
                type="number"
                placeholder="e.g 60"
                value={formikProps.values.revenueGrowthRate}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.revenueGrowthRate}
                touched={formikProps.touched.revenueGrowthRate}
              />
            </div>
            <div className="grid grid-cols-2 items-end gap-5">
              <OptionInput
                label="Do you have an audited financial statement?"
                name="auditedFinancialStatement"
                options={[
                  { value: true, label: "Yes" },
                  { value: false, label: "No" },
                ]}
                value={formikProps.values.auditedFinancialStatement.toString()}
                onChange={(e) => {
                  const booleanValue = e.target.value === "true"; // Convert string to boolean
                  formikProps.setFieldValue(
                    "auditedFinancialStatement",
                    booleanValue
                  );
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.auditedFinancialStatement}
                touched={formikProps.touched.auditedFinancialStatement}
              />
              <OptionInput
                label="Do you have a company pitch deck?"
                name="companyPitchDeck"
                options={[
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
            <div className="grid grid-cols-2 items-end gap-5">
              <OptionInput
                label="Does your company have a business Plan?"
                name="companyBusinessPlan"
                options={[
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

            <div className="grid grid-cols-2 items-end gap-5">
              <OptionInput
                label="Asset Base (Does your company possess significant SOLID asset holding?)"
                name="companySolidAssetHolding"
                options={[
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
                label="Inventory Base (Does the company possessa large inventory value?)"
                name="companyLargeInventory"
                options={[
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
            <div className="grid grid-cols-2 items-end gap-5">
              <OptionInput
                label="Has the company been 3 years profitable"
                name="company3YearProfitable"
                options={[
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
                label="Is the company highly scalable"
                name="companyHighScalibilty"
                options={[
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
            <div className="grid grid-cols-2 items-end gap-5">
              <OptionInput
                label="Does the company possess any current Liabilities/Debt"
                name="companyCurrentLiabilities"
                options={[
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
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-11 gap-4 font-sansSerif">
      <div className="col-span-3 map-bg pt-12 pb-36">
        <p className="text-3xl mb-4">Fundability test (readiness assessment)</p>
        <p className="text-sm">
          Please enter your details here. Information entered here is not
          publicly displayed. 
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
              className={`px-4 py-2 text-white bg-mainGreen rounded `}
              onClick={(e) => {
                if (currentStep !== 2) {
                  e.preventDefault(); // Prevent form submission on intermediate steps
                  handleNext();
                }
              }}
              type={currentStep === 2 ? "submit" : "button"} // Submit only on the last step
            >
              {currentStep === 2 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </Form>
      
          )}
        </Formik>
      </div>
      {loading && (
        <Loading text="Calculating"/>
      )}

      {modal && (
          <Modal>
          <div className="bg-mainBlack p-8 rounded-lg text-white">
            <div className="grid grid-cols-10 gap-4">
              {/* Left Section */}
              <div className="col-span-6">
                <p className="text-2xl mb-4 font-bold">Your Fundability Score is Ready!</p>
                <p className="text-sm mb-4">
                  Your business profile has been successfully submitted. We’re now reviewing your
                  information and verifying your financial records. This process may take up to 48
                  hours.
                </p>
                <p className="text-sm flex items-center gap-2">
                  <FaRegThumbsUp className="text-mainGreen" />
                  <span>Well done!</span>
                </p>
              </div>
  
              {/* Right Section */}
              <div className="col-span-4 flex justify-center items-center">
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={modalMessage}
                    text={`${modalMessage}%`}
                    styles={buildStyles({
                      textColor: "#42B27C", // Adjusted for "mainGreen"
                      pathColor: "#42B27C",
                      trailColor: "#2D2D2D",
                      // textSize: "25px",
                      
                    })}
                  />
                </div>
              </div>
            </div>
  
            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                className="bg-black text-white py-2 px-6 rounded text-sm hover:bg-gray-800"
                onClick={handleRefreshRedirect}
              >
                View Dashboard
              </button>
              <button
                className="bg-mainGreen text-white py-2 px-6 rounded text-sm hover:bg-green-600"
                onClick={() => showModal(false)}
              >
                Retake Test
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
