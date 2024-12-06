import React, { createContext, useContext } from "react";
import { UserDetails, BusinessDetails } from "@/app/type";

type UserContextType = {
  user: UserDetails | null;
  businessDetails: BusinessDetails[]; // Adding business details
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ user: UserDetails | null; children: React.ReactNode }> = ({ user, children }) => {
  const businessDetails = user?.businesses || []; // Extract businesses array

  return (
    <UserContext.Provider value={{ user, businessDetails }}>
      {children}
    </UserContext.Provider>
  );
};
