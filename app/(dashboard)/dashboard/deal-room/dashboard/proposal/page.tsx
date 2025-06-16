"use client";

import React, { useState, useRef } from "react";
import { Formik, Form, FormikProps } from "formik";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import Modal from "@/app/components/dashboard/Modal";
import { submitProposal } from "@/app/services/dashboard";
import * as Yup from "yup";
import { ProposalPayload } from "@/app/type";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/app/components/layouts/UserContext";
import QuillEditor from "@/app/components/dashboard/RichText";
import SubscriptionStatus from "@/app/components/dashboard/SubscriptionStatus";
import { useSubscription } from "@/app/hooks/useSubscription";

// Extend the ProposalPayload interface to include buyingPrice
interface ExtendedProposalPayload extends ProposalPayload {
  buyingPrice: number;
}

export default function Valuation() {
  const [loading, setLoading] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const [formattedPrice, setFormattedPrice] = useState<string>("500,000");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useUser();
  const subscription = useSubscription();
  const formikRef = useRef<FormikProps<ExtendedProposalPayload>>(null);

  const businesses = user?.businesses;
  const business = businesses?.find(business => business.publicId === id);

  const validationSchema = Yup.object().shape({
    message: Yup.string()
      .required("Please write a message")
      .test(
        'not-just-html',
        'Please write a message with actual content',
        value => {
          const textContent = value ? value.replace(/<[^>]*>/g, '') : '';
          return textContent.trim().length > 0;
        }
      ),
    buyingPrice: Yup.number()
      .required("Buying price is required")
      .min(1, "Buying price must be greater than 0")
  });

  const initialValues: ExtendedProposalPayload = {
    businessId: id || "",
    message: "",
    buyingPrice: 0,
  };

  const handleValidationAndSubmit = (formikProps: FormikProps<ExtendedProposalPayload>) => {
    if (Object.keys(formikProps.errors).length > 0) {
      setModalErrors(Object.values(formikProps.errors) as string[]);
      showErrorModal(true);
    } else {
      // Check if user has active subscription using the hook
      if (subscription.isActive) {
        // Skip pricing modal and submit directly
        formikProps.submitForm();
      } else {
        // For non-premium users, show message to upgrade
        alert("Please upgrade to submit proposals. Click the upgrade button above.");
      }
    }
  };

  const handleUpgradeSuccess = (packageId: number) => {
    console.log("Selected package:", packageId);
    // After successful payment, the page will refresh with active subscription
    // Then user can submit the proposal for free
  };

  const handleSubmit = async (values: ExtendedProposalPayload) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await submitProposal(values, token ?? "");

      if (response.ok) {
        showModal(true);
        console.log("Buying price:", values.buyingPrice);
        console.log("HTML Message:", values.message);
        console.log("Has active subscription:", subscription.isActive);
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
        <p className="lg:text-sm text-xs mb-4">
          Please enter your details here. Information entered here is not publicly displayed.
        </p>
        
        {/* Subscription Status with built-in modal */}
        <SubscriptionStatus 
          variant="compact" 
          showUpgradeButton={true}
          businessName={business?.businessName || "this business"}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
        
        {subscription.isActive && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-600 rounded-lg">
            <div className="flex items-center gap-2">
              <FaCheckDouble className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Free proposal submission
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="col-span-8">
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<ExtendedProposalPayload>) => (
            <Form id="proposal-form">
              <div className="lg:bg-mainBlack flex flex-col h-auto min-h-[50vh] justify-center py-8 lg:gap-0 gap-5 lg:px-5">
                <div className="mb-5">
                  <label htmlFor="buyingPrice" className="block text-sm font-medium mb-1">
                    Offer Amount (₦)
                  </label>
                  <input
                    type="text"
                    id="buyingPrice"
                    name="buyingPrice"
                    value={formattedPrice}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      const numberValue = numericValue ? parseInt(numericValue, 10) : 0;
                      const formatted = numberValue.toLocaleString();
                      
                      setFormattedPrice(formatted);
                      formikProps.setFieldValue('buyingPrice', numberValue);
                    }}
                    onBlur={formikProps.handleBlur}
                    className="w-full p-2 bg-transparent border rounded focus:outline-none focus:ring-1 focus:ring-mainGreen"
                  />
                  {formikProps.touched.buyingPrice && formikProps.errors.buyingPrice && (
                    <div className="text-red-500 text-xs mt-1">{formikProps.errors.buyingPrice}</div>
                  )}
                </div>
                
                <QuillEditor
                  label="Send an elevation Pitch to the business and include your proposal"
                  name="message"
                  placeholder=""
                />
                
                <div className="lg:col-span-2 mt-5">
                  <button
                    className="px-4 py-2 w-full text-white bg-mainGreen rounded flex items-center justify-center gap-2"
                    type="button"
                    onClick={() => handleValidationAndSubmit(formikProps)}
                  >
                    {subscription.isActive && <FaCheckDouble className="text-sm" />}
                    Submit {subscription.isActive ? '(Free)' : ''}
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