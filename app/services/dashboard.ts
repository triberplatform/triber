import { FundabilityPayload, RegisterBusinessPayload } from "../type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUserDetails = async (token: string) => {
  try {
    const response = await fetch(`${apiUrl}/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const userDetails = await response.json();
    return userDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}

export const registerBusiness = async (payload: RegisterBusinessPayload, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/save-business`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch {
    console.error("Login Error:");
    throw new Error("Login failed. Please try again.");
  }
};

export const fundabilityTest = async (payload: FundabilityPayload, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability-test`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch  {
    console.error("Error:");
    throw new Error("Login failed. Please try again.");
  }
}