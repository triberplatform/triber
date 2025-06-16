import React, { useState } from 'react';

import { FaCrown,  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaRegCreditCard, FaBriefcase, FaRocket, FaInfinity, FaSpinner } from 'react-icons/fa';
import { MdUpgrade, MdPending } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { useSubscription, formatRemainingTime } from '@/app/hooks/useSubscription';
import { subscribeToService } from "@/app/services/payments";
import { BillingCycle, subscribePayload } from "@/app/type";

// Use your specific Plans enum
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

interface SubscriptionStatusProps {
  variant?: 'card' | 'banner' | 'compact' | 'mini' | 'pill';
  showUpgradeButton?: boolean;
  className?: string;
  onUpgradeSuccess?: (packageId: number) => void; // Callback when upgrade is successful
  businessName?: string; // For modal display
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  variant = 'card', 
  showUpgradeButton = true,
  className = '',
  businessName = "Premium Features"
}) => {
  const subscription = useSubscription();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

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

  const getStatusConfig = () => {
    if (subscription.isActive) {
      return {
        icon: <FaCrown className="text-amber-400" />,
        bgGradient: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
        borderColor: 'border-amber-400/30',
        textColor: 'text-amber-300',
        statusBadge: 'bg-amber-500/20 text-amber-300',
        accentColor: 'text-amber-400'
      };
    }
    if (subscription.isPending) {
      return {
        icon: <MdPending className="text-blue-400 animate-spin" />,
        bgGradient: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
        borderColor: 'border-blue-400/30',
        textColor: 'text-blue-300',
        statusBadge: 'bg-blue-500/20 text-blue-300',
        accentColor: 'text-blue-400'
      };
    }
    if (subscription.isExpired) {
      return {
        icon: <FaTimesCircle className="text-red-400" />,
        bgGradient: 'bg-gradient-to-r from-red-500/10 to-pink-500/10',
        borderColor: 'border-red-400/30',
        textColor: 'text-red-300',
        statusBadge: 'bg-red-500/20 text-red-300',
        accentColor: 'text-red-400'
      };
    }
    return {
      icon: <MdUpgrade className="text-gray-400" />,
      bgGradient: 'bg-gradient-to-r from-gray-500/10 to-slate-500/10',
      borderColor: 'border-gray-400/30',
      textColor: 'text-gray-300',
      statusBadge: 'bg-gray-500/20 text-gray-300',
      accentColor: 'text-gray-400'
    };
  };

  const config = getStatusConfig();

  const handleUpgradeClick = () => {
    setShowPricingModal(true);
  };

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
        return "bg-mainGreen hover:bg-green-600";
    }
  };

  const getActionButton = () => {
    if (!showUpgradeButton || subscription.isActive) return null;
    
    const buttonText = subscription.isExpired ? 'Renew Now' : 'Upgrade';
    const isUrgent = subscription.isExpired || (subscription.daysRemaining && subscription.daysRemaining <= 7);
    
    const buttonClasses = `
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm
      transition-all duration-200 hover:scale-105 active:scale-95
      ${isUrgent 
        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
        : 'bg-mainGreen hover:bg-green-700 text-white shadow-lg shadow-green-500/25'
      }
    `;

    return (
      <button className={buttonClasses} onClick={handleUpgradeClick}>
        <HiSparkles className="text-xs" />
        {buttonText}
      </button>
    );
  };

  // Enhanced pill variant
  if (variant === 'pill') {
    return (
      <>
        <div className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm
          ${config.bgGradient} ${config.borderColor}
          ${className}
        `}>
          {config.icon}
          <span className={`font-medium text-sm ${config.textColor}`}>
            {subscription.displayName}
          </span>
          {subscription.isActive && (
            <FaCheckCircle className="text-emerald-400 text-sm" />
          )}
        </div>
        {renderPricingModal()}
      </>
    );
  }

  // Enhanced mini variant
  if (variant === 'mini') {
    return (
      <>
        <div className={`
          flex items-center justify-between p-3 rounded-xl border backdrop-blur-sm
          ${config.bgGradient} ${config.borderColor} shadow-sm
          ${className}
        `}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/20 backdrop-blur-sm">
              {config.icon}
            </div>
            <div>
              <span className={`text-sm font-semibold ${config.textColor}`}>
                {subscription.displayName}
              </span>
              {subscription.isActive && (
                <div className="flex items-center gap-1 mt-0.5">
                  <FaCheckCircle className="text-emerald-400 text-xs" />
                  <span className="text-xs text-emerald-400 font-medium">Active</span>
                </div>
              )}
            </div>
          </div>
          {getActionButton()}
        </div>
        {renderPricingModal()}
      </>
    );
  }

  // Enhanced compact variant - perfect for dashboard headers
  if (variant === 'compact') {
    return (
      <>
        <div className={`
          inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border backdrop-blur-sm
          ${config.bgGradient} ${config.borderColor} shadow-lg
          ${className}
        `}>
          <div className="p-1.5 rounded-lg bg-black/20 backdrop-blur-sm">
            {config.icon}
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-semibold ${config.textColor}`}>
              {subscription.displayName}
            </span>
            {subscription.isActive && subscription.endDate && (
              <span className="text-xs text-gray-400">
                {formatRemainingTime(subscription.daysRemaining, subscription.endDate)}
              </span>
            )}
          </div>
          
          {subscription.isActive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FaCheckCircle className="text-xs" />
              <span className="text-xs font-medium">Active</span>
            </div>
          ) : (
            getActionButton()
          )}
        </div>
        {renderPricingModal()}
      </>
    );
  }

  // Enhanced banner variant
  if (variant === 'banner') {
    return (
      <>
        <div className={`
          p-4 rounded-xl border backdrop-blur-sm flex items-center justify-between
          ${config.bgGradient} ${config.borderColor} shadow-sm
          ${className}
        `}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-black/20 backdrop-blur-sm">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold ${config.textColor}`}>
                  {subscription.displayName}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.statusBadge}`}>
                  {subscription.status || 'FREE'}
                </span>
              </div>
              {subscription.isActive && subscription.endDate && (
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400 text-xs" />
                  <span className="text-xs text-gray-400">
                    {formatRemainingTime(subscription.daysRemaining, subscription.endDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
          {getActionButton()}
        </div>
        {renderPricingModal()}
      </>
    );
  }

  function renderPricingModal() {
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
              Select a package that best suits your needs for{" "}
              <span className="font-bold text-white">{businessName}</span>
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
  }

  // Enhanced default card variant
  return (
    <>
      <div className={`
        p-4 rounded-xl border backdrop-blur-sm shadow-sm
        ${config.bgGradient} ${config.borderColor}
        ${className}
      `}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-xl bg-black/20 backdrop-blur-sm">
              {config.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-semibold ${config.textColor}`}>
                  {subscription.displayName}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.statusBadge}`}>
                  {subscription.status || 'FREE'}
                </span>
              </div>
              
              <div className="space-y-1">
                {subscription.isActive && subscription.endDate && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400 text-xs flex-shrink-0" />
                    <span className="text-xs text-gray-400">
                      {formatRemainingTime(subscription.daysRemaining, subscription.endDate)}
                    </span>
                  </div>
                )}
                
                {subscription.isActive ? (
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400 text-xs flex-shrink-0" />
                    <span className="text-xs text-emerald-400 font-medium">Premium features active</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 block">
                    {subscription.isPending ? 'Processing your subscription...' : 'Upgrade to unlock premium features'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="ml-3 flex-shrink-0">
            {getActionButton()}
          </div>
        </div>
      </div>
      {renderPricingModal()}
    </>
  );
};

export default SubscriptionStatus;