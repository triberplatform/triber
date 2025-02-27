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

export default function Valuation() {
  const [loading, setLoading] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const id = useSearchParams().get("id");

  const validationSchema = Yup.object().shape({
    topSellingProducts: Yup.string().required(
      "Please describe your top-selling products and services"
    ),
    highlightsOfBusiness: Yup.string().required(
      "Business highlights are required"
    ),
    facilityDetails: Yup.string().required("Facility details are required"),
    fundingDetails: Yup.string().required(
      "Current funding details are required"
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
    assetsDetails: Yup.string().required("Asset details are required"),
    valueOfPhysicalAssets: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("Physical assets value is required"),
    reasonForSale: Yup.string().required("Reason for sale is required"),
    businessPhotos: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        const files = Array.isArray(value) ? value : [value];
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
        const files = Array.isArray(value) ? value : [value];
        return files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
            file.type
          )
        );
      }),
    businessDocuments: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        const files = Array.isArray(value) ? value : [value];
        return files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
            file.type
          )
        );
      }),
  });

  const initialValues: ValuationFormPayload = {
    businessId: id || "",
    topSellingProducts: "",
    highlightsOfBusiness: "",
    facilityDetails: "",
    fundingDetails: "",
    averageMonthlySales: 0,
    reportedYearlySales: 0,
    profitMarginPercentage: 0,
    tentativeSellingPrice: 0,
    assetsDetails: "",
    valueOfPhysicalAssets: 0,
    reasonForSale: "",
    businessPhotos: null,
    proofOfBusiness: null,
    businessDocuments: null,
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
                <FormInput
                  label="What are the business's top-selling products and services, who uses them, and how?"
                  name="topSellingProducts"
                  placeholder="Top selling products and services"
                  value={formikProps.values.topSellingProducts}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.topSellingProducts}
                  touched={formikProps.touched.topSellingProducts}
                />
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
                <FormInput
                  label="List all the tangible and intangible assets the buyer would get."
                  name="assetsDetails"
                  placeholder="Assets Details"
                  value={formikProps.values.assetsDetails}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.assetsDetails}
                  touched={formikProps.touched.assetsDetails}
                />
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
                    <FormInput
                      label="Provide Reason for sale."
                      name="reasonForSale"
                      placeholder="Reason for Sale"
                      value={formikProps.values.reasonForSale}
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.reasonForSale}
                      touched={formikProps.touched.reasonForSale}
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    <MultipleDocumentUpload
                      label="Business Photos"
                      name="businessPhotos"
                      multiple={true}
                      onChange={(files) => {
                        formikProps.setFieldValue("businessPhotos", files);
                      }}
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.businessPhotos}
                      touched={formikProps.touched.businessPhotos}
                      accept="application/pdf, image/*"
                    />
                  </div>
                  <div>
                    <MultipleDocumentUpload
                      label="Proof of Business"
                      name="proofOfBusiness"
                      multiple={true}
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

                <div className="grid lg:grid-cols-2 gap-5">
                  <div className="col-span-1">
                    <MultipleDocumentUpload
                      label="Business Document"
                      name="businessDocuments"
                      multiple={true}
                      onChange={(file) =>
                        formikProps.setFieldValue("businessDocuments", file)
                      }
                      onBlur={formikProps.handleBlur}
                      error={formikProps.errors.businessDocuments}
                      touched={formikProps.touched.businessDocuments}
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
                  Your business profile has been successfully submitted. We&apos;re
                  now reviewing your information{" "}
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <button className="w-full text-white bg-mainGreen px-4 py-2 mt-5">
            <Link href={`investor-dashboard?id=${id}`} className="  rounded mt-5">
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
