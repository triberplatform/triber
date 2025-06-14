import { subscribeToService } from "@/app/services/payments";
import {
  BillingCycle,
  Plans,
  subscribePayload,

} from "@/app/type";
import React, { useState } from "react";
import {
  FaRegCreditCard,
  FaBriefcase,
  FaRocket,
  FaInfinity,
  FaSpinner,
} from "react-icons/fa";

// Types remain the same...
interface PricingPackage {
  id: number;
  name: string;
  price: string;
  numericPrice: number;
  icon: React.ReactNode;
  features: string[];
  color: string;
  plan: Plans;
  billingCycle: BillingCycle;
  recommended?: boolean;
}

interface PricingModalProps {
  onClose: () => void;
  onConfirm: (packageId: number) => void;
  businessName: string;
}

const PricingModal: React.FC<PricingModalProps> = ({
  onClose,

  businessName,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const pricingPackages: PricingPackage[] = [
    {
      id: 1,
      name: "Simple Plan",
      price: "204,250.00",
      numericPrice: 204250,
      plan: Plans.BASIC,
      billingCycle: BillingCycle.THREE_MONTHS,
      icon: <FaRegCreditCard className="text-3xl text-blue-500" />,
      features: [
        "Basic Business Profile",
        "3 month access to Business Proposals",
        "Speedy Profile Activation",
        "Email Support",
      ],
      color: "border-blue-500",
    },
    {
      id: 2,
      name: "Active Plan",
      price: "282,725.00",
      numericPrice: 282725,
      plan: Plans.PRO,
      billingCycle: BillingCycle.EIGHT_MONTHS,
      icon: <FaBriefcase className="text-3xl text-green-500" />,
      features: [
        "Premium Business Profile",
        "8 month access to Business Proposals",
        "Speedy Profile Activation",
        "Top 20 Investors / Acquirers",
        "NDA Support",
        "Email Support",
      ],
      color: "border-green-500",
      recommended: true,
    },
    {
      id: 3,
      name: "Premium",
      price: "886,875.00",
      numericPrice: 886875,
      plan: Plans.PREMIUM,
      billingCycle: BillingCycle.ONE_YEAR,
      icon: <FaRocket className="text-3xl text-purple-600" />,
      features: [
        "Premium Business Profile",
        "12 month access to Business Proposals",
        "Speedy Profile Activation",
        "Top Investors Matching",
        "NDA Support For Every Profile",
        "Email Support From TRIBER",
        "Business Promotions by TRIBER",
        "Account Manager",
      ],
      color: "border-purple-600",
    },
    {
      id: 4,
      name: "Unlimited",
      price: "1,558,750.00",
      numericPrice: 1558750,
      plan: Plans.UNLIMITED,
      billingCycle: BillingCycle.FOREVER,
      icon: <FaInfinity className="text-3xl text-red-600" />,
      features: [
        "Premium Business Profile",
        "Unlimited Business Proposals Per Profile",
        "Speedy Profile Activation",
        "Top Investors Matching",
        "Promotions For Every Profile",
        "NDA Support For Every Profile",
        "Collaterals Preparation",
        "Account Manager",
        "Accelerated Partnership",
        "Email Marketing support",
        "Business Acceleration support",
        "Accelerated Marketing",
        "Email & Phone Support From TRIBER",
      ],
      color: "border-red-600",
    },
  ];

  const handlePackageSelect = (packageId: number): void => {
    setSelectedPackage(packageId);
    setPaymentStatus("idle");
  };

  const handleSubscriptionRequest = async (selectedPkg: PricingPackage) => {
    try {
      const token = localStorage.getItem("token");
      setIsProcessing(true);
      setPaymentStatus("processing");

      // Create subscription payload
      const subscriptionPayload: subscribePayload = {
        amount: selectedPkg.numericPrice,
        plan: selectedPkg.plan,
        billingCycle: selectedPkg.billingCycle,
     
      };

      // Send subscription request to backend
      const result = await subscribeToService(subscriptionPayload, token || "");

      if (result.success && result.data.paymentUrl) {
        // Store subscription data for verification after payment
        const subscriptionData = {
          publicId: result.data.subscription.publicId,
          payload: {
            amount: selectedPkg.numericPrice,
            plan: selectedPkg.plan,
            billingCycle: selectedPkg.billingCycle,
          },
        };

        localStorage.setItem(
          "pendingSubscription",
          JSON.stringify(subscriptionData)
        );

        // Redirect to Paystack checkout
        window.location.href = result.data.paymentUrl;
      } else {
        throw new Error(result.message || "Failed to create subscription");
      }
    } catch (error) {
      console.error("Subscription request failed:", error);
      setPaymentStatus("error");
      setIsProcessing(false);
    }
  };

  const handleContinue = (): void => {
    if (selectedPackage !== null && !isProcessing) {
      const selectedPkg = pricingPackages.find(
        (pkg) => pkg.id === selectedPackage
      );
      if (selectedPkg) {
        handleSubscriptionRequest(selectedPkg);
      }
    }
  };

  const getButtonText = () => {
    switch (paymentStatus) {
      case "processing":
        return "Creating Subscription...";
      case "error":
        return "Try Again";
      default:
        return "Proceed to Payment";
    }
  };

  const getButtonColor = () => {
    switch (paymentStatus) {
      case "error":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-mainGreen hover:bg-green-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-black dark:bg-black rounded-lg shadow-xl w-[90%] max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white"
              disabled={isProcessing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-300 mb-6">
            Select a package that best suits your needs for{" "}
            <span className="font-bold text-white">{businessName}</span>
          </p>

          {/* Payment Status Messages */}
          {paymentStatus === "error" && (
            <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-300">
                ❌ Failed to create subscription. Please try again or contact
                support.
              </p>
            </div>
          )}

          {paymentStatus === "processing" && (
            <div className="mb-4 p-4 bg-blue-900 border border-blue-700 rounded-lg">
              <p className="text-blue-300">
                🔄 Creating your subscription... You will be redirected to
                complete payment.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {pricingPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`border ${
                  selectedPackage === pkg.id
                    ? "border-mainGreen"
                    : "border-gray-700"
                } 
                  bg-black rounded-lg p-4 transition-all hover:shadow-white hover:shadow-md relative cursor-pointer
                  ${selectedPackage === pkg.id ? "ring-2 ring-mainGreen" : ""}
                  ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isProcessing && handlePackageSelect(pkg.id)}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2 bg-mainGreen text-white px-3 py-1 rounded-full text-xs font-medium text-center w-auto whitespace-nowrap">
                    Recommended for Businesses
                    <br />
                    seeking to fast track the deal
                  </div>
                )}
                <div className="flex flex-col items-center text-center mb-4">
                  {pkg.icon}
                  <h3 className="text-xl font-bold mt-2 text-white">
                    {pkg.name}
                  </h3>
                  <div className="mt-2 text-2xl font-bold text-white">
                    ₦{pkg.price}
                  </div>
                </div>

                <div className="space-y-2 min-h-[320px]">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-white">
                      <svg
                        className="h-5 w-5 text-mainGreen mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedPackage === null || isProcessing}
              className={`px-6 py-2 text-white rounded-md transition-colors flex items-center space-x-2
                ${getButtonColor()}
                ${
                  selectedPackage === null || isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
            >
              {isProcessing && <FaSpinner className="animate-spin" />}
              <span>{getButtonText()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
