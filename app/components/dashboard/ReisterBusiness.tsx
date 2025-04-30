"use client";

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import OptionInput from "./OptionInput";
import { registerBusiness } from "@/app/services/dashboard";
import { RegisterBusinessPayload } from "@/app/type";
import Modal from "./Modal";
import { FaCheckDouble } from "react-icons/fa";
import Loading from "@/app/loading";
import DocumentUpload from "./DocumentUpload";
import { Industry } from "@/app/type";

export default function RegisterBusiness() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorModal, showErrorModal] = useState(false);
  const [modal, showModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const [id, setId] = useState(null);
  const [stage, setStage] = useState("");

  const validationSchema = Yup.object().shape({
    businessName: Yup.string().required("Business Name is required"),
    businessPhone: Yup.string()
      .required("Business Phone is required")
      .matches(/^\+234\d{10}$/, "Must be a valid phone number"),
    businessEmail: Yup.string()
      .email("Invalid email address")
      .required("Business Email is required"),
    businessStatus: Yup.string().required("Business Status is required"),
    businessStage: Yup.string().required("Business Stage is required"),
    interestedIn: Yup.string().required("This field is required"),
    industry: Yup.string().required("Industry is required"),
    businessLegalEntity: Yup.string().required("Legal Entity Type is required"),
    description: Yup.string().required("Description is required"),
    reportedSales: Yup.string().required("Reported Sales is required"),
    numOfEmployees: Yup.string().required("Number of Employees is required"),
    yearEstablished: Yup.number()
      .max(new Date().getFullYear(), "Year cannot be in the future")
      .required("Year Established is required"),
    location: Yup.string().required("Location is required"),
    assets: Yup.string().required("Assets description is required"),
    logo: Yup.mixed()
      .nullable()
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // Allow null if no file
        const file = value as File;
        return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      }),
  });

  const initialValues = {
    businessName: "",
    businessPhone: "",
    businessEmail: "",
    businessStatus: "",
    interestedIn: "",
    industry: "",
    businessStage: "",
    businessLegalEntity: "",
    description: "",
    reportedSales: "",
    numOfEmployees: "",
    yearEstablished: 0,
    location: "",
    assets: "",
    logo: null as File | null,
  };
  const handleRefreshRedirect = () => {
    window.location.href = "/dashboard"; // Replace with the desired path
  };

  const handleRefreshRedirectFund = (id: string) => {
    if (stage === "SME") {
      window.location.href = `/dashboard/fundability-test/${id}`;
    } else {
      window.location.href = `/dashboard/fundability-test/select-startup/${id}`;
    }
  };
  const handleNext = () => {
    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: RegisterBusinessPayload) => {
    try {
      setLoading(true);
      // Set stage directly from form values
      setStage(values.businessStage);

      const token = localStorage.getItem("token");
      const response = await registerBusiness(values, token ?? "");

      if (response.ok) {
        const data = await response.json();
        setId(data.data.publicId);
        // You can remove this line if you want to use the form value directly
        // setStage(data.data.businessStage)
        setTimeout(() => {
          showModal(true);
        }, 1000);
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

  const renderStepContent = (
    formikProps: FormikProps<RegisterBusinessPayload>
  ) => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid lg:grid-cols-2 lg:bg-mainBlack lg:gap-5 lg:pb-32 lg:py-8 py-8 gap-5 lg:px-5">
            <FormInput
              label="Business Name"
              name="businessName"
              placeholder="Business Name"
              value={formikProps.values.businessName}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.businessName}
              touched={formikProps.touched.businessName}
            />
            <FormInput
              label="Business Phone Number"
              name="businessPhone"
              placeholder="+2348000000000"
              value={formikProps.values.businessPhone}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.businessPhone}
              touched={formikProps.touched.businessPhone}
            />
            <FormInput
              label="Business Email"
              name="businessEmail"
              placeholder="Business Email"
              value={formikProps.values.businessEmail}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              error={formikProps.errors.businessEmail}
              touched={formikProps.touched.businessEmail}
            />
            <OptionInput
              label="Business Status"
              name="businessStatus"
              options={[
                {
                  value: "REGISTERED",
                  label: "Registered",
                },
                {
                  value: "UNREGISTERED",
                  label: "Unregistered",
                },
                {
                  value: "PENDING",
                  label: "Pending",
                },
              ]}
              value={formikProps.values.businessStatus}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.businessStatus}
              touched={formikProps.touched.businessStatus}
            />
            <OptionInput
              label="Business Stage"
              name="businessStage"
              options={[
                { value: "SME", label: "SME" },
                { value: "Startup", label: "Start up" },
              ]}
              value={formikProps.values.businessStage}
              onBlur={formikProps.handleBlur}
              onChange={formikProps.handleChange}
              error={formikProps.errors.businessStage}
              touched={formikProps.touched.businessStage}
            />
          </div>
        );
        
      case 1:
        return (
          <div className="grid lg:grid-cols-2 lg:bg-mainBlack lg:gap-5 py-8   lg:py-8 lg:px-5">
            {/* Left Column */}
            <div className="space-y-5 ">
              <OptionInput
                label="You are interested in"
                name="interestedIn"
                options={[
                  {
                    value: "FULL_SALE_OF_BUSINESS",
                    label: "Full Sale of Business",
                  },
                  { value: "EQUITY_INVESTMENT", label: "Equity Investments" },
                  { value: "DEBT_FUNDING", label: "Debt Funding" },
                  {
                    value: "SELL_OR_LEASE_OF_BUSINESS_ASSETS",
                    label: "Sell or Lease Business Assets",
                  },
                ]}
                value={formikProps.values.interestedIn}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.interestedIn}
                touched={formikProps.touched.interestedIn}
              />
              <OptionInput
                label="Industry"
                name="industry"
                options={[
                  { value: Industry.AGRICULTURE, label: "Agriculture" },
                  {
                    value: Industry.AUTOMOTIVE_AUTO_BODY,
                    label: "Automotive - Auto Body",
                  },
                  {
                    value: Industry.AUTOMOTIVE_REPAIR_PARTS_SERVICES,
                    label: "Automotive - Repair, Parts & Services",
                  },
                  {
                    value: Industry.AUTOMOTIVE_DEALERS,
                    label: "Automotive - Dealers",
                  },
                  {
                    value: Industry.AUTOMOTIVE_CAR_WASH,
                    label: "Automotive - Car Wash",
                  },
                  {
                    value: Industry.AUTOMOTIVE_GASOLINE_SERVICE_STATIONS,
                    label: "Automotive - Gasoline Service Stations",
                  },
                  {
                    value: Industry.AUTOMOTIVE_WRECKING_YARD,
                    label: "Automotive - Wrecking Yard",
                  },
                  {
                    value: Industry.CONSTRUCTION_BUILDING,
                    label: "Construction - Building",
                  },
                  {
                    value: Industry.CONSTRUCTION_HEAVY,
                    label: "Construction - Heavy",
                  },
                  {
                    value: Industry.CONSTRUCTION_SPECIAL_TRADES,
                    label: "Construction - Special Trades",
                  },
                  {
                    value: Industry.ENTERTAINMENT_FILM_PRODUCTION,
                    label: "Entertainment - Film Production",
                  },
                  {
                    value: Industry.HEALTHCARE_MEDICAL_DENTAL,
                    label: "Healthcare - Medical & Dental",
                  },
                  {
                    value: Industry.HEALTHCARE_PRODUCTS_SUPPLIES,
                    label: "Healthcare - Products & Supplies",
                  },
                  {
                    value: Industry.HEALTHCARE_TRANSPORTATION,
                    label: "Healthcare - Transportation",
                  },
                  {
                    value: Industry.HEALTHCARE_PHARMACIES_DRUG_STORES,
                    label: "Healthcare - Pharmacies & Drug Stores",
                  },
                  {
                    value: Industry.MANUFACTURING_APPAREL_FABRICS,
                    label: "Manufacturing - Apparel & Fabrics",
                  },
                  {
                    value: Industry.MANUFACTURING_AVIATION_AEROSPACE,
                    label: "Manufacturing - Aviation & Aerospace",
                  },
                  {
                    value: Industry.MANUFACTURING_CHEMICALS,
                    label: "Manufacturing - Chemicals",
                  },
                  {
                    value: Industry.MANUFACTURING_ELECTRONIC_ELECTRICAL,
                    label: "Manufacturing - Electronic & Electrical",
                  },
                  {
                    value: Industry.MANUFACTURING_FABRICATED_METAL,
                    label: "Manufacturing - Fabricated Metal",
                  },
                  {
                    value: Industry.MANUFACTURING_FOOD_PRODUCTS,
                    label: "Manufacturing - Food Products",
                  },
                  {
                    value: Industry.MANUFACTURING_FURNITURE_FIXTURES,
                    label: "Manufacturing - Furniture & Fixtures",
                  },
                  {
                    value: Industry.MANUFACTURING_INDUSTRIAL_MACHINERY,
                    label: "Manufacturing - Industrial Machinery",
                  },
                  {
                    value: Industry.MANUFACTURING_LEATHER_PRODUCTS,
                    label: "Manufacturing - Leather Products",
                  },
                  {
                    value: Industry.MANUFACTURING_LUMBER_WOOD,
                    label: "Manufacturing - Lumber & Wood",
                  },
                  {
                    value: Industry.MANUFACTURING_MEASURING_INSTRUMENTS,
                    label: "Manufacturing - Measuring Instruments",
                  },
                  {
                    value: Industry.MANUFACTURING_MISCELLANEOUS,
                    label: "Manufacturing - Miscellaneous",
                  },
                  {
                    value: Industry.MANUFACTURING_PAPER_PRODUCTS,
                    label: "Manufacturing - Paper Products",
                  },
                  {
                    value: Industry.MANUFACTURING_PERSONAL_CARE,
                    label: "Manufacturing - Personal Care",
                  },
                  {
                    value: Industry.MANUFACTURING_PETROLEUM_REFINING,
                    label: "Manufacturing - Petroleum Refining",
                  },
                  {
                    value: Industry.MANUFACTURING_PRIMARY_METAL,
                    label: "Manufacturing - Primary Metal",
                  },
                  {
                    value: Industry.MANUFACTURING_PRINTING_PUBLISHING,
                    label: "Manufacturing - Printing & Publishing",
                  },
                  {
                    value: Industry.MANUFACTURING_RUBBER_PLASTIC,
                    label: "Manufacturing - Rubber & Plastic",
                  },
                  {
                    value: Industry.MANUFACTURING_STONE_CLAY_GLASS,
                    label: "Manufacturing - Stone, Clay & Glass",
                  },
                  {
                    value: Industry.MANUFACTURING_TEXTILE,
                    label: "Manufacturing - Textile",
                  },
                  {
                    value: Industry.MANUFACTURING_TOBACCO,
                    label: "Manufacturing - Tobacco",
                  },
                  {
                    value: Industry.MANUFACTURING_TRANSPORTATION_EQUIPMENT,
                    label: "Manufacturing - Transportation Equipment",
                  },
                  {
                    value: Industry.MANUFACTURING_VINYL_PRODUCTS,
                    label: "Manufacturing - Vinyl Products",
                  },
                  { value: Industry.MINING, label: "Mining" },
                  {
                    value: Industry.RESTAURANTS_BARS_TAVERNS,
                    label: "Restaurants - Bars & Taverns",
                  },
                  {
                    value: Industry.RESTAURANTS_COFFEE_SHOP,
                    label: "Restaurants - Coffee Shop",
                  },
                  {
                    value: Industry.RESTAURANTS_OTHER_EATING_DRINKING,
                    label: "Restaurants - Other Eating & Drinking",
                  },
                  {
                    value: Industry.RESTAURANTS_RESTAURANT,
                    label: "Restaurants - Restaurant",
                  },
                  {
                    value: Industry.RETAIL_ATM_MACHINES,
                    label: "Retail - ATM Machines",
                  },
                  {
                    value: Industry.RETAIL_APPAREL_ACCESSORY,
                    label: "Retail - Apparel & Accessory",
                  },
                  {
                    value: Industry.RETAIL_BEAUTY_SUPPLIES,
                    label: "Retail - Beauty Supplies",
                  },
                  {
                    value: Industry.RETAIL_BICYCLE_SHOP,
                    label: "Retail - Bicycle Shop",
                  },
                  {
                    value: Industry.RETAIL_BUILDING_MATERIALS_HOME_GARDEN,
                    label: "Retail - Building Materials & Home Garden",
                  },
                  {
                    value: Industry.RETAIL_CELL_PHONES,
                    label: "Retail - Cell Phones",
                  },
                  {
                    value: Industry.RETAIL_COIN_LAUNDRY,
                    label: "Retail - Coin Laundry",
                  },
                  {
                    value: Industry.RETAIL_CONVENIENCE_STORES,
                    label: "Retail - Convenience Stores",
                  },
                  {
                    value: Industry.RETAIL_FLORIST_GIFTS,
                    label: "Retail - Florist & Gifts",
                  },
                  {
                    value: Industry.RETAIL_FURNITURE,
                    label: "Retail - Furniture",
                  },
                  {
                    value: Industry.RETAIL_GENERAL_MERCHANDISE,
                    label: "Retail - General Merchandise",
                  },
                  {
                    value: Industry.RETAIL_GYM_FITNESS,
                    label: "Retail - Gym & Fitness",
                  },
                  {
                    value: Industry.RETAIL_HOME_FURNISHINGS,
                    label: "Retail - Home Furnishings",
                  },
                  {
                    value: Industry.RETAIL_JEWELRY_DESIGN_SALES,
                    label: "Retail - Jewelry Design & Sales",
                  },
                  {
                    value: Industry.RETAIL_LIQUOR_STORES,
                    label: "Retail - Liquor Stores",
                  },
                  {
                    value: Industry.RETAIL_MARINE_DEALERS_EQUIPMENT,
                    label: "Retail - Marine Dealers & Equipment",
                  },
                  {
                    value: Industry.RETAIL_MISCELLANEOUS,
                    label: "Retail - Miscellaneous",
                  },
                  {
                    value: Industry.RETAIL_FOOD_STORES,
                    label: "Retail - Food Stores",
                  },
                  {
                    value: Industry.RETAIL_PET_SHOPS_SUPPLIES,
                    label: "Retail - Pet Shops & Supplies",
                  },
                  {
                    value: Industry.RETAIL_POSTAL_CENTERS,
                    label: "Retail - Postal Centers",
                  },
                  {
                    value: Industry.RETAIL_SUPERMARKETS,
                    label: "Retail - Supermarkets",
                  },
                  {
                    value: Industry.RETAIL_TOBACCO_PRODUCTS,
                    label: "Retail - Tobacco Products",
                  },
                  {
                    value: Industry.RETAIL_VENDING_MACHINES,
                    label: "Retail - Vending Machines",
                  },
                  {
                    value: Industry.RETAIL_VIDEO_RENTALS,
                    label: "Retail - Video Rentals",
                  },
                  {
                    value: Industry.SERVICES_ACCOUNTING,
                    label: "Services - Accounting",
                  },
                  {
                    value: Industry.SERVICES_AGENTS_BROKERS,
                    label: "Services - Agents & Brokers",
                  },
                  {
                    value: Industry.SERVICES_AMUSEMENT_RECREATION,
                    label: "Services - Amusement & Recreation",
                  },
                  {
                    value: Industry.SERVICES_BEAUTY_BARBER,
                    label: "Services - Beauty & Barber",
                  },
                  {
                    value: Industry.SERVICES_BUSINESS,
                    label: "Services - Business",
                  },
                  {
                    value: Industry.SERVICES_COMPUTER_SOFTWARE,
                    label: "Services - Computer Software",
                  },
                  {
                    value: Industry.SERVICES_DRY_CLEANING_LAUNDRY,
                    label: "Services - Dry Cleaning & Laundry",
                  },
                  {
                    value: Industry.SERVICES_EDUCATIONAL,
                    label: "Services - Educational",
                  },
                  {
                    value: Industry.SERVICES_ENGINEERING,
                    label: "Services - Engineering",
                  },
                  {
                    value: Industry.SERVICES_FINANCE_BANKING_LOANS,
                    label: "Services - Finance, Banking & Loans",
                  },
                  {
                    value: Industry.SERVICES_FREIGHT_MOVING,
                    label: "Services - Freight & Moving",
                  },
                  {
                    value: Industry.SERVICES_HOTELS_LODGING,
                    label: "Services - Hotels & Lodging",
                  },
                  { value: Industry.SERVICES_IT, label: "Services - IT" },
                  {
                    value: Industry.SERVICES_INSURANCE,
                    label: "Services - Insurance",
                  },
                  {
                    value: Industry.SERVICES_JANITORIAL_CARPET_CLEANING,
                    label: "Services - Janitorial & Carpet Cleaning",
                  },
                  {
                    value: Industry.SERVICES_JEWELRY_REPAIR,
                    label: "Services - Jewelry Repair",
                  },
                  {
                    value: Industry.SERVICES_LANDSCAPING_YARD,
                    label: "Services - Landscaping & Yard",
                  },
                  { value: Industry.SERVICES_LEGAL, label: "Services - Legal" },
                  {
                    value: Industry.SERVICES_LOCAL_PASSENGER_TRANSPORTATION,
                    label: "Services - Local Passenger Transportation",
                  },
                  {
                    value: Industry.SERVICES_MAGAZINE,
                    label: "Services - Magazine",
                  },
                  {
                    value: Industry.SERVICES_MARINE_REPAIR,
                    label: "Services - Marine Repair",
                  },
                  {
                    value: Industry.SERVICES_MEDIA_COMMUNICATIONS_ADVERTISING,
                    label: "Services - Media, Communications & Advertising",
                  },
                  {
                    value: Industry.SERVICES_MEMBERSHIP_ORGANIZATIONS,
                    label: "Services - Membership Organizations",
                  },
                  {
                    value: Industry.SERVICES_MISCELLANEOUS_REPAIR,
                    label: "Services - Miscellaneous Repair",
                  },
                  {
                    value: Industry.SERVICES_MUSEUMS_ART_GALLERIES,
                    label: "Services - Museums & Art Galleries",
                  },
                  {
                    value: Industry.SERVICES_OTHER_BUSINESS,
                    label: "Services - Other Business",
                  },
                  {
                    value: Industry.SERVICES_OTHER_MISCELLANEOUS,
                    label: "Services - Other Miscellaneous",
                  },
                  {
                    value: Industry.SERVICES_OTHER_PERSONAL,
                    label: "Services - Other Personal",
                  },
                  {
                    value: Industry.SERVICES_OTHER_TRAVEL_TRANSPORTATION,
                    label: "Services - Other Travel & Transportation",
                  },
                  {
                    value: Industry.SERVICES_PET_CARE_GROOMING,
                    label: "Services - Pet Care & Grooming",
                  },
                  {
                    value: Industry.SERVICES_SOCIAL,
                    label: "Services - Social",
                  },
                  {
                    value: Industry.SERVICES_STAFFING,
                    label: "Services - Staffing",
                  },
                  {
                    value: Industry.SERVICES_STORAGE_WAREHOUSING,
                    label: "Services - Storage & Warehousing",
                  },
                  {
                    value: Industry.SERVICES_TANNING_SALONS,
                    label: "Services - Tanning Salons",
                  },
                  {
                    value: Industry.SERVICES_TRAVEL_AGENCIES,
                    label: "Services - Travel Agencies",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_B2B,
                    label: "Software Technology - B2B",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_B2C,
                    label: "Software Technology - B2C",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_DOMAIN_WEBSITE,
                    label: "Software Technology - Domain & Website",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_GENERAL_INTERNET,
                    label: "Software Technology - General Internet",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_ISP_ASP,
                    label: "Software Technology - ISP & ASP",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_SOFTWARE,
                    label: "Software Technology - Software",
                  },
                  {
                    value: Industry.SOFTWARE_TECHNOLOGY_WEB_DESIGN,
                    label: "Software Technology - Web Design",
                  },
                  { value: Industry.UTILITIES, label: "Utilities" },
                  {
                    value: Industry.WHOLESALE_DISTRIBUTION_DURABLE,
                    label: "Wholesale Distribution - Durable",
                  },
                  {
                    value: Industry.WHOLESALE_DISTRIBUTION_NON_DURABLE,
                    label: "Wholesale Distribution - Non-Durable",
                  },
                  { value: Industry.ECOMMERCE, label: "E-Commerce" },
                  { value: Industry.OTHER, label: "Other" },
                ]}
                value={formikProps.values.industry}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.industry}
                touched={formikProps.touched.industry}
              />
              <OptionInput
                label="Select business legal entity type"
                name="businessLegalEntity"
                options={[
                  {
                    value: "PRIVATE_LIABILITY_COMPANY",
                    label: "Private Liability Company",
                  },
                  {
                    value: "LIMITED_LIABILITY_COMPANY",
                    label: "Limited Liability Company",
                  },
                  {
                    value: "PUBLIC_LIMITED_COMPANY",
                    label: "Public Limited Company",
                  },
                  {
                    value: "GENERAL_PARTNERSHIP",
                    label: "General Partnership",
                  },
                  {
                    value: "SOLE_PROPRIETORSHIP",
                    label: "Sole Proprietorship",
                  },
                ]}
                value={formikProps.values.businessLegalEntity}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.businessLegalEntity}
                touched={formikProps.touched.businessLegalEntity}
              />
              <FormInput
                label="Describe the business in a single line"
                name="description"
                placeholder="e.g., Public company for sale in Lagos, Nigeria"
                value={formikProps.values.description}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.description}
                touched={formikProps.touched.description}
              />

              <FormInput
                label="Describe your facility such as built-up area, number of floors, rental/lease details"
                name="assets"
                placeholder="e.g., 5000 sqft, 2 floors, leased property"
                value={formikProps.values.assets}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.assets}
                touched={formikProps.touched.assets}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5 mt-5 lg:mt-0">
              <OptionInput
                label="How many employees does the business have?"
                name="numOfEmployees"
                options={[
                  { value: "LESS_THAN_10", label: "Less than 10" },
                  { value: "BETWEEN_10_AND_50", label: "10-50" },
                  { value: "BETWEEN_50_AND_100", label: "50-100" },
                  { value: "BETWEEN_100_AND_500", label: "100-500" },
                  { value: "BETWEEN_500_AND_1000", label: "500-1000" },
                  { value: "OVER_1000", label: "Over 1000" },
                ]}
                value={formikProps.values.numOfEmployees}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.numOfEmployees}
                touched={formikProps.touched.numOfEmployees}
              />
              <FormInput
                label="When was the business established?"
                name="yearEstablished"
                type="number"
                placeholder="e.g., 2020"
                value={formikProps.values.yearEstablished}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.yearEstablished}
                touched={formikProps.touched.yearEstablished}
              />
              <FormInput
                label="Where is the business located / headquartered?"
                name="location"
                placeholder="e.g., Lagos"
                value={formikProps.values.location}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.location}
                touched={formikProps.touched.location}
              />
              <FormInput
                label="At present, what is your average monthly sales?"
                name="reportedSales"
                placeholder="10,000,000"
                value={
                  formikProps.values.reportedSales !== undefined &&
                  formikProps.values.reportedSales !== null
                    ? formikProps.values.reportedSales
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // Format with commas
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                  const numericValue = Number(rawValue); // Convert to number
                  if (!isNaN(numericValue)) {
                    formikProps.setFieldValue("reportedSales", numericValue); // Store numeric value
                  }
                }}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.reportedSales}
                touched={formikProps.touched.reportedSales}
              />
              <DocumentUpload
                label="Logo"
                name="logo"
                onChange={(file) => formikProps.setFieldValue("logo", file)}
                onBlur={formikProps.handleBlur}
                error={formikProps.errors.logo}
                touched={formikProps.touched.logo}
                accept="application/pdf, image/*"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-11 gap-4 font-sansSerif">
      <div className="col-span-3 map-bg lg:pt-12 py-5 lg:pb-36">
        <p className="lg:text-3xl font-serif text-2xl mb-4">
          Register a Business
        </p>
        <p className="lg:text-sm text-xs">
          Information entered here is displayed publicly to match you with the
          right set of investors and buyers. Do not mention business
          name/information which can identify the business.
        </p>
      </div>
      <div className="col-span-8">
        <div className="flex gap-5 justify-between lg:justify-normal text-sm lg:text-base lg:gap-7">
          <p
            className={`cursor-pointer ${
              currentStep === 0 ? "border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(0)}
          >
            Confidential Information
          </p>
          <p
            className={`cursor-pointer ${
              currentStep === 1 ? " border-b-2  border-mainGreen" : ""
            }`}
            onClick={() => setCurrentStep(1)}
          >
            Business Information
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {(formikProps) => (
            <Form>
              <div>
                {renderStepContent(formikProps)}
                <div className="flex justify-between lg:mt-4">
                  <button
                    className={`px-4 py-2 text-white bg-gray-500 rounded ${
                      currentStep === 0 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  <button
                    className={`px-4 py-2 text-white bg-mainGreen rounded ${
                      currentStep === 2 && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default form submission behavior
                      if (currentStep === 1) {
                        if (Object.keys(formikProps.errors).length > 0) {
                          setModalErrors(
                            Object.values(formikProps.errors) as string[]
                          );
                          showErrorModal(true);
                        } else {
                          formikProps.handleSubmit(); // Ensure Formik handles the submit process
                        }
                      } else {
                        handleNext(); // Call handleNext for non-final steps
                      }
                    }}
                    type={currentStep === 1 ? "submit" : "button"}
                  >
                    {currentStep === 1 ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {loading && <Loading text="Registering" />}

      {modal && (
        <Modal>
          <h2 className="text-xl font-bold mb-4">Validation Errors</h2>
          <ul className="list-disc ml-5">
            {modalErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Modal>
      )}
      {modal && (
        <Modal>
          {" "}
          <div className="bg-mainBlack p-6">
            <div className="grid items-center grid-cols-10">
              <div className="col-span-7">
                <p className="text-xl mb-3 font-bold">Profile Submitted!</p>
                <p className="lg:text-base text-sm">
                  Your business profile has been successfully submitted. We’re
                  now reviewing your information and verifying your financial
                  records. This process may take up to 48 hours.
                </p>
              </div>
              <div className="col-span-3 flex justify-center item-center mt-6">
                <FaCheckDouble className="text-mainGreen text-6xl" />
              </div>
            </div>
            <div className="flex mt-5 justify-between lg:justify-normal lg:mt-8 gap-3 lg:gap-6">
              <button
                onClick={() => id && handleRefreshRedirectFund(id)}
                className="bg-mainGreen lg:text-base text-xs py-2 px-2 lg:px-4 rounded"
              >
                Take Fundability test
              </button>
              <button
                className="bg-black py-1 px-3 rounded"
                onClick={handleRefreshRedirect}
              >
                View Dashboard
              </button>
            </div>
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
      {/* <div className="hidden">{modalMessage}</div> */}
    </div>
  );
}
