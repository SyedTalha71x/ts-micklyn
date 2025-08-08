import React, { createContext, useContext, useState, useEffect } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";

const profileContext = createContext(undefined);

export const ProfileProvider = ({ children }) => {

  const [profile, setProfile] = useState([]);

  const handleUserProfile = async () => {
    try {
        const res = await FireApi("/user", 'GET');
        console.log(res, 'user profile');
        setProfile(res.data);
    } catch (error) {
        toast.error(error.message);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("user-visited-dashboard");
    if (userToken) handleUserProfile();
  }, []);

  return (
    <profileContext.Provider
      value={{
        profile,
        setProfile,
        handleUserProfile,
      }}
    >
      {children}
    </profileContext.Provider>
  );
};

// Custom hook to use context
export const useProfile = () => {
  const context = useContext(profileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a profileProvider");
  }
  return context;
};
