"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment, subscribeToService } from "@/app/services/payments";
import { BillingCycle, subscribePayload } from "@/app/type";
import {
  CheckCircle,
  Crown,
  Calendar,
  Mail,
  CreditCard,
  Users,
  Sparkles,
  Home,
  Gift,
  Star,
  Loader2,
  XCircle,
} from "lucide-react";
import { FaCrown, FaRegCreditCard, FaBriefcase, FaRocket, FaInfinity, FaSpinner } from 'react-icons/fa';

// Plans enum
export enum Plans {
  BASIC = "BASIC",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
  UNLIMITED = "UNLIMITED"
}

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

interface SubscriptionData {
  id: number;
  publicId: string;
  plan: string;
  amount: string;
  currency: string;
  billingCycle: string;
  startDate: string;
  endDate: string | null;
  user: {
    email: string;
    firstname: string;
    lastname: string;
  };
}

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  
  // Pricing modal states
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  
  const SearchParams = useSearchParams();
  const referenceId = SearchParams.get("ref");

  // Pricing packages data
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

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Get stored subscription data from localStorage
        const storedSubscriptionData = localStorage.getItem(
          "pendingSubscription"
        );
        if (!storedSubscriptionData) {
          console.error("No pending subscription data found");
          setVerificationStatus("failed");
          return;
        }

        const { publicId, payload } = JSON.parse(storedSubscriptionData);

        if (!publicId || !payload) {
          console.error("Invalid subscription data");
          setVerificationStatus("failed");
          return;
        }

        const result = await verifyPayment(referenceId || "", payload, token);

        if (result.success && result.data.status === "ACTIVE") {
          setVerificationStatus("success");
          setSubscriptionData(result.data);
          setShowConfetti(true);
          setAnimateElements(true);

          // Clear the stored subscription data after successful verification
          localStorage.removeItem("pendingSubscription");

          // Hide confetti after 3 seconds
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          setVerificationStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setVerificationStatus("failed");
      }
    };

    verifyPaymentStatus();
  }, [router]);

  const handleNavigateDashboard = () => {
    router.push("/dashboard");
  };

  const handleNavigateHome = () => {
    router.push("/dashboard");
  };

  const handleRetry = () => {
    localStorage.removeItem("pendingSubscription");
    setShowPricingModal(true);
  };

  // Pricing modal handlers
  const handlePackageSelect = (packageId: number): void => {
    setSelectedPackage(packageId);
    setPaymentStatus("idle");
  };

  const handleSubscriptionRequest = async (selectedPkg: PricingPackage) => {
    try {
      const token = localStorage.getItem("token");
      setIsProcessing(true);
      setPaymentStatus("processing");

      const subscriptionPayload: subscribePayload = {
        amount: selectedPkg.numericPrice,
        plan: selectedPkg.plan,
        billingCycle: selectedPkg.billingCycle,
      };

      const result = await subscribeToService(subscriptionPayload, token || "");

      if (result.success && result.data.paymentUrl) {
        const subscriptionData = {
          publicId: result.data.subscription.publicId,
          payload: {
            amount: selectedPkg.numericPrice,
            plan: selectedPkg.plan,
            billingCycle: selectedPkg.billingCycle,
          },
        };

        localStorage.setItem("pendingSubscription", JSON.stringify(subscriptionData));
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
      const selectedPkg = pricingPackages.find(pkg => pkg.id === selectedPackage);
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
        return "bg-green-600 hover:bg-green-700";
    }
  };

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "BASIC":
        return "Basic Plan";
      case "PRO":
        return "Pro Plan";
      case "PREMIUM":
        return "Premium Plan";
      case "UNLIMITED":
        return "Unlimited Plan";
      default:
        return plan;
    }
  };

  const getBillingCycleDisplay = (cycle: string) => {
    switch (cycle) {
      case "THREE_MONTHS":
        return "3 Months";
      case "EIGHT_MONTHS":
        return "8 Months";
      case "ONE_YEAR":
        return "1 Year";
      case "FOREVER":
        return "Lifetime";
      default:
        return cycle;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "BASIC":
        return "text-blue-500";
      case "PRO":
        return "text-green-500";
      case "PREMIUM":
        return "text-purple-500";
      case "UNLIMITED":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  const getPlanBgColor = (plan: string) => {
    switch (plan) {
      case "BASIC":
        return "bg-blue-500/10 border-blue-500/20";
      case "PRO":
        return "bg-green-500/10 border-green-500/20";
      case "PREMIUM":
        return "bg-purple-500/10 border-purple-500/20";
      case "UNLIMITED":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-green-500/10 border-green-500/20";
    }
  };

  // Pricing Modal Component
  const renderPricingModal = () => {
    if (!showPricingModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-black dark:bg-black rounded-lg shadow-xl w-[90%] max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <button
                onClick={() => setShowPricingModal(false)}
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
              Select a package that best suits your needs for your business
            </p>

            {/* Payment Status Messages */}
            {paymentStatus === "error" && (
              <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-300">
                  ❌ Failed to create subscription. Please try again or contact support.
                </p>
              </div>
            )}

            {paymentStatus === "processing" && (
              <div className="mb-4 p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <p className="text-blue-300">
                  🔄 Creating your subscription... You will be redirected to complete payment.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              {pricingPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`border ${
                    selectedPackage === pkg.id
                      ? "border-green-500"
                      : "border-gray-700"
                  } 
                    bg-black rounded-lg p-4 transition-all hover:shadow-white hover:shadow-md relative cursor-pointer
                    ${selectedPackage === pkg.id ? "ring-2 ring-green-500" : ""}
                    ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isProcessing && handlePackageSelect(pkg.id)}
                >
                  {pkg.recommended && (
                    <div className="absolute -top-3 right-1/2 transform translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium text-center w-auto whitespace-nowrap">
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
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
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
                onClick={() => setShowPricingModal(false)}
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

  // Loading State
  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-300">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  // Failed State
  if (verificationStatus === "failed") {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-300 mb-6">
              We couldn&apos;t verify your payment. Please contact support or try
              again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleNavigateDashboard}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
        {renderPricingModal()}
      </>
    );
  }

  // Success State - Beautiful Design
  if (!subscriptionData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-bounce ${
                i % 2 === 0
                  ? "text-green-400"
                  : i % 3 === 0
                  ? "text-blue-400"
                  : "text-purple-400"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles size={12} />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          {/* Header Section */}
          <div className="text-center py-12 px-8 bg-gradient-to-r from-green-900/50 to-blue-900/50 border-b border-gray-800">
            <div
              className={`transform transition-all duration-1000 ${
                animateElements ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-green-400 animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                🎉 Subscription Successful!
              </h1>

              <p className="text-xl text-gray-300 mb-2">
                Welcome to {getPlanDisplayName(subscriptionData.plan)},{" "}
                {subscriptionData.user.firstname}!
              </p>

              <p className="text-gray-400">
                Your journey to business excellence begins now
              </p>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Plan Details */}
              <div
                className={`transform transition-all duration-1000 delay-300 ${
                  animateElements
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0"
                }`}
              >
                <div
                  className={`rounded-xl p-6 border ${getPlanBgColor(
                    subscriptionData.plan
                  )}`}
                >
                  <div className="flex items-center mb-4">
                    <Crown
                      className={`w-6 h-6 mr-3 ${getPlanColor(
                        subscriptionData.plan
                      )}`}
                    />
                    <h3 className="text-xl font-semibold text-white">
                      Your Plan
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Plan Type:</span>
                      <span
                        className={`font-semibold ${getPlanColor(
                          subscriptionData.plan
                        )}`}
                      >
                        {getPlanDisplayName(subscriptionData.plan)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Amount Paid:</span>
                      <span className="font-semibold text-white">
                        {formatAmount(
                          subscriptionData.amount,
                          subscriptionData.currency
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Billing Cycle:</span>
                      <span className="font-semibold text-white">
                        {getBillingCycleDisplay(subscriptionData.billingCycle)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Start Date:</span>
                      <span className="font-semibold text-white">
                        {formatDate(subscriptionData.startDate)}
                      </span>
                    </div>

                    {subscriptionData.endDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">End Date:</span>
                        <span className="font-semibold text-white">
                          {formatDate(subscriptionData.endDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Account Info */}
              <div
                className={`transform transition-all duration-1000 delay-500 ${
                  animateElements
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
              >
                <div className="rounded-xl p-6 border border-gray-700 bg-gray-900/50">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 mr-3 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Account Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-300">
                        {subscriptionData.user.email}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-300">
                        Subscription ID: {subscriptionData.publicId.slice(0, 8)}
                        ...
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-300">Activated Today</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-center">
                    <Gift className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">∞</div>
                    <div className="text-xs text-gray-400">Proposals</div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-center">
                    <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-xs text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-700 ${
                animateElements
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <button
                onClick={handleNavigateDashboard}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
              >
                <Crown className="w-5 h-5 mr-2" />
                Go to Dashboard
              </button>

              <button
                onClick={handleNavigateHome}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Need help getting started? Our support team is here for you 24/7
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Questions? Email us at support@triber.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;