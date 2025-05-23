/* eslint-disable @typescript-eslint/no-explicit-any */
import { changePasswordPayload, emailPayload, loginpayload, resendPayload, signUpPayload } from "../type";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export const signup = async (payload: signUpPayload) => {
  try {
    // Send POST request to the signup endpoint using fetch
    const response = await fetch(`${apiUrl}/register/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch {
    console.error("Signup Error:");
  }
};

export const changePassword = async (payload: changePasswordPayload,token:string) => {
  try {
    // Send POST request to the signup endpoint using fetch
    const response = await fetch(`${apiUrl}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch {
    console.error("Signup Error:");
  }
};

export const forgotPassword = async (email:string) => {
  try {
    // Send POST request to the signup endpoint using fetch
    const response = await fetch(`${apiUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      
        
      },
      body: JSON.stringify({email}),
    });

    return response;
  } catch {
    console.error("Signup Error:");
  }
};

export const resetPassword = async (data: { email: string; newPassword: string; otp: string }) => {
  try {

    
    // Send POST request to the reset password endpoint
    const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

export const confirmEmail = async (payload: emailPayload) => {
  try {

    const response = await fetch(`${apiUrl}/account/email-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ".");
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch  {
    console.error("Signup Error:");

    // Throw a new error with a user-friendly message
    throw new Error( "Signup failed. Please try again.");
  }
};

export const resendEmail = async (payload:resendPayload) => {
  try {

    const response = await fetch(`${apiUrl}/account/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ".");
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch  {
    console.error("Signup Error:");

    // Throw a new error with a user-friendly message
    throw new Error( "Signup failed. Please try again.");
  }
};

export const login = async (payload: loginpayload) => {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch  {
    console.error("Login Error:");
    throw new Error("Login failed. Please try again.");
  }
};

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("publicId");

    // Redirect to the login page
    router.push("/login");
  };

  return logout;
};