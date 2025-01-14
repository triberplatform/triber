"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { ConnectFormValues } from "@/app/type";
import { connectionRequest } from "@/app/services/dashboard";
import Loading from "@/app/loading";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const formik = useFormik<ConnectFormValues>({
    initialValues: {
      businessName: "",
      businessRegistration: "",
      annualTurnOver: 0,
      fundingRequirement: 0,
      description: "",
      contactEmail: "",
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required("Business Name is required"),
      businessRegistration: Yup.string().required(
        "Business Registration is required"
      ),
      annualTurnOver: Yup.number()
        .typeError("Annual Turnover must be a number")
        .required("Annual Turnover is required"),
      fundingRequirement: Yup.number()
        .typeError("Funding Requirement must be a number")
        .required("Funding Requirement is required"),
      description: Yup.string().required("Description is required"),
      contactEmail: Yup.string()
        .email("Invalid email address")
        .required("Contact Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setIsModalOpen(false);
      try {
        const response = await connectionRequest(values);

        if (!response.ok) {
          const errorData = await response.json();
          setModalMessage(errorData.error || "Submission failed.");
          setOpen(true);
          return;
        }

        const data = await response.json();
        setModalMessage(data.message || "Form submitted successfully.");
        setOpen(true);
        resetForm();
      } catch (error) {
        setModalMessage("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="text-center lg:pb-10 lg:mt-3">
      <p className="lg:text-[3.2rem] text-4xl mx-auto font-semibold lg:w-full w-[50%] font-serif">
        Connect. Grow. Succeed.
      </p>
      <p className="my-8 mx-3">
        The Pioneering Platform Connecting SMEs and Startups with Investors
      </p>
      <Image
        src="/assets/map.png"
        width={800}
        height={50}
        alt="hero map"
        className="object-contain mx-auto hidden lg:block "
      />
      <Image
        src="/assets/hero-mobile.png"
        width={800}
        height={50}
        alt="hero map"
        className="object-contain px-10 mt-16 pb-10 lg:hidden"
      />
      {isModalOpen && (
        <Modal>
          <div className="max-h-[85vh] lg:h-[90vh] gap-3 bg-mainBlacks  grid grid-cols-10  modal-scroll w-full">
            <div className="col-span-3 relative h-full">
              <Image
                src="/assets/valuation3.png"
                width={500}
                height={500}
                alt="hero map"
                className="object-cover absolute inset-0 w-full h-full"
              />
            </div>
            <div className="col-span-7 py-6 px-3">
              <button
                onClick={toggleModal}
                className=" text-3xl text-mainGreen  float-right"
              >
                &times;
              </button>
              <p className="lg:text-2xl text-xl font-semibold mb-2 font-serif text-white">
                Welcome to Triber{" "}
                <span className="text-mainGreen">Connect</span> Directly <br />{" "}
                with our Partners
              </p>
              <form
                onSubmit={formik.handleSubmit}
                className="flex-col flex mt-7 lg:space-y-5 text-left text-white font-serif"
              >
                <div className="lg:grid grid-cols-2 space-y-5 lg:space-y-0 gap-5">
                  <div className="col-span-1 flex lg:gap-2 flex-col">
                    <label
                      htmlFor="businessName"
                      className="font-sansSerif text-xs"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Enter Registered Business Name"
                      className="lg:w-full text-[0.8rem] bg-mainBlacks py-2 rounded border-gray-500 px-5 focus:outline-none border focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.businessName}
                    />
                    {formik.touched.businessName &&
                      formik.errors.businessName && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.businessName}
                        </div>
                      )}
                  </div>
                  <div className="col-span-1 flex lg:gap-2 flex-col">
                    <label
                      htmlFor="businessRegistration"
                      className="font-sansSerif text-xs"
                    >
                      Business Registration
                    </label>
                    <select
                      id="businessRegistration"
                      name="businessRegistration"
                      className="lg:w-full text-[0.8rem] bg-mainBlacks border-gray-500 border py-[0.58rem] rounded px-5 focus:outline-none focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.businessRegistration}
                    >
                      <option value="">Select Company Type</option>
                      <option value="unregistered">
                        Unregistered Business
                      </option>
                      <option value="llc">Limited Liability Company</option>
                      <option value="soleProprietorship">
                        Sole Proprietorship
                      </option>
                    </select>
                    {formik.touched.businessRegistration &&
                      formik.errors.businessRegistration && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.businessRegistration}
                        </div>
                      )}
                  </div>
                </div>

                <div className="lg:grid grid-cols-2 space-y-5 lg:space-y-0 gap-5">
                  <div className="col-span1 flex gap-1 flex-col">
                    <label
                      htmlFor="annualTurnOver"
                      className="font-sansSerif text-xs"
                    >
                      Annual Turnover
                    </label>
                    <input
                       type="text" // Use text to allow formatted input
                       name="annualTurnOver"
                       placeholder="e.g., 1,000,000"
                         className="lg:w-full text-[0.8rem] bg-mainBlacks border-gray-500 border py-2 rounded px-5 focus:outline-none focus:ring-0"
                       value={
                         formik.values.annualTurnOver !== undefined &&
                         formik.values.annualTurnOver !== null
                           ? formik.values.annualTurnOver
                               .toString()
                               .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                           : ""
                       }
                       onChange={(e) => {
                         const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                         const numericValue = Number(rawValue); // Convert to number
                         if (!isNaN(numericValue)) {
                           formik.setFieldValue(
                             "annualTurnOver",
                             numericValue
                           ); // Store numeric value
                         }
                       }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.annualTurnOver &&
                      formik.errors.annualTurnOver && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.annualTurnOver}
                        </div>
                      )}
                  </div>
                  <div className="col-span-1 flex gap-1 flex-col">
                    <label
                      htmlFor="fundingRequirement"
                      className="font-sansSerif text-xs"
                    >
                      Funding Requirement
                    </label>
                    <input
                      type="text"
                      name="fundingRequirement"
                      placeholder="e.g., 1,000,000"
                        className="lg:w-full text-[0.8rem] bg-mainBlacks border-gray-500 border py-2 rounded px-5 focus:outline-none focus:ring-0"
                      value={
                        formik.values.fundingRequirement !== undefined &&
                        formik.values.fundingRequirement !== null
                          ? formik.values.fundingRequirement
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                        const numericValue = Number(rawValue); // Convert to number
                        if (!isNaN(numericValue)) {
                          formik.setFieldValue(
                            "fundingRequirement",
                            numericValue
                          ); // Store numeric value
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.fundingRequirement &&
                      formik.errors.fundingRequirement && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.fundingRequirement}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-span-1 flex gap-1 flex-col">
                  <label
                    htmlFor="contactEmail"
                    className="font-sansSerif text-xs"
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    placeholder="Contact Email"
                    className="bg-mainBlacks text-[0.8rem] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.contactEmail}
                  />
                  {formik.touched.contactEmail && formik.errors.contactEmail ? (
                    <div className="text-red-500 text-xs">
                      {formik.errors.contactEmail}
                    </div>
                  ) : null}
                </div>
                <div className="lg:grid grid-cols-2 mt-5 lg:mt-0 gap-5">
                  <div className="col-span-2 flex gap-1 flex-col">
                    <label
                      htmlFor="description"
                      className="font-sansSerif text-xs"
                    >
                      Brief Business Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Business Description"
                      className="lg:w-full bg-mainBlacks text-[0.8rem] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.description}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-mainGreen px-7 mt-4 py-2 w-full rounded-lg text-sm"
                >
                  {loading ? "Submitting..." : "Apply"}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
      {open && (
        <Modal>
          <div className="p-8 bg-black text-white rounded-lg shadow-md relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="Close modal"
            >
              <AiOutlineClose size={20} />
            </button>

            {/* Icon and Heading */}
            <div className="text-center">
              <AiOutlineInfoCircle
                size={40}
                className="mx-auto text-mainGreen mb-4"
              />
              <p className="text-sm text-gray-300 mb-1">{modalMessage}</p>
              <p className="text-mainGreen text-sm mb-3">
                We will reach out to you Shortly
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <button
                className="px-6 py-2 text-sm font-medium text-white bg-mainGreen rounded shadow hover:bg-green-600 focus:outline-none"
                onClick={() => setOpen(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </Modal>
      )}
      {loading && <Loading text="sending" />}
    </div>
  );
}
