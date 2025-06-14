'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPayment } from '@/app/services/payments';
import { 
  CheckCircle, 
  Crown, 
  Calendar, 
  Mail, 
  CreditCard, 
  ArrowRight, 
  Download, 
  Users, 
  Sparkles,
  Home,
  FileText,
  Gift,
  Star,
  Loader2,
  XCircle
} from 'lucide-react';

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
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Get stored subscription data from localStorage
        const storedSubscriptionData = localStorage.getItem('pendingSubscription');
        if (!storedSubscriptionData) {
          console.error('No pending subscription data found');
          setVerificationStatus('failed');
          return;
        }

        const { publicId, payload } = JSON.parse(storedSubscriptionData);
        
        if (!publicId || !payload) {
          console.error('Invalid subscription data');
          setVerificationStatus('failed');
          return;
        }

        const result = await verifyPayment(publicId, payload, token);
        
        if (result.success && result.data.status === 'ACTIVE') {
          setVerificationStatus('success');
          setSubscriptionData(result.data);
          setShowConfetti(true);
          setAnimateElements(true);
          
          // Clear the stored subscription data after successful verification
          localStorage.removeItem('pendingSubscription');
          
          // Hide confetti after 3 seconds
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationStatus('failed');
      }
    };

    verifyPaymentStatus();
  }, [router]);

  const handleNavigateDashboard = () => {
    router.push('/dashboard');
  };

  const handleNavigateHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    localStorage.removeItem('pendingSubscription');
    router.push('/dashboard/pricing');
  };

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'BASIC': return 'Simple Plan';
      case 'PRO': return 'Active Plan';
      case 'PREMIUM': return 'Premium Plan';
      case 'UNLIMITED': return 'Unlimited Plan';
      default: return plan;
    }
  };

  const getBillingCycleDisplay = (cycle: string) => {
    switch (cycle) {
      case 'THREE_MONTHS': return '3 Months';
      case 'EIGHT_MONTHS': return '8 Months';
      case 'ONE_YEAR': return '1 Year';
      case 'FOREVER': return 'Lifetime';
      default: return cycle;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'BASIC': return 'text-blue-500';
      case 'PRO': return 'text-green-500';
      case 'PREMIUM': return 'text-purple-500';
      case 'UNLIMITED': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  const getPlanBgColor = (plan: string) => {
    switch (plan) {
      case 'BASIC': return 'bg-blue-500/10 border-blue-500/20';
      case 'PRO': return 'bg-green-500/10 border-green-500/20';
      case 'PREMIUM': return 'bg-purple-500/10 border-purple-500/20';
      case 'UNLIMITED': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-green-500/10 border-green-500/20';
    }
  };

  // Loading State
  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
          <p className="text-gray-300">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  // Failed State
  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Verification Failed</h2>
          <p className="text-gray-300 mb-6">
            We couldn&apos;t verify your payment. Please contact support or try again.
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
              className={`absolute animate-bounce ${i % 2 === 0 ? 'text-green-400' : i % 3 === 0 ? 'text-blue-400' : 'text-purple-400'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
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
            <div className={`transform transition-all duration-1000 ${animateElements ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
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
                Welcome to {getPlanDisplayName(subscriptionData.plan)}, {subscriptionData.user.firstname}!
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
              <div className={`transform transition-all duration-1000 delay-300 ${animateElements ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className={`rounded-xl p-6 border ${getPlanBgColor(subscriptionData.plan)}`}>
                  <div className="flex items-center mb-4">
                    <Crown className={`w-6 h-6 mr-3 ${getPlanColor(subscriptionData.plan)}`} />
                    <h3 className="text-xl font-semibold text-white">Your Plan</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Plan Type:</span>
                      <span className={`font-semibold ${getPlanColor(subscriptionData.plan)}`}>
                        {getPlanDisplayName(subscriptionData.plan)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Amount Paid:</span>
                      <span className="font-semibold text-white">
                        {formatAmount(subscriptionData.amount, subscriptionData.currency)}
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
              <div className={`transform transition-all duration-1000 delay-500 ${animateElements ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="rounded-xl p-6 border border-gray-700 bg-gray-900/50">
                  <div className="flex items-center mb-4">
                    <Users className="w-6 h-6 mr-3 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Account Details</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-300">{subscriptionData.user.email}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-300">Subscription ID: {subscriptionData.publicId.slice(0, 8)}...</span>
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

            {/* What's Next Section */}
            <div className={`mt-8 transform transition-all duration-1000 delay-700 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">What&apos;s Next?</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/50 transition-colors">
                  <FileText className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">Complete Your Profile</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Add your business details to start receiving proposals
                  </p>
                  <button className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center mx-auto">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/50 transition-colors">
                  <Download className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">Download Resources</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Access your welcome package and getting started guide
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center mx-auto">
                    Download <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/50 transition-colors">
                  <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-white mb-2">Check Your Email</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    We&apos;ve sent important information to your inbox
                  </p>
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center mx-auto">
                    Open Email <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-1000 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
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