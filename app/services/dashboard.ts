import { ConnectFormValues, FundabilityPayload, JobConnectForm, RegisterBusinessPayload } from "../type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUserDetails = async (token: string,publicId:string) => {
  try {
    const response = await fetch(`${apiUrl}/users/${publicId}`, {
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

export const getJobs = async () => {
  try {
    const response = await fetch(`${apiUrl}/jobs/all`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const joDetails = await response.json();
    return joDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}

export const registerBusiness = async (payload: RegisterBusinessPayload, token: string) => {
  try {
    const formData = new FormData();

    // Append payload properties to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as Blob | string);
      }
    });

    const response = await fetch(`${apiUrl}/business/save`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file and other fields
    });

    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    throw new Error("Please try again.");
  }
};


export const editBusiness = async (payload: RegisterBusinessPayload, token: string, id :string) => {
  try {
    const formData = new FormData();

    // Append payload properties to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as Blob | string);
      }
    });

    const response = await fetch(`${apiUrl}/business/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData for file and other fields
    });

    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    throw new Error("Please try again.");
  }
};




export const fundabilityTest = async (payload:FormData, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability/test`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,

      },
      body: payload,
    });

    return response;

  } catch  {
    console.error("Error:");
    throw new Error(" Please try again.");
  }
}

export const connectionRequest = async (payload: ConnectFormValues) => {
  try {
    const response = await fetch(`${apiUrl}/connection/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch  {
    console.error("Error:");
    throw new Error("Request failed. Please try again.");
  }
}



export const jobRequest = async (payload: JobConnectForm) => {

  const formData = new FormData();

  // Append payload properties to FormData
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as Blob | string);
    }
  });
  try {
    const response = await fetch(`${apiUrl}/jobs/apply`, {
      method: "POST",
     
      body: formData,
    });

    return response;

  } catch  {
    console.error("Error:");
    throw new Error("Request failed. Please try again.");
  }
}


