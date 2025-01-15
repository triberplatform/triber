"use client";
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

export default function Hero() {
  const [isModalOpen1, setIsModalOpen1] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    const jobDetails = async () => {
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const applyJob = () => {
    setIsModalOpen1(!isModalOpen1);
    setIsModalOpen(true);
  };

  const formik = useFormik<JobConnectForm>({
    initialValues: {
      fullName: "",
      email: "",
      phone: 0,
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
      } catch  {
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
              <p className="lg:text-2xl text-xl text-left font-semibold mb-2 font-serif text-white">
                Join our Tribe as a
                <span className="text-mainGreen"> Business</span> Directly{" "}
                <br /> Development and Strategy Lead
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
                  <div className="col-span-1 flex lg:gap-2 flex-col">
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

                <div className="lg:grid grid-cols-2 space-y-5 lg:space-y-0 gap-5">
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
                  <div className="col-span-1 flex gap-1 flex-col">
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
                    onChange={(file) => formik.setFieldValue("resume", file)}
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
