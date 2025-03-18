import { ConnectFormValues, Investor, InvestorProfilePayload, JobConnectForm, ProposalPayload, ProposalResponse, RegisterBusinessPayload, ValuationFormPayload } from "../type";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUserDetails = async (token: string, publicId: string) => {
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

export const getABusiness = async (token: string,publicId:string) => {
  try {
    const response = await fetch(`${apiUrl}/business/${publicId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const businesses = await response.json();
    return businesses;
  }
  catch {
    console.error('unable to fetch')
  }
}

export const getFundabilityResults = async ( publicId: string,token: string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability/${publicId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const fundabilityDetails = await response.json();
    return fundabilityDetails;
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

export const registerInvestor = async (payload: InvestorProfilePayload, token: string) => {
  try {
    const formData = new FormData();

    // Append payload properties to FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return; // Skip null/undefined values
      }
      
      if (Array.isArray(value)) {
        // Convert arrays and objects to JSON string and append
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as Blob | string);
      }
    });

    const response = await fetch(`${apiUrl}/investor/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    throw new Error("Please try again.");
  }
};


export const editBusiness = async (payload: RegisterBusinessPayload, token: string, id: string) => {
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




export const fundabilityTest = async (payload: FormData, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability/test`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,

      },
      body: payload,
    });

    return response;

  } catch {
    console.error("Error:");
    throw new Error(" Please try again.");
  }
}

export const startupFundabilityTest = async (payload: FormData, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability/test/startup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,

      },
      body: payload,
    });

    return response;

  } catch {
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

  } catch {
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

  } catch {
    console.error("Error:");
    throw new Error("Request failed. Please try again.");
  }
}


export const getValuation = async (payload: ValuationFormPayload, token: string) => {
  try {
    const formData = new FormData();

    // Append all non-file fields
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'businessPhotos' && key !== 'proofOfBusiness' && key !== 'businessDocuments') {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    });

    // Handle businessPhotos (multiple files)
    if (payload.businessPhotos && Array.isArray(payload.businessPhotos)) {
      payload.businessPhotos.forEach((photo) => {
        formData.append('businessPhotos', photo);
      });
    }

    // Handle proofOfBusiness (multiple files)
    if (payload.proofOfBusiness && Array.isArray(payload.proofOfBusiness)) {
      payload.proofOfBusiness.forEach((proof) => {
        formData.append('proofOfBusiness', proof);
      });
    }

    // Handle businessDocuments (multiple files)
    if (payload.businessDocuments && Array.isArray(payload.businessDocuments)) {
      payload.businessDocuments.forEach((doc) => {
        formData.append('businessDocuments', doc);
      });
    }

    const response = await fetch(`${apiUrl}/dealroom/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    throw new Error("Please try again.");
  }
};

export const submitProposal = async (payload: ProposalPayload, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/dealroom/investor/proposal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch {
    console.error("Error:");
    throw new Error(" Please try again.");
  }
}

export const submitProposalBusiness = async (payload: ProposalPayload, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/dealroom/business/proposal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response;

  } catch {
    console.error("Error:");
    throw new Error(" Please try again.");
  }
}




export const getValuatedBusiness = async (token: string) => {
  try {
    const response = await fetch(`${apiUrl}/dealroom/businesses`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const BusinessDetails = await response.json();
    return BusinessDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}

export const getBusinessProposals = async (token: string, businessId: string) => {
  try {
    const response = await fetch(`${apiUrl}/dealroom/business/proposals/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data: ProposalResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Unable to fetch business proposals:', error);
    return {
      success: false,
      message: 'Failed to fetch business proposals',
      data: []
    };
  }
};

export const getAllInvestors = async (token: string) => {
  try {
    const response = await fetch(`${apiUrl}/investor/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    const investors :Investor[] = data.data;
   return investors;
  } catch (error) {
    console.error('Unable to fetch business proposals:', error);
    return 
  }
};


export const getFundabilityResultsSme = async (token: string,fundabilityId:string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability/${fundabilityId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const BusinessDetails = await response.json();
    return BusinessDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}

export const getFundabilityResultsStartup = async (token: string,fundabilityId:string) => {
  try {
    const response = await fetch(`${apiUrl}fundability/startup/${fundabilityId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const BusinessDetails = await response.json();
    return BusinessDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}

export const getFundabilityResultsSmeBusinessId  = async (token: string,fundabilityId:string) => {
  try {
    const response = await fetch(`${apiUrl}/fundability/test/${fundabilityId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const BusinessDetails = await response.json();
    return BusinessDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}

export const getFundabilityResultsStartupBusinessId = async (token: string,fundabilityId:string) => {
  try {
    const response = await fetch(`${apiUrl}fundability/test/startup/${fundabilityId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const BusinessDetails = await response.json();
    return BusinessDetails;
  }
  catch {
    console.error('unable to fetch')
  }

}