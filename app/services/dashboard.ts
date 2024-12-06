import { RegisterBusinessPayload } from "../type";



export const getUserDetails = async (token:any)=>{
    try{
        const response = await fetch( 'https://backend.triberrr.com/api/get-user',{
            headers: {
              Authorization : `Bearer ${token}`
            }
          });
           const userDetails = await response.json();
           return userDetails;
    }
    catch{
        console.error('unable to fetch')
    }

}

export const registerBusiness = async (payload: RegisterBusinessPayload,token:any) => {
  try {
    const response = await fetch('https://backend.triberrr.com/api/save-business', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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