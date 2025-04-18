"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import Modal from "@/app/components/dashboard/Modal";
import { submitProposal } from "@/app/services/dashboard";
import * as Yup from "yup";
import { ProposalPayload } from "@/app/type";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import TextArea from "@/app/components/dashboard/TextArea";
import { useUser } from "@/app/components/layouts/UserContext";
import PricingModal from "@/app/components/dashboard/Pricing";

export default function Valuation() {
  const [loading, setLoading] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [pricingModal, showPricingModal] = useState(false); // New state for pricing modal
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null); // Track selected package (dummy)
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useUser();

  const businesses = user?.businesses;
  const business = businesses?.find(business => business.publicId === id);

  const validationSchema = Yup.object().shape({
    message: Yup.string().required("Please write a message"),
  });

  const initialValues: ProposalPayload = {
    businessId: id || "",
    message: "",
    // packageId removed from payload as requested
  };

  // Updated to handle package selection first
  const handleValidationAndSubmit = (formikProps: FormikProps<ProposalPayload>) => {
    if (Object.keys(formikProps.errors).length > 0) {
      setModalErrors(Object.values(formikProps.errors) as string[]);
      showErrorModal(true);
    } else {
      // Show pricing modal instead of submitting directly
      showPricingModal(true);
    }
  };

  // Handle package selection and continue with submission
  const handlePackageConfirm = (packageId: number) => {
    setSelectedPackage(packageId); // Just for tracking, not used in payload
    showPricingModal(false);
    // Proceed with form submission
    const form = document.getElementById("proposal-form");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleSubmit = async (values: ProposalPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // No need to include the selected package in the payload
      const response = await submitProposal(values, token ?? "");

      if (response.ok) {
        showModal(true);
        console.log(selectedPackage)
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
      <div className="col-span-3 map-bg lg:pt-12 py-5 lg:pb-36">
        <p className="lg:text-3xl font-serif font-semibold text-3xl mb-4">
          Submit a Proposal
        </p>
        <p className="lg:text-sm text-xs">
          Please enter your details here. Information entered here is not publicly displayed.
        </p>
      </div>
      <div className="col-span-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<ProposalPayload>) => (
            <Form id="proposal-form">
              <div className="lg:bg-mainBlack flex flex-col h-[50vh] justify-center py-8 lg:gap-0 gap-5 lg:px-5">
                <TextArea
                  label="Send an elevation Pitch to the business and include your proposal"
                  name="message"
                  placeholder="Write a message"
                  value={formikProps.values.message}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  error={formikProps.errors.message}
                />
                <div className="lg:col-span-2 mt-5">
                  <button
                    className="px-4 py-2 w-full text-white bg-mainGreen rounded"
                    type="button" // Changed to button type to control flow
                    onClick={() => handleValidationAndSubmit(formikProps)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {loading && <Loading text="Submitting" />}

      {modal && (
        <Modal>
          <div className="bg-mainBlack p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Proposal Submitted!</p>
                <p className="lg:text-base text-sm">
                  Thank you for showing interest in {business?.businessName}. Your proposal has been sent to the business owner. We will review your offer and reach out via email to discuss the next steps.
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <button className="mt-5 px-6 py-2 bg-mainGreen text-white font-medium rounded hover:bg-green-700 transition duration-300">
              <Link href="/dashboard/deal-room/dashboard">
                Go to Deal Room
              </Link>
            </button>
          </div>
        </Modal>
      )}

      {/* Pricing Modal */}
      {pricingModal && (
        <PricingModal 
          onClose={() => showPricingModal(false)}
          onConfirm={handlePackageConfirm}
          businessName={business?.businessName || "this business"}
        />
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