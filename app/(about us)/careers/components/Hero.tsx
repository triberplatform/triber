"use client";
import Modal from "@/app/components/common/Modal";
import Loading from "@/app/loading";
import Image from "next/image";
import React, { useState } from "react";
import { useFormik } from "formik";
import { ConnectFormValues } from "@/app/type";
import * as Yup from "yup";
import { connectionRequest } from "@/app/services/dashboard";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";

export default function Hero() {
  const [isModalOpen1, setIsModalOpen1] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const applyJob = () => {
    setIsModalOpen1(!isModalOpen1);
    setIsModalOpen(true);
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
    <div className="mt-3 mb-10 text-center mx-5 lg:px-[10%]">
      <p className="lg:text-[3.2rem] text-4xl font-semibold  font-serif">
        Join Our Tribe
      </p>
      <p className="mb-3 mt-4 lg:mt-0 mx-auto lg:w-[60%]">
        At Triber, we’re more than just a team—we’re a community of innovators,{" "}
        strategists, and dreamers. Together, we’re building, and leverage our
        resources and expertise that empowers Startups, small & growing
        businesses to thrive. We’re driving entrepreneurship and economic
        development.{" "}
      </p>
      <Image src={"/assets/careers.png"} width={2000} height={20} alt="chat" />
      {isModalOpen1 && (
        <Modal>
          <div className="max-h-[90vh] lg:h-[90vh] gap-3 bg-mainBlacks  grid grid-cols-10  modal-scroll w-full">
            <div className="col-span-3 relative h-full">
              <Image
                src="/assets/valuation3.png"
                width={500}
                height={500}
                alt="hero map"
                className="object-cover absolute inset-0 w-full h-full"
              />
            </div>
            <div className="col-span-7 text-left py-5 px-10">
              <button
                onClick={() => setIsModalOpen1(!isModalOpen1)}
                className=" text-3xl text-mainGreen  float-right"
              >
                &times;
              </button>
              <p className="text-2xl font-bold font-serif">
                {" "}
                Join our <span className="text-mainGreen">Tribe</span> as a
                Business <br /> Development and Strategy Lead{" "}
              </p>
              <div className="py-5">
                <p className="text-xs font-semibold">
                  Location: <span className="text-xs font-normal">Remote</span>
                </p>
                <p className="text-xs font-semibold">
                  Employment Type:{" "}
                  <span className="text-xs font-normal">Full time</span>
                </p>
              </div>
              <p className="font-semibold font-serif text-sm py-4">
                Role Overview
              </p>
              <p className="text-xs">
                As the Business Development and Strategy Lead at Triber, you
                will play a pivotal role in shaping the future of our platform
                and the success of small businesses. You’ll be at the forefront
                of creating and executing strategies that attract users, build
                partnerships, and drive business growth. Collaborating with
                cross-functional teams, you will help position Triber as a
                trusted partner for businesses seeking funding and support.
              </p>
              <p className="font-semibold font-serif text-sm py-4">
                Key Responsibilities
              </p>
              <ul className="pb-4 list-disc text-xs pl-3">
                <li>
                  Strategic Planning: Develop and implement strategies to
                  attract, onboard, and retain small business users and
                  investors.
                </li>
                <li>
                  Partnership Development: Build and nurture relationships with
                  financial institutions, investors, and other stakeholders to
                  expand Triber’s network.
                </li>
                <li>
                  Market Analysis: Conduct research to identify industry trends,
                  market needs, and opportunities to refine and improve the
                  platform.
                </li>
                <li>
                  Fundability Assessment Tools: Oversee the enhancement of tools
                  that help businesses evaluate their readiness for funding.
                </li>
              </ul>
              <button
                onClick={applyJob}
                className="bg-mainGreen px-6 py-1 rounded text-sm my-4"
              >
                Apply
              </button>
            </div>
          </div>
        </Modal>
      )}
      ;
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
            <div className="col-span-7 py-10 px-3">
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
                      Full Name
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
                      Tell us Why you want to work with us
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
                      Phone Number
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
                          formik.setFieldValue("annualTurnOver", numericValue); // Store numeric value
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
                      Years of Experience
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
