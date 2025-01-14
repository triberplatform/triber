"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ConnectFormValues } from "@/app/type";
import { connectionRequest } from "@/app/services/dashboard";
import Loading from "@/app/loading";
import Modal from "../dashboard/Modal";
import { AiOutlineClose, AiOutlineInfoCircle } from "react-icons/ai";

const ConnectForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, showModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

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
      annualTurnOver: Yup.number().required("Annual Turnover is required"),
      fundingRequirement: Yup.number().required(
        "Funding Requirement is required"
      ),
      description: Yup.string().required("Description is required"),
      contactEmail: Yup.string()
        .email("Invalid email address")
        .required("Contact Email is required"),
    }),
    onSubmit: (values,{resetForm}) => {
      handleSubmit(values);
      resetForm();
    },
  });
  const handleSubmit = async (values: ConnectFormValues) => {
    try {
      setLoading(true);

      const response = await connectionRequest(values);

      if (!response.ok) {
        const errorData = await response.json();
        setModalMessage(errorData.error);
        showModal(true);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setModalMessage(data.message);
        showModal(true);
     
      }
    } catch {
      setModalMessage("An error occured");
      showModal(true);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="map-bgs py-20">
      <div className="px-[10%]">
        <p className="lg:text-4xl text-2xl font-semibold mb-2 font-serif text-white">
          Connect Directly with our Partners
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="px-[10%] space-y-6 py-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="businessName" className="font-sansSerif text-sm">
            Business Name
          </label>
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            className="lg:w-[50%] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.businessName}
          />
          {formik.touched.businessName && formik.errors.businessName ? (
            <div className="text-red-500">{formik.errors.businessName}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contactEmail" className="font-sansSerif text-sm">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            className="lg:w-[50%] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contactEmail}
          />
          {formik.touched.contactEmail && formik.errors.contactEmail ? (
            <div className="text-red-500">{formik.errors.contactEmail}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="businessRegistration"
            className="font-sansSerif text-sm"
          >
            Business Registration
          </label>
          <select
                    id="businessRegistration"
                    name="businessRegistration"
                    className="lg:w-[50%] border-gray-500 border bg-black py-[0.7rem] rounded px-5 focus:outline-none focus:ring-0"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.businessRegistration}
                  >
                    <option value="">Select Company Type</option>
                    <option value="unregistered">Unregistered Business</option>
                    <option value="llc">Limited Liability Company</option>
                    <option value="soleProprietorship">
                      Sole Proprietorship
                    </option>
                  </select>
          {formik.touched.businessRegistration &&
          formik.errors.businessRegistration ? (
            <div className="text-red-500">
              {formik.errors.businessRegistration}
            </div>
          ) : null}
        </div>

        <div className=" flex flex-col gap-2">
        <label htmlFor="annualTurnOver" className="font-sansSerif text-sm">
        Annual Turnover
      </label>
      <input
        type="text"
        name="annualTurnOver"
        placeholder="Annual Turnover"
        className="lg:w-[50%] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
        onChange={(e) => {
          const value = parseFloat(e.target.value.replace(/,/g, ''));
          formik.setFieldValue('annualTurnOver', isNaN(value) ? '' : value);
        }}
        onBlur={formik.handleBlur}
        value={formatNumber(formik.values.annualTurnOver)}
      />
      {formik.touched.annualTurnOver && formik.errors.annualTurnOver ? (
        <div>{formik.errors.annualTurnOver}</div>
      ) : null}

        </div>

        <div className="flex flex-col gap-2">
        <label htmlFor="fundingRequirement" className="font-sansSerif text-sm">
        Funding Requirement
      </label>
      <input
        type="text"
        name="fundingRequirement"
        placeholder="Funding Requirement"
        className="lg:w-[50%] border-gray-500 border py-3 rounded px-5 focus:outline-none focus:ring-0"
        onChange={(e) => {
          const value = parseFloat(e.target.value.replace(/,/g, ''));
          formik.setFieldValue('fundingRequirement', isNaN(value) ? '' : value);
        }}
        onBlur={formik.handleBlur}
        value={formatNumber(formik.values.fundingRequirement)}
      />
      {formik.touched.fundingRequirement && formik.errors.fundingRequirement ? (
        <div>{formik.errors.fundingRequirement}</div>
      ) : null}

        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-sansSerif text-sm">
            Brief Business Description
          </label>
          <textarea
            rows={4}
            name="description"
            placeholder="Business Description"
            className="lg:w-[50%] border-gray-500 border bg-black py-3 rounded px-5 focus:outline-none focus:ring-0"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500">{formik.errors.description}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-mainGreen px-7 py-2 mt-7 rounded-lg text-sm w-32"
        >
          Apply
        </button>
      </form>
      {modal && (
        <Modal>
          <div className="p-8 bg-black text-white rounded-lg shadow-md relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
              onClick={() => showModal(false)}
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
              <p className="text-mainGreen text-sm mb-3">We will reach out to you Shortly</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <button
                className="px-6 py-2 text-sm font-medium text-white bg-mainGreen rounded shadow hover:bg-green-600 focus:outline-none"
                onClick={() => showModal(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </Modal>
      )}
      {loading && <Loading text="Loading" />}
    </div>
  );
};

export default ConnectForm;
