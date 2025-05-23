"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";

import { editInvestor, getInvestor } from "@/app/services/dashboard";
import { InvestorProfilePayload } from "@/app/type";

import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";

import { useSearchParams, useRouter } from "next/navigation";

import OptionInput from "@/app/components/dashboard/OptionInput";
import ArrayInput from "@/app/components/dashboard/ArrayInput";
import DocumentUpload from "@/app/components/dashboard/DocumentUpload";
import Modal from "@/app/components/dashboard/Modal";
import FormInput from "@/app/components/dashboard/FormInput";

// Define a separate type for our form values that marks file fields as optional
interface InvestorFormValues extends Omit<InvestorProfilePayload, 'logo' | 'termsOfAgreement' | 'proofOfBusiness'> {
  logo?: File | string | null;
  termsOfAgreement?: File | string | null;
  proofOfBusiness?: File | string | null;
  publicId: string | null;
}

// Define a type for payload fields
type PayloadField = keyof InvestorFormValues;

export default function EditInvestor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [investorData, setInvestorData] = useState<InvestorProfilePayload | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const investorId = searchParams.get('id');

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        setFetchLoading(true);
        const token = localStorage.getItem("token");
        
        if (!investorId || !token) {
          router.push('/dashboard/investor');
          return;
        }
        
        const data = await getInvestor(token, investorId);
        const datas = data.data;
        if (datas) {
          setInvestorData(datas as InvestorProfilePayload);
        } else {
          throw new Error("Failed to retrieve investor data");
        }
      } catch (error) {
        console.error("Failed to fetch investor data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchInvestorData();
  }, [investorId, router]);

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
    preferredIndustry: Yup.string().required("Preferred Industry is required"),
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
    termsOfAgreement: Yup.mixed().nullable(),
    proofOfBusiness: Yup.mixed().nullable(),
    logo: Yup.mixed()
      .nullable()
      .test("fileType", "Only JPG/PNG allowed", (value) => {
        if (!value || typeof value === 'string') return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(
          (value as File).type
        );
      }),
    publicId: Yup.string(),
  });

  // Only include file fields if they're being updated
  const getInitialValues = (): InvestorFormValues => {
    if (!investorData) {
      return {
        email: "",
        companyName: "",
        phoneNumber: "+234",
        about: "",
        companyWebsiteUrl: "",
        companyType: "",
        location: "",
        interestedLocations: [""],
        preferredIndustry:"",
        designation: "",
        numOfExpectedDeals: "",
        fundsUnderManagement: "",
        interestedFactors: [""],
        termsOfAgreement: null,
        proofOfBusiness: null,
        logo: null,
        publicId: investorId,
      };
    }

    return {
      email: investorData.email || "",
      companyName: investorData.companyName || "",
      phoneNumber: investorData.phoneNumber || "+234",
      about: investorData.about || "",
      companyWebsiteUrl: investorData.companyWebsiteUrl || "",
      companyType: investorData.companyType || "",
      location: investorData.location || "",
      interestedLocations: investorData.interestedLocations || [""],
      preferredIndustry:investorData.preferredIndustry  || "",
      designation: investorData.designation || "",
      numOfExpectedDeals: investorData.numOfExpectedDeals || "",
      fundsUnderManagement: investorData.fundsUnderManagement || "",
      interestedFactors: investorData.interestedFactors || [""],
      // For file fields, we'll start with null and only update if a new file is selected
      termsOfAgreement: null,
      proofOfBusiness: null,
      logo: null,
      publicId: investorId,
    };
  };

  const handleRefreshRedirect = () => {
    window.location.href = "/dashboard/investor"; // Redirect to investor dashboard
  };

  const handleNext = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: InvestorFormValues) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Create a typed payload object
      const payload: Partial<InvestorProfilePayload> = {};
      
      // Copy all required fields from values
      (Object.keys(values) as Array<PayloadField>).forEach(key => {
        // Skip file fields that are null (not being updated)
        if ((key === 'logo' || key === 'termsOfAgreement' || key === 'proofOfBusiness') && !values[key]) {
          return;
        }
        
        // Add field to payload
        const value = values[key];
        if (value !== undefined) {
          // Add the field to the payload in a type-safe way
          if (key === 'email') payload.email = value as string;
          else if (key === 'companyName') payload.companyName = value as string;
          else if (key === 'phoneNumber') payload.phoneNumber = value as string;
          else if (key === 'about') payload.about = value as string;
          else if (key === 'companyWebsiteUrl') payload.companyWebsiteUrl = value as string;
          else if (key === 'companyType') payload.companyType = value as string;
          else if (key === 'location') payload.location = value as string;
          else if (key === 'preferredIndustry') payload.preferredIndustry = value as string;
          else if (key === 'interestedLocations') payload.interestedLocations = value as string[];
          else if (key === 'designation') payload.designation = value as string;
          else if (key === 'numOfExpectedDeals') payload.numOfExpectedDeals = value as string;
          else if (key === 'fundsUnderManagement') payload.fundsUnderManagement = value as string;
          else if (key === 'interestedFactors') payload.interestedFactors = value as string[];
          else if (key === 'logo') payload.logo = value as File;
          else if (key === 'termsOfAgreement') payload.termsOfAgreement = value as File;
          else if (key === 'proofOfBusiness') payload.proofOfBusiness = value as File;
        }
      });
      
      const response = await editInvestor(payload as InvestorProfilePayload, token ?? "");

      if (response && response.ok) {
        const data = await response.json();
        console.log(data);
        showModal(true);
      } else {
        const errorData = response ? await response.json() : { message: "Network error" };
        setErrorMessage(errorData.message || "Failed to update profile");
        showErrorModal(true);
      }
    } catch (error) {
      console.error("Error updating investor profile:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      showErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (
    formikProps: FormikProps<InvestorFormValues>
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
                                label="Preferred Industry of Interest"
                                name="preferredIndustry"
                                placeholder="e.g.Fashion"
                                value={formikProps.values.preferredIndustry}
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                                error={formikProps.errors.preferredIndustry}
                                touched={formikProps.touched.preferredIndustry}
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
                label="Investment of Interest"
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
                label="Logo (Optional for update)"
                name="logo"
                onChange={(file) => formikProps.setFieldValue("logo", file)}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.logo}
                touched={formikProps.touched.logo}
                accept="application/pdf, image/*"
              />
              <DocumentUpload
                label="Terms of Agreement (Optional for update)"
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
                label="Proof Of Business (Optional for update)"
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

  if (fetchLoading) {
    return <Loading text="Loading Investor Profile" />;
  }

  return (
    <div className="grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="col-span-3 map-bg pt-12 pb-8 lg:pb-36">
        <p className="text-3xl mb-4">Edit Investor Profile</p>
        <p className="text-sm">
          Update your investor profile information below. Only fields you modify will be updated.
          For document fields, only upload a new file if you want to replace the existing one.
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
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
          enableReinitialize={true}
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
                            Object.values(formikProps.errors)
                              .filter((error): error is string => typeof error === 'string')
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
                    {currentStep === 1 ? "Update Profile" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {loading && <Loading text="Updating Profile" />}

      {modal && (
        <Modal>
          <div className="bg-mainBlack p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Updated!</p>
                <p className="text-sm lg:text-base">
                  Your Investor profile has been successfully updated. The changes will be reflected in your profile immediately.
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
                View Profile
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
                {modalErrors.length > 0 ? "Missing Required Fields" : "Error"}
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

            {modalErrors.length > 0 ? (
              <>
                <p className="text-gray-400 mb-3">
                  Please ensure the following fields are filled correctly:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-400">
                  {modalErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-gray-400 mb-3">
                {errorMessage || "An error occurred while updating your profile. Please try again."}
              </p>
            )}

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