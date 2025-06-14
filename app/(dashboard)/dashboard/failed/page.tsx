import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancelledPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear any pending subscription data when payment is cancelled
    localStorage.removeItem('pendingSubscription');
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <FaTimesCircle className="text-4xl text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h2>
        <p className="text-gray-300 mb-6">
          Your payment was cancelled. You can try again anytime.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/dashboard/pricing')}
            className="px-6 py-2 bg-mainGreen text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;