"use client";
import BlackCard from "@/app/components/common/blackCard";
import Modal from "@/app/components/common/Modal";
import Loading from "@/app/loading";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { JobConnectForm, JobListing } from "@/app/type";
import * as Yup from "yup";
import { getJobs, jobRequest } from "@/app/services/dashboard";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";
import DocumentUpload from "@/app/components/dashboard/DocumentUpload";

// Define types for role-related data
type RoleType = "Trainee" | "Financial Analyst" | "Business Accelerator";
type ResponsibilityType = string[];

export default function OpenRoles() {
  const [isModalOpen1, setIsModalOpen1] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<RoleType>("Trainee");
  const [roleDescription, setRoleDescription] = useState<string>("");
  const [roleResponsibilities, setRoleResponsibilities] = useState<ResponsibilityType>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    const jobDetails = async (): Promise<void> => {
      try {
        const jobs = await getJobs();
        setJobs(jobs.data);
        console.log(jobs);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    jobDetails();
  }, []);

  const getRoleContent = (role: RoleType): void => {
    switch(role) {
      case "Trainee":
        setRoleDescription("As an at Triber, you will play a pivotal role in shaping the future and success of small businesses. You&apos;ll be at the forefront, playing a critical role in due diligence processes and learn first class financial analysis, documentation, and business value creation knowledge and practice in real time. you&apos;ll be working side-by-side with industry leaders, providing support. helping position businesses seeking funding and business acceleration.");
        setRoleResponsibilities([
          "Shadow senior analysts in meetings (M&A, investor calls).",
          "Supports finance teams in analyzing data, building models, and assisting with key financial processes.",
          "Conduct ratio analysis (liquidity, profitability, leverage).",
          "Support building Excel models (DCF, budgeting, forecasting).",
          "Gather market/industry data (competitor analysis, trends).",
          "Compile comparable company metrics (P/E, EV/EBITDA).",
          "Research economic conditions affecting the business.",
          "Help maintain valuation databases and benchmarking reports.",
          "Prepare presentations (PowerPoint decks for meetings).",
          "Organize financial documents and maintain databases."
        ]);
        break;
      case "Financial Analyst":
        setRoleDescription("As the financial analyst at Triber, you will play a pivotal role in shaping the future and success of small businesses. You&apos;ll be at the forefront, playing a critical role in investment decisions, mergers & acquisitions (M&A), corporate finance, and strategic planning. substantiating balance sheet, building models and company valuations, Analyzing historical financial data to project future revenue, expenses, cash flows. Developing scenario and sensitivity analyses to assess risks and opportunities. you will help position businesses seeking funding and support.");
        setRoleResponsibilities([
          "Business Modeling & Valuation analysis: conduct thorough financial models and valuation",
          "Analyzing historical financial data to project future revenue, expenses, cash flows, and profitability.",
          "Developing scenario and sensitivity analyses to assess risks and opportunities.",
          "Creating budgeting and forecasting models for internal planning.",
          "Market Analysis: Conduct research to identify industry trends, market needs, and opportunities to refine and improve SME operation and scale.",
          "Fundability Assessment Tools: Oversee the enhancement of tools that help businesses evaluate their readiness for funding."
        ]);
        break;
      case "Business Accelerator":
        setRoleDescription("As the Business Development and Strategy Lead at Triber, you will play a pivotal role in shaping the future and success of small businesses. You&apos;ll be at the forefront of creating and executing strategies, build partnerships, and driving business growth. Collaborating with cross-functional teams, you will help position businesses seeking funding and support.");
        setRoleResponsibilities([
          "Strategic Planning: Develop and implement strategies to attract, onboard, and retain small business users and investors.",
          "Partnership Development: Build and nurture relationships with financial institutions, investors, and other stakeholders to expand Triber&apos;s network.",
          "Market Analysis: Conduct research to identify industry trends, market needs, and opportunities to refine and improve the platform.",
          "Fundability Assessment Tools: Oversee the enhancement of tools that help businesses evaluate their readiness for funding."
        ]);
        break;
      default:
        setRoleDescription("");
        setRoleResponsibilities([]);
    }
  };

  const openJobModal = (role: RoleType): void => {
    setSelectedRole(role);
    getRoleContent(role);
    setIsModalOpen1(true);
  };

  const toggleModal = (): void => {
    setIsModalOpen(!isModalOpen);
  };

  const applyJob = (): void => {
    setIsModalOpen1(!isModalOpen1);
    setIsModalOpen(true);
  };

  const formik = useFormik<JobConnectForm>({
    initialValues: {
      fullName: "",
      email: "",
      phone: +234,
      yearsOfExperience: 0,
      resume: null as File | null,
      coverLetter: "",
      jobId: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.number().typeError("Phone must be a number").required("Phone is required"),
      yearsOfExperience: Yup.number().typeError("Years of Experience must be a number").required("Years of Experience is required"),
      resume: Yup.mixed().required("Resume is required"),
      coverLetter: Yup.string().required("Cover Letter is required"),
      jobId: Yup.string().required("Job Role is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setIsModalOpen(false);
      try {
        const response = await jobRequest(values);

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
      } catch {
        setModalMessage("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-white py-12 text-black px-5 lg:px-[7%]">
      <p className="lg:text-4xl text-3xl font-semibold font-serif">Open Roles</p>

      {/* Buttons to open detail modal */}
      <div className="flex gap-5 mt-4 mb-7">
        <button
          onClick={() => openJobModal("Trainee")}
          className="lg:px-6 px-2 py-2 text-sm rounded border border-black text-black hover:bg-mainGreen hover:text-white hover:border-mainGreen"
        >
          Trainee
        </button>
        <button
          onClick={() => openJobModal("Financial Analyst")}
          className="lg:px-6 px-2 text-sm py-2 rounded border border-black text-black hover:bg-mainGreen hover:text-white hover:border-mainGreen"
        >
          Financial Analyst
        </button>
        <button
          onClick={() => openJobModal("Business Accelerator")}
          className="lg:px-6 px-2 py-2 text-sm rounded border border-black text-black hover:bg-mainGreen hover:text-white hover:border-mainGreen"
        >
          Business Accelerator
        </button>
      </div>

      {/* Always displayed cards */}
      <div className="grid lg:grid-cols-9 mt-8 gap-8">
        <BlackCard
          heading={"Trainee"}
          body={
            "Are you a talented undergrad seeking a transformative internship? Apply now to join our firm. Gain hands-on experience, develop professional skills, and network with industry leaders and kickstart your career."
          }
        />
        <BlackCard
          heading={"Financial Analyst"}
          body={
            "If you&apos;re a seasoned financial professional looking to leverage your expertise to drive business growth. "
          }
        />
        <BlackCard
          heading={"Business Accelerator"}
          body={
            "Join our team of business accelerators! We&apos;re looking for partners to help support small businesses and startups. Collaborating, leveraging resources and expertise to drive entrepreneurship and economic development."
          }
        />
      </div>

      {/* First Modal - Role Details */}
      {isModalOpen1 && (
        <Modal>
          <div className="max-h-[90vh] lg:h-[90vh] gap-3 bg-mainBlacks  text-white lg:grid grid-cols-10  modal-scroll w-full">
            <div className="lg:col-span-3 lg:block hidden relative h-full">
              <Image
                src="/assets/valuation3.png"
                width={500}
                height={500}
                alt="hero map"
                className="object-cover absolute inset-0 w-full h-full"
              />
            </div>
            <div className="col-span-7 text-left py-5 px-3 lg:px-10">
              <button
                onClick={() => setIsModalOpen1(!isModalOpen1)}
                className=" text-3xl text-mainGreen  float-right"
              >
                &times;
              </button>
              <p className="text-2xl font-bold font-serif">
                {" "}
                Join our <span className="text-mainGreen">Tribe</span> as a
                <br /> {selectedRole}{" "}
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
                {roleDescription}
              </p>
              <p className="font-semibold font-serif text-sm py-4">
                Key Responsibilities
              </p>
              <ul className="pb-4 list-disc text-xs pl-3">
                {roleResponsibilities.map((responsibility, index) => (
                  <li key={index}>
                    {responsibility}
                  </li>
                ))}
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

      {/* Second Modal - Application Form */}
      {isModalOpen && (
        <Modal>
          <div className="max-h-[85vh] lg:h-[90vh] gap-3 bg-mainBlacks   lg:grid grid-cols-10  modal-scroll w-full">
            <div className="col-span-3 relative hidden lg:block h-full">
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
              <p className="lg:text-2xl text-xl text-left font-semibold mb-2 font-serif text-white">
                Join our Tribe as a
                <span className="text-mainGreen"> {selectedRole}</span>
              </p>
              <form
                onSubmit={formik.handleSubmit}
                className="flex-col flex mt-7 lg:space-y-5 text-left text-white font-serif"
              >
                <div className="lg:grid grid-cols-2 space-y-5 lg:space-y-0 gap-5">
                  <div className="col-span-1 flex lg:gap-2 gap-1 flex-col">
                    <label
                      htmlFor="businessName"
                      className="font-sansSerif text-xs"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your Full Name"
                      className="lg:w-full text-[0.8rem] bg-mainBlacks py-2 rounded border-gray-500 px-5 focus:outline-none border focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fullName}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.fullName}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 flex lg:gap-2 gap-1 flex-col">
                    <label
                      htmlFor="businessRegistration"
                      className="font-sansSerif text-xs"
                    >
                      Job Role
                    </label>
                    <select
                      id="businessRegistration"
                      name="jobId"
                      className="lg:w-full text-[0.8rem] bg-mainBlacks border-gray-500 border py-[0.58rem] rounded px-5 focus:outline-none focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.jobId}
                    >
                      <option value="">Select Job Type</option>
                      {jobs?.map((job) => (
                        <option key={job.id} value={job.publicId}>
                          {job.title}
                        </option>
                      ))}
                    </select>

                    {formik.touched.jobId && formik.errors.jobId && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.jobId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:grid grid-cols-2 mt-5 lg:mt-0 space-y-5 lg:space-y-0 gap-5">
                  <div className="col-span-1 flex gap-1 flex-col">
                    <label
                      htmlFor="yearsOfExperience"
                      className="font-sansSerif text-xs"
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      placeholder="e.g., 5"
                      className="lg:w-full text-[0.8rem] bg-mainBlacks border-gray-500 border py-2 rounded px-5 focus:outline-none focus:ring-0"
                      value={formik.values.yearsOfExperience || ""}
                      onChange={(e) => {
                        const numericValue = Number(e.target.value);
                        if (!isNaN(numericValue)) {
                          formik.setFieldValue("yearsOfExperience", numericValue);
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.yearsOfExperience &&
                      formik.errors.yearsOfExperience && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.yearsOfExperience}
                        </div>
                      )}
                  </div>
                  <div className="col-span-1 flex gap-1 flex-col">
                    <label htmlFor="phone" className="font-sansSerif text-xs">
                      Phone
                    </label>
                    <input
                      type="number"
                      name="phone"
                      placeholder="e.g., +234 813 095 4077"
                      className="lg:w-full text-[0.8rem] bg-mainBlacks border-gray-500 border py-2 rounded px-5 focus:outline-none focus:ring-0"
                      value={formik.values.phone || ""}
                      onChange={(e) => {
                        const numericValue = Number(e.target.value);
                        if (!isNaN(numericValue)) {
                          formik.setFieldValue(
                            "phone",
                            numericValue
                          );
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="text-red-500 text-xs">
                        {formik.errors.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:grid grid-cols-2 mt-5 lg:mt-0 gap-5">
                  <div className="col-span-1 mb-5 lg:mb-0 flex gap-1 flex-col">
                    <label htmlFor="email" className="font-sansSerif text-xs">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Contact Email"
                      className="bg-mainBlacks text-[0.8rem] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-xs">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <DocumentUpload
                    label="Upload Resume/cv"
                    name="resume"
                    onChange={(file: File | null) => formik.setFieldValue("resume", file)}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="lg:grid grid-cols-2 mt-5 lg:mt-0 gap-5">
                  <div className="col-span-2 flex gap-1 flex-col">
                    <label
                      htmlFor="coverLetter"
                      className="font-sansSerif text-xs"
                    >
                      Tell us Why you want to work with us
                    </label>
                    <textarea
                      name="coverLetter"
                      rows={4}
                      placeholder="Cover Letter"
                      className="lg:w-full bg-mainBlacks text-[0.8rem] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.coverLetter}
                    />
                    {formik.touched.coverLetter &&
                      formik.errors.coverLetter && (
                        <div className="text-red-500 text-xs">
                          {formik.errors.coverLetter}
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

      {/* Third Modal - Success/Error Message */}
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