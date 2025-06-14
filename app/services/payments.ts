import { subscribePayload, SubscriptionResponse } from "../type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const subscribeToService = async (
  payload: subscribePayload,
  token: string
): Promise<SubscriptionResponse> => {
  try {
    const response = await fetch(`${apiUrl}/subscription/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...payload,

      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Subscription Error:", error);
    throw new Error(error instanceof Error ? error.message : "Subscribe failed. Please try again.");
  }
};

export const verifyPayment = async (publicId: string, payload: subscribePayload, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/subscription/verify/${publicId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error("Payment verification error:", error);
    throw error;
  }
};