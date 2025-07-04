"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import FormInput from "@/app/components/dashboard/FormInput";
import Modal from "@/app/components/dashboard/Modal";
import { getValuation } from "@/app/services/dashboard";
import * as Yup from "yup";
import { ValuationFormPayload } from "@/app/type";
import { useSearchParams } from "next/navigation";
import MultipleDocumentUpload from "@/app/components/dashboard/MultipleDocument";
import Link from "next/link";
import ArrayInput from "@/app/components/dashboard/ArrayInput";
import OptionInput from "@/app/components/dashboard/OptionInput";

// Helper function to count words
const countWords = (text: string): number => {
  if (!text || text.trim() === "") return 0;
  return text.trim().split(/\s+/).length;
};

// TextareaInput component matching FormInput design
interface TextareaInputProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
  maxWords?: number;
  rows?: number;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  name,
  placeholder = "",
  value,
  onBlur,
  onChange,
  touched,
  error,
  maxWords = 300,
  rows = 4,
}) => {
  const wordCount = countWords(value);
  const isOverLimit = wordCount > maxWords;

  return (
    <div className="lg:mb-7 relative">
      <label
        className="block text-left text-sm font-medium"
        htmlFor={name}
      >
        {label}
      </label>
      <textarea
        className={`mt-1 block lg:bg-mainBlack placeholder:text-gray-500  text-white p-2 w-full border-gray-500 border ${
          touched && error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-vertical`}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={rows}
      />
      
      {/* Word counter */}
      <div className={`text-xs mt-1 absolute ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
        {wordCount}/{maxWords} words
        {isOverLimit && (
          <span className="ml-2 font-medium">
            ({wordCount - maxWords} words over limit)
          </span>
        )}
      </div>
      
      {touched && error && (
        <div className="text-red-500 text-sm mt-1 absolute mx-auto italic">
          {error}
        </div>
      )}
    </div>
  );
};

export default function Valuation() {
  const [loading, setLoading] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const id = useSearchParams().get("id");

  const validationSchema = Yup.object().shape({
    topSellingProducts: Yup.array()
      .of(Yup.string().required("Product cannot be empty"))
      .min(1, "At least one top-selling product is required")
      .required("Please describe your top-selling products and services"),
    highlightsOfBusiness: Yup.string().required(
      "Business highlights are required"
    ),
    facilityDetails: Yup.string().required("Facility details are required"),
    fundingDetails: Yup.string().required(
      "Current funding details are required"
    ),
    fundingStructure: Yup.string().required(
      "Funding structure are required"
    ),
    averageMonthlySales: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("This field is required"),
    reportedYearlySales: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("This field is required"),
    profitMarginPercentage: Yup.number()
      .typeError("Must be a number")
      .min(0, "Must be 0 or higher")
      .max(100, "Must be 100 or lower"),
    tentativeSellingPrice: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("This field is required"),
      fundingAmount: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("This field is required"),
    assetsDetails: Yup.array()
      .of(Yup.string().required("Asset cannot be empty"))
      .min(1, "At least one asset detail is required")
      .required("Asset details are required"),
    valueOfPhysicalAssets: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("Physical assets value is required"),
    reasonForSale: Yup.string()
      .required("Reason for funding need is required")
      .test("word-count", "Reason for funding need must not exceed 300 words", function(value) {
        if (!value) return false;
        const wordCount = countWords(value);
        return wordCount <= 300;
      }),
    businessPhotos: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        const files = Array.isArray(value) ? value : [value]; // Handles both single and multiple files
        return files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
            file.type
          )
        );
      }),
    proofOfBusiness: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        // Type guard to check if value is a File
        if (value instanceof File) {
          return [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
          ].includes(value.type);
        }
        return false;
      }),
    businessDocuments: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        const files = Array.isArray(value) ? value : [value]; // Handles both single and multiple files
        return files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
            file.type
          )
        );
      }),
  });

  const initialValues: ValuationFormPayload = {
    businessId: id || "",
    topSellingProducts: [""], // Initialize as array with empty string
    highlightsOfBusiness: "",
    facilityDetails: "",
    fundingDetails: "",
    averageMonthlySales: 0,
    reportedYearlySales: 0,
    profitMarginPercentage: 0,
    tentativeSellingPrice: 0,
    assetsDetails: [""], // Initialize as array with empty string
    valueOfPhysicalAssets: 0,
    reasonForSale: "",
    businessPhotos: null,
    proofOfBusiness: null,
    businessDocuments: null,
    fundingAmount: 0,
    fundingStructure: "",
  };

  const handleSubmit = async (values: ValuationFormPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await getValuation(values, token ?? "");

      if (response.ok) {
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

  return (
    <div className="lg:grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="lg:col-span-3 map-bg lg:pt-12 py-5 lg:pb-36">
        <p className="lg:text-3xl font-serif font-semibold text-3xl mb-4">
          Create Deal Room Profile
        </p>
        <p className="lg:text-sm text-xs">
          Please fill out some basic information about your company. This is to
          get a general valuation of the business, this will be vital in the
          deal room.
        </p>
      </div>
      <div className="lg:col-span-8 lg:mt-0 mt-20">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<ValuationFormPayload>) => (
            <Form>
              <div className="lg:bg-mainBlack flex flex-col  py-8 lg:gap-0 gap-5 lg:px-5">
                <div className="mb-5">
                  <ArrayInput
                    label="What are the business's top-selling products and services, who uses them, and how?"
                    name="topSellingProducts"
                    values={formikProps.values.topSellingProducts as string[]}
                    onChange={(newValues) =>
                      formikProps.setFieldValue("topSellingProducts", newValues)
                    }
                  />
                  {formikProps.touched.topSellingProducts &&
                    formikProps.errors.topSellingProducts && (
                      <div className="text-red-500 text-sm mt-1">
                        {typeof formikProps.errors.topSellingProducts ===
                        "string"
                          ? formikProps.errors.topSellingProducts
                          : "Please add at least one product"}
                      </div>
                    )}
                </div>

                <FormInput
                  label="Mention highlights of the business including number of clients, revenue model, promoter experience, business relationships, awards, etc."
                  name="highlightsOfBusiness"
                  placeholder="Highlights of the business"
                  value={formikProps.values.highlightsOfBusiness}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.highlightsOfBusiness}
                  touched={formikProps.touched.highlightsOfBusiness}
                />
                <FormInput
                  label="Describe your facility such as built-up area, number of floors, rental/lease details."
                  name="facilityDetails"
                  placeholder="Facility Description"
                  value={formikProps.values.facilityDetails}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.facilityDetails}
                  touched={formikProps.touched.facilityDetails}
                />
                <FormInput
                  label="How is the business funded presently? Mention all debts/loans outstanding and the total number of shareholders/owners of the business with percentage ownership."
                  name="fundingDetails"
                  placeholder="Business Funding"
                  value={formikProps.values.fundingDetails}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.fundingDetails}
                  touched={formikProps.touched.fundingDetails}
                />
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    <FormInput
                      label="At present, what is your average monthly sales?"
                      name="averageMonthlySales"
                      placeholder="Average Monthly Sales"
                      value={
                        formikProps.values.averageMonthlySales !== undefined &&
                        formikProps.values.averageMonthlySales !== null
                          ? formikProps.values.averageMonthlySales
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formikProps.setFieldValue(
                            "averageMonthlySales",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.averageMonthlySales}
                      touched={formikProps.touched.averageMonthlySales}
                    />
                  </div>
                  <div>
                    <FormInput
                      label="What was your latest reported yearly sales?"
                      name="reportedYearlySales"
                      placeholder="Yearly Sales"
                      value={
                        formikProps.values.reportedYearlySales !== undefined &&
                        formikProps.values.reportedYearlySales !== null
                          ? formikProps.values.reportedYearlySales
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formikProps.setFieldValue(
                            "reportedYearlySales",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.reportedYearlySales}
                      touched={formikProps.touched.reportedYearlySales}
                    />
                  </div>
                </div>
                <div className="lg:grid lg:grid-cols-2 flex flex-col lg:items-end lg:mt-5 gap-5">
                  <div>
                    <FormInput
                      label="What is the EBITDA/Operating Profit Margin Percentage?"
                      name="profitMarginPercentage"
                      placeholder="Profit Margin Percentage"
                      value={
                        formikProps.values.profitMarginPercentage !==
                          undefined &&
                        formikProps.values.profitMarginPercentage !== null
                          ? `${formikProps.values.profitMarginPercentage}%` // Append % sign for display
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/%/g, ""); // Remove % sign
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formikProps.setFieldValue(
                            "profitMarginPercentage",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.profitMarginPercentage}
                      touched={formikProps.touched.profitMarginPercentage}
                    />
                  </div>
                  <div>
                    <FormInput
                      label="What is the tentative selling price of the business?"
                      name="tentativeSellingPrice"
                      placeholder="Tentative Selling Price"
                      value={
                        formikProps.values.tentativeSellingPrice !==
                          undefined &&
                        formikProps.values.tentativeSellingPrice !== null
                          ? formikProps.values.tentativeSellingPrice
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formikProps.setFieldValue(
                            "tentativeSellingPrice",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.tentativeSellingPrice}
                      touched={formikProps.touched.tentativeSellingPrice}
                    />
                  </div>
                </div>

                <div className="mb-5 mt-5">
                  <ArrayInput
                    label="List all the tangible and intangible assets the buyer would get."
                    name="assetsDetails"
                    values={formikProps.values.assetsDetails as string[]}
                    onChange={(newValues) =>
                      formikProps.setFieldValue("assetsDetails", newValues)
                    }
                  />
                  {formikProps.touched.assetsDetails &&
                    formikProps.errors.assetsDetails && (
                      <div className="text-red-500 text-sm mt-1">
                        {typeof formikProps.errors.assetsDetails === "string"
                          ? formikProps.errors.assetsDetails
                          : "Please add at least one asset"}
                      </div>
                    )}
                </div>

                <div className="lg:grid lg:grid-cols-2 flex flex-col lg:items-end gap-5">
                  <div>
                    <FormInput
                      label="What is the value of physical assets owned by the business that would be part of the transaction?"
                      name="valueOfPhysicalAssets"
                      placeholder="Value of Physical Assets"
                      value={
                        formikProps.values.valueOfPhysicalAssets !==
                          undefined &&
                        formikProps.values.valueOfPhysicalAssets !== null
                          ? formikProps.values.valueOfPhysicalAssets
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formikProps.setFieldValue(
                            "valueOfPhysicalAssets",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.valueOfPhysicalAssets}
                      touched={formikProps.touched.valueOfPhysicalAssets}
                    />
                  </div>
                  <div>
                    <TextareaInput
                      label="Provide Reason for Funding need (Maximum 300 words)"
                      name="reasonForSale"
                      placeholder="Reason for Funding need"
                      value={formikProps.values.reasonForSale}
                      onChange={(e) => {
                        formikProps.handleChange(e);
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.reasonForSale}
                      touched={formikProps.touched.reasonForSale}
                      maxWords={300}
                      rows={1}
                    />
                  </div>
                </div>
                <div className="lg:grid lg:grid-cols-2 flex flex-col lg:items-end gap-5">
                  <div>
                    <FormInput
                      label="How much do you seek in funding?"
                      name="fundingAmount"
                      placeholder="Funding amount"
                      value={
                        formikProps.values.fundingAmount !== undefined &&
                        formikProps.values.fundingAmount !== null
                          ? formikProps.values.fundingAmount
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formikProps.setFieldValue(
                            "fundingAmount",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.fundingAmount}
                      touched={formikProps.touched.fundingAmount}
                    />
                  </div>
                  <div>
                    <OptionInput
                      label="What is your proposed funding structure"
                      name="fundingStructure"
                      options={[
                        { value: "Debt Funding", label: "Debt Funding" },
                        {
                          value: "Equity",
                          label: "Equity",
                        },
                        {
                          value: "Partial Stake",
                          label: "Partial Stake",
                        }
                      ]}
                      value={formikProps.values.fundingStructure}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.fundingStructure}
                      touched={formikProps.touched.fundingStructure}
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    <MultipleDocumentUpload
                      label="Business Document"
                      name="businessDocuments"
                      multiple={true} // This is correctly set to true
                      onChange={(file) =>
                        formikProps.setFieldValue("businessDocuments", file)
                      }
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.businessDocuments}
                      touched={formikProps.touched.businessDocuments}
                      accept="application/pdf, image/*"
                    />
                  </div>
                  <div>
                    <MultipleDocumentUpload
                      label="Proof of Business"
                      name="proofOfBusiness"
                      multiple={false} // Changed to false for single file upload
                      onChange={(file) => {
                        // If an array is returned (due to component implementation),
                        // take only the first file since we want a single file
                        const singleFile =
                          Array.isArray(file) && file.length > 0
                            ? file[0]
                            : file;
                        formikProps.setFieldValue(
                          "proofOfBusiness",
                          singleFile
                        );
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.proofOfBusiness}
                      touched={formikProps.touched.proofOfBusiness}
                      accept="application/pdf, image/*"
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  <div className="col-span-1">
                    <MultipleDocumentUpload
                      label="Business Photos"
                      name="businessPhotos"
                      multiple={true} // This enables multiple file uploads
                      onChange={(files) => {
                        formikProps.setFieldValue("businessPhotos", files);
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.businessPhotos}
                      touched={formikProps.touched.businessPhotos}
                      accept="application/pdf, image/*"
                    />
                  </div>
                </div>
                <button
                  className="px-4 lg:mb-5 py-2 w-full text-white bg-mainGreen rounded"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (Object.keys(formikProps.errors).length > 0) {
                      setModalErrors(
                        Object.values(formikProps.errors) as string[]
                      );
                      showErrorModal(true);
                    } else {
                      formikProps.handleSubmit();
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {loading && <Loading text="Loading Deal room" />}

      {modal && (
        <Modal>
          <div className="bg-mainBlack p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Submitted!</p>
                <p className="lg:text-base text-sm">
                  Your business profile has been successfully submitted.
                  We&apos;re now reviewing your information{" "}
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <button className="w-full text-white bg-mainGreen px-4 py-2 mt-5">
              <Link
                href={`investor-dashboard?id=${id}`}
                className="rounded mt-5"
              >
                Go to Deal Room
              </Link>
            </button>
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