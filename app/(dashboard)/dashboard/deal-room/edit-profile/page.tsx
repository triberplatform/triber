/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, FormikProps } from "formik";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import FormInput from "@/app/components/dashboard/FormInput";
import Modal from "@/app/components/dashboard/Modal";
import {
  getDealRoomProfile,
  updateDealRoomProfile,
} from "@/app/services/dashboard";
import * as Yup from "yup";
import { DealRoomData, ValuationFormPayload } from "@/app/type";
import { useSearchParams } from "next/navigation";
import MultipleDocumentUpload from "@/app/components/dashboard/MultipleDocument";
import Link from "next/link";
import ArrayInput from "@/app/components/dashboard/ArrayInput";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [dealRoomData, setDealRoomData] = useState<any>(null);

  // Fetch the dealroom profile on component mount
  useEffect(() => {
    const fetchDealRoomData = async () => {
      if (!id) return;

      try {
        setInitialLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await getDealRoomProfile(token, id);
        if (response && response.success && response.data) {
          setDealRoomData(response.data);
        } else {
          console.error(
            "Failed to fetch deal room profile:",
            response?.message
          );
        }
      } catch (error) {
        console.error("Error fetching deal room profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDealRoomData();
  }, [id]);

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
    assetsDetails: Yup.array()
      .of(Yup.string().required("Asset cannot be empty"))
      .min(1, "At least one asset detail is required")
      .required("Asset details are required"),
    valueOfPhysicalAssets: Yup.number()
      .typeError("Must be a number")
      .positive("Must be positive")
      .required("Physical assets value is required"),
    reasonForSale: Yup.string().required("Reason for sale is required"),
    businessPhotos: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true;
        if (Array.isArray(value) && typeof value[0] === "string") return true; // Already uploaded photos
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
        if (typeof value === "string") return true; // Already uploaded proof
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
        if (Array.isArray(value) && typeof value[0] === "string") return true; // Already uploaded documents
        const files = Array.isArray(value) ? value : [value]; // Handles both single and multiple files
        return files.every((file) =>
          ["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
            file.type
          )
        );
      }),
  });

  const getInitialValues = () => {
    if (dealRoomData) {
      // Use existing deal room data to prefill the form
      return {
        businessId: id || "",
        topSellingProducts: Array.isArray(dealRoomData.topSellingProducts)
          ? dealRoomData.topSellingProducts
          : dealRoomData.topSellingProducts
          ? [dealRoomData.topSellingProducts]
          : [""],
        highlightsOfBusiness: dealRoomData.highlightsOfBusiness || "",
        facilityDetails: dealRoomData.facilityDetails || "",
        fundingDetails: dealRoomData.fundingDetails || "",
        averageMonthlySales: dealRoomData.averageMonthlySales || 0,
        reportedYearlySales: dealRoomData.reportedYearlySales || 0,
        profitMarginPercentage: dealRoomData.profitMarginPercentage || 0,
        tentativeSellingPrice: dealRoomData.tentativeSellingPrice || 0,
        assetsDetails: Array.isArray(dealRoomData.assetsDetails)
          ? dealRoomData.assetsDetails
          : dealRoomData.assetsDetails
          ? [dealRoomData.assetsDetails]
          : [""],
        valueOfPhysicalAssets: dealRoomData.valueOfPhysicalAssets || 0,
        reasonForSale: dealRoomData.reasonForSale || "",
        // For file fields, we'll keep the existing URLs in state but use null in form
        // because we can't directly upload the existing files again
        businessPhotos: dealRoomData.businessPhotos || null,
        proofOfBusiness: dealRoomData.proofOfBusiness || null,
        businessDocuments: dealRoomData.businessDocuments || null,
      };
    } else {
      // Default initial values if no deal room data exists
      return {
        businessId: id || "",
        topSellingProducts: [""],
        highlightsOfBusiness: "",
        facilityDetails: "",
        fundingDetails: "",
        averageMonthlySales: 0,
        reportedYearlySales: 0,
        profitMarginPercentage: 0,
        tentativeSellingPrice: 0,
        assetsDetails: [""],
        valueOfPhysicalAssets: 0,
        reasonForSale: "",
        businessPhotos: null,
        proofOfBusiness: null,
        businessDocuments: null,
      };
    }
  };

  const handleSubmit = async (values: ValuationFormPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }


      // Handle file fields specially - only update if new files were provided
      const isNewBusinessPhotos =
        values.businessPhotos instanceof FileList ||
        (Array.isArray(values.businessPhotos) &&
          values.businessPhotos[0] instanceof File);

      const isNewProofOfBusiness = values.proofOfBusiness instanceof File;

      const isNewBusinessDocuments =
        values.businessDocuments instanceof FileList ||
        (Array.isArray(values.businessDocuments) &&
          values.businessDocuments[0] instanceof File);

      // Create a payload that includes the updated data
      const payload = {
        ...values,
        // Only include new files in the payload if they were provided
        businessPhotos: isNewBusinessPhotos ? values.businessPhotos : undefined,
        proofOfBusiness: isNewProofOfBusiness
          ? values.proofOfBusiness
          : undefined,
        businessDocuments: isNewBusinessDocuments
          ? values.businessDocuments
          : undefined,
      };

      const response = await updateDealRoomProfile(payload, token, id || "");

      if (response.success) {
        showModal(true);
      } else {
        alert(response.message || "Failed to update deal room profile");
      }
    } catch (error) {
      console.error("Error updating deal room profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Loading text="Loading deal room profile" />;
  }

  return (
    <div className="lg:grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="lg:col-span-3 map-bg lg:pt-12 py-5 lg:pb-36">
        <p className="lg:text-3xl font-serif font-semibold text-3xl mb-4">
          Edit Deal Room Profile
        </p>
        <p className="lg:text-sm text-xs">
          Update your company information to keep your deal room profile
          accurate and attractive to potential investors.
        </p>
      </div>
      <div className="lg:col-span-8 lg:mt-0 mt-20">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {(formikProps: FormikProps<ValuationFormPayload>) => (
            <Form>
              <div className="lg:bg-mainBlack flex flex-col py-8 lg:gap-0 gap-5 lg:px-5">
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

                {/* File Upload Section with Existing File Previews */}
                <div className="grid lg:grid-cols-2 gap-5">
                  <div>
                    {dealRoomData &&
                      dealRoomData.businessDocuments &&
                      dealRoomData.businessDocuments.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">
                            Current Business Documents:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {dealRoomData.businessDocuments.map(
                              (doc: string, index: number) => (
                                <div
                                  key={index}
                                  className="bg-zinc-800 p-2 rounded text-xs flex items-center"
                                >
                                  <span>{getFileName(doc)}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    <MultipleDocumentUpload
                      label="Update Business Documents (Optional)"
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
                  <div>
                    {dealRoomData && dealRoomData.proofOfBusiness && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">
                          Current Proof of Business:
                        </p>
                        <div className="bg-zinc-800 p-2 rounded text-xs flex items-center">
                          <span>
                            {getFileName(dealRoomData.proofOfBusiness)}
                          </span>
                        </div>
                      </div>
                    )}
                    <MultipleDocumentUpload
                      label="Update Proof of Business (Optional)"
                      name="proofOfBusiness"
                      multiple={false}
                      onChange={(file) => {
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
                    {dealRoomData &&
                      dealRoomData.businessPhotos &&
                      dealRoomData.businessPhotos.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">
                            Current Business Photos:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {dealRoomData.businessPhotos.map(
                              (photo: string, index: number) => (
                                <div
                                  key={index}
                                  className="bg-zinc-800 p-2 rounded text-xs flex items-center"
                                >
                                  <span>{getFileName(photo)}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    <MultipleDocumentUpload
                      label="Update Business Photos (Optional)"
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
                </div>

                <div className="flex gap-4 mt-6">
                  <button className="px-4  bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                    <Link href={`/dashboard/${id}`}>
                      Cancel
                    </Link>
                  </button>

                  <button
                    className="px-4  py-2 w-full text-white bg-mainGreen rounded"
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
                    Update Profile
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {loading && <Loading text="Updating Deal Room Profile" />}

      {modal && (
        <Modal>
          <div className="bg-mainBlack p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Updated!</p>
                <p className="lg:text-base text-sm">
                  Your business profile has been successfully updated.
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <button className="w-full text-white bg-mainGreen px-4 py-2 mt-5">
              <Link
                href={`/dashboard/${id}`}
                className="rounded mt-5"
              >
                Return to Business Details
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

// Helper function to get filename from URL
function getFileName(url: string): string {
  if (!url) return "No file";
  const parts = url.split("/");
  return decodeURIComponent(parts[parts.length - 1]);
}
