/* eslint-disable @typescript-eslint/no-explicit-any */
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




 
export const getDealRoomProfile = async (token: string, publicId: string) => {
  try {
    const response = await fetch(`${apiUrl}/dealroom/business/${publicId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to fetch deal room profile',
        data: null
      };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching deal room profile:', error);
    return {
      success: false,
      message: 'An error occurred while fetching the deal room profile',
      data: null
    };
  }
};


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

export const getInvestor = async (token: string,publicId:string) => {
  try {
    const response = await fetch(`${apiUrl}/investor/${publicId}`, {
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

export const editInvestor = async (payload: InvestorProfilePayload, token: string) => {
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

    const response = await fetch(`${apiUrl}/investor/update`, {
      method: "PUT",
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
    
    // Handle all non-file fields
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'businessPhotos' && key !== 'proofOfBusiness' && key !== 'businessDocuments') {
        if (value !== null && value !== undefined) {
          // Convert arrays to JSON strings before appending to formData
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      }
    });
    
    // Handle businessPhotos (multiple files)
    if (payload.businessPhotos && Array.isArray(payload.businessPhotos)) {
      payload.businessPhotos.forEach((photo) => {
        formData.append('businessPhotos', photo);
      });
    }
    
    // Handle proofOfBusiness (single file)
    if (payload.proofOfBusiness) {
      formData.append('proofOfBusiness', payload.proofOfBusiness);
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
export const updateDealRoomProfile = async (data: any, token: string, businessId: string) => {
  try {
    // Create a FormData object for file uploads
    const formData = new FormData();
    
    // Add all text fields to the form data
    formData.append('businessId', data.businessId || businessId);
    
    // Handle arrays by serializing them to match expected server format
    if (data.topSellingProducts) {
      // Instead of using array indexes, serialize the array to JSON
      formData.append('topSellingProducts', JSON.stringify(data.topSellingProducts));
    }
    
    // Add other text fields
    if (data.highlightsOfBusiness) formData.append('highlightsOfBusiness', data.highlightsOfBusiness);
    if (data.facilityDetails) formData.append('facilityDetails', data.facilityDetails);
    if (data.fundingDetails) formData.append('fundingDetails', data.fundingDetails);
    if (data.averageMonthlySales !== undefined) formData.append('averageMonthlySales', data.averageMonthlySales.toString());
    if (data.reportedYearlySales !== undefined) formData.append('reportedYearlySales', data.reportedYearlySales.toString());
    if (data.profitMarginPercentage !== undefined) formData.append('profitMarginPercentage', data.profitMarginPercentage.toString());
    if (data.tentativeSellingPrice !== undefined) formData.append('tentativeSellingPrice', data.tentativeSellingPrice.toString());
    if (data.valueOfPhysicalAssets !== undefined) formData.append('valueOfPhysicalAssets', data.valueOfPhysicalAssets.toString());
    if (data.reasonForSale) formData.append('reasonForSale', data.reasonForSale);
    
    // Handle asset details array - using JSON.stringify instead of individual entries
    if (data.assetsDetails) {
      formData.append('assetsDetails', JSON.stringify(data.assetsDetails));
    }
    
    // Handle file uploads - only append if new files were provided
    // Business Photos (multiple files)
    if (data.businessPhotos && (data.businessPhotos instanceof FileList || 
       (Array.isArray(data.businessPhotos) && data.businessPhotos[0] instanceof File))) {
      
      const files = Array.from(data.businessPhotos);
      files.forEach((file: any) => {
        formData.append('businessPhotos', file);
      });
    }
    
    // Proof of Business (single file)
    if (data.proofOfBusiness && data.proofOfBusiness instanceof File) {
      formData.append('proofOfBusiness', data.proofOfBusiness);
    }
    
    // Business Documents (multiple files)
    if (data.businessDocuments && (data.businessDocuments instanceof FileList || 
       (Array.isArray(data.businessDocuments) && data.businessDocuments[0] instanceof File))) {
      
      const files = Array.from(data.businessDocuments);
      files.forEach((file: any) => {
        formData.append('businessDocuments', file);
      });
    }
    
    // Log the form data to check what's being sent (for debugging only)
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    
    // Make the API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealroom/business/${businessId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to update deal room profile',
        data: null
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: 'Deal room profile updated successfully',
      data: result
    };
  } catch (error) {
    console.error('Error updating deal room profile:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      data: null
    };
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


export const getValuatedBusiness = async (token: string, page = 1, size = 10) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    const response = await fetch(`${apiUrl}/dealroom/businesses?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const businessDetails = await response.json();
    return businessDetails;
  }
  catch (error) {
    console.error('Unable to fetch businesses:', error);
    throw error; // Rethrow to allow component to handle the error
  }
};

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

export const getInvestorProposals = async (token: string, investorId: string) => {
  try {
    const response = await fetch(`${apiUrl}/dealroom/investor/proposals/${investorId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data: ProposalResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Unable to fetch  proposals:', error);
    return {
      success: false,
      message: 'Failed to fetch  proposals',
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
    const response = await fetch(`${apiUrl}/fundability/startup/${fundabilityId}`, {
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
    const response = await fetch(`${apiUrl}/fundability/test/startup/${fundabilityId}`, {
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