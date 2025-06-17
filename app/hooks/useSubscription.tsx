/* typescript-eslint-disable no-implicit-any */
import { useUser } from "@/app/components/layouts/UserContext";
import { useMemo } from "react";

export interface SubscriptionStatusInfo {
  hasSubscription: boolean;
  isActive: boolean;
  isPending: boolean;
  isExpired: boolean;
  plan: string | null;
  status: string | null;
  endDate: string | null;
  daysRemaining: number;
  displayName: string;
  color: string;
  bgColor: string;
}

export const useSubscription = (): SubscriptionStatusInfo => {
  const { user } = useUser();

  return useMemo(() => {
    // Check if user exists and has subscriptions array
    if (!user || !user.subscriptions || !Array.isArray(user.subscriptions) || user.subscriptions.length === 0) {
      console.log("useSubscription - No user or subscriptions array, returning free plan");
      return {
        hasSubscription: false,
        isActive: false,
        isPending: false,
        isExpired: false,
        plan: null,
        status: null,
        endDate: null,
        daysRemaining: 0,
        displayName: 'Free Plan',
        color: 'text-gray-400',
        bgColor: 'bg-gray-900/20 border-gray-600'
      };
    }

    // Get the most recent active subscription or the latest one
    const activeSubscription = user.subscriptions.find(sub => 
      sub.status?.toUpperCase() === 'ACTIVE' || sub.status?.toLowerCase() === 'active'
    );
    
    // If no active subscription, get the most recent one (by createdAt or id)
    const subscription = activeSubscription || 
      user.subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    
    // Add debugging for subscription details
    console.log("useSubscription - Subscriptions array:", user.subscriptions);
    console.log("useSubscription - Selected subscription:", subscription);
    console.log("useSubscription - Status:", subscription.status);
    console.log("useSubscription - Plan:", subscription.plan);

    // Check subscription status (make sure to handle different status values)
    const isActive = subscription.status === 'ACTIVE' || subscription.status === 'active';
    const isPending = subscription.status === 'PENDING' || subscription.status === 'pending';
    const isExpired = subscription.status === 'EXPIRED' || subscription.status === 'expired' || 
                     subscription.status === 'CANCELLED' || subscription.status === 'cancelled';
    
    const getPlanDisplayName = (plan: string) => {
      switch (plan?.toUpperCase()) {
        case 'BASIC': return 'Basic Plan';
        case 'PRO': return 'Pro Plan';
        case 'PREMIUM': return 'Premium Plan';
        case 'UNLIMITED': return 'Unlimited Plan';
        default: return plan || 'Unknown Plan';
      }
    };
    
    let daysRemaining = 0;

    if (subscription.endDate) {
      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const timeDiff = endDate.getTime() - now.getTime();
      daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      console.log("useSubscription - End date:", subscription.endDate);
      console.log("useSubscription - Days remaining:", daysRemaining);
      
      // If endDate has passed but status is still ACTIVE, consider it expired
      if (daysRemaining <= 0 && isActive) {
        console.log("useSubscription - Subscription expired (past end date)");
        return {
          hasSubscription: true,
          isActive: false,
          isPending: false,
          isExpired: true,
          plan: subscription.plan,
          status: 'EXPIRED',
          endDate: subscription.endDate,
          daysRemaining: 0,
          displayName: getPlanDisplayName(subscription.plan),
          color: 'text-red-400',
          bgColor: 'bg-red-900/20 border-red-600'
        };
      }
    } else {
      // No end date means lifetime subscription
      daysRemaining = Infinity;
    }

    const getPlanColor = (plan: string) => {
      switch (plan?.toUpperCase()) {
        case 'BASIC': return 'text-blue-400';
        case 'PRO': return 'text-green-400';
        case 'PREMIUM': return 'text-purple-400';
        case 'UNLIMITED': return 'text-yellow-400';
        default: return 'text-green-400';
      }
    };

    const getBgColor = (status: string) => {
      switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-900/20 border-green-600';
        case 'PENDING': return 'bg-yellow-900/20 border-yellow-600';
        case 'EXPIRED':
        case 'CANCELLED': return 'bg-red-900/20 border-red-600';
        default: return 'bg-gray-900/20 border-gray-600';
      }
    };

    const result = {
      hasSubscription: true,
      isActive,
      isPending,
      isExpired,
      plan: subscription.plan,
      status: subscription.status,
      endDate: subscription.endDate,
      daysRemaining: daysRemaining === Infinity ? 0 : daysRemaining,
      displayName: getPlanDisplayName(subscription.plan),
      color: getPlanColor(subscription.plan),
      bgColor: getBgColor(subscription.status)
    };

    console.log("useSubscription - Final result:", result);
    return result;
  }, [user]);
};

// Utility functions that can be used without the hook
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const checkActiveSubscription = (subscription:any): boolean => {
  if (!subscription) return false;
  
  const status = subscription.status?.toUpperCase();
  if (status !== 'ACTIVE') return false;
  
  if (subscription.endDate) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (endDate <= now) return false;
  }
  
  return true;
};

export const formatRemainingTime = (daysRemaining: number, endDate: string | null): string => {
  if (!endDate) return 'Lifetime subscription';
  
  if (daysRemaining <= 0) return 'Expired';
  
  if (daysRemaining === 1) return '1 day remaining';
  
  if (daysRemaining <= 30) return `${daysRemaining} days remaining`;
  
  const monthsRemaining = Math.floor(daysRemaining / 30);
  if (monthsRemaining === 1) return '1 month remaining';
  
  return `${monthsRemaining} months remaining`;
};