import React, { useState } from "react";
import { FaRegCreditCard, FaBriefcase, FaRocket, FaInfinity } from "react-icons/fa";

// Define types
interface PricingPackage {
  id: number;
  name: string;
  price: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  recommended?: boolean;
}

interface PricingModalProps {
  onClose: () => void;
  onConfirm: (packageId: number) => void;
  businessName: string;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose, onConfirm, businessName }) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const pricingPackages: PricingPackage[] = [
    {
      id: 1,
      name: "Simple Plan",
      price: "204,250.00",
      icon: <FaRegCreditCard className="text-3xl text-blue-500" />,
      features: [
        "Basic Business Profile",
        "3 month access to Business Proposals",
        "Speedy Profile Activation",
        "Email Support"
      ],
      color: "border-blue-500"
    },
    {
      id: 2,
      name: "Active Plan",
      price: "282,725.00",
      icon: <FaBriefcase className="text-3xl text-green-500" />,
      features: [
        "Premium Business Profile",
        "8 month access to Business Proposals",
        "Speedy Profile Activation",
        "Top 20 Investors / Acquirers",
        "NDA Support",
        "Email Support"
      ],
      color: "border-green-500",
      recommended: true
    },
    {
      id: 3,
      name: "Premium",
      price: "886,875.00",
      icon: <FaRocket className="text-3xl text-purple-600" />,
      features: [
        "Premium Business Profile",
        "12 month access to Business Proposals",
        "Speedy Profile Activation",
        "Top Investors Matching",
        "NDA Support For Every Profile",
        "Email Support From TRIBER",
        "Business Promotions by TRIBER",
        "Account Manager"
      ],
      color: "border-purple-600"
    },
    {
      id: 4,
      name: "Unlimited",
      price: "1,558,750.00",
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
        "Email & Phone Support From TRIBER"
      ],
      color: "border-red-600"
    }
  ];

  const handlePackageSelect = (packageId: number): void => {
    setSelectedPackage(packageId);
  };

  const handleContinue = (): void => {
    if (selectedPackage !== null) {
      onConfirm(selectedPackage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-black dark:bg-black rounded-lg shadow-xl w-[90%] max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Pricing Package Brief: Triber Platform
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-300 mb-6">
            Select a package that best suits your needs for <span className="font-bold">{businessName}</span>
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {pricingPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`border ${selectedPackage === pkg.id ? 'border-mainGreen' : 'border-gray-700'} 
                  bg-black rounded-lg p-4 transition-all hover:shadow-white hover:shadow-md relative cursor-pointer
                  ${selectedPackage === pkg.id ? 'ring-2 ring-mainGreen' : ''}`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2 bg-mainGreen text-white px-3 py-1 rounded-full text-xs font-medium text-center w-auto whitespace-nowrap">
                    Recommended for Businesses<br />seeking to fast track the deal
                  </div>
                )}
                <div className="flex flex-col items-center text-center mb-4">
                  {pkg.icon}
                  <h3 className="text-xl font-bold mt-2 text-white">{pkg.name}</h3>
                  <div className="mt-2 text-2xl font-bold text-white">₦{pkg.price}</div>
                </div>
                
                <div className="space-y-2 min-h-[320px]">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-white">
                      <svg className="h-5 w-5 text-mainGreen mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
              className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedPackage === null}
              className={`px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-green-600 transition-colors 
                ${selectedPackage === null ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continue with Selected Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;