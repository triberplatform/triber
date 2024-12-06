import { emailPayload, loginpayload, signUpPayload } from "../type";
import config from "../config/config";
import { useRouter } from "next/navigation";

export const signup = async (payload: signUpPayload) => {
  try {
    // Send POST request to the signup endpoint using fetch
    const response = await fetch('https://backend.triberrr.com/api/register', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error: any) {
    console.error("Signup Error:", error.message);
  }
};

export const confirmEmail = async (payload: emailPayload) => {
  try {

    const response = await fetch('https://backend.triberrr.com/api/email-confirmation', {
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
  } catch (error: any) {
    console.error("Signup Error:", error.message);

    // Throw a new error with a user-friendly message
    throw new Error(error.message || "Signup failed. Please try again.");
  }
};


export const login = async (payload: loginpayload) => {
  try {
    const response = await fetch('https://backend.triberrr.com/api/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw new Error(error.message || "Login failed. Please try again.");
  }
};

export const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    router.push("/login");
  };

  return logout;
};