import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FireApi } from "@/hooks/fireApi";
import { jwtDecode } from "jwt-decode";

// Create context
const HistoryContext = createContext(undefined);

// Context provider component
export const HistoryProvider = ({ children }) => {
  const [apiData, setApiData] = useState({
    data: [],
    loading: true,
    error: null,
  });
  const [userInfo, setUserInfo] = useState({
    userId: "",
    email: "",
    sessionId: "",
  });

  useEffect(() => {
    const userToken = localStorage.getItem("user-visited-dashboard");
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        setUserInfo({
          userId: decodedToken.id,
          email: decodedToken.email,
        });
      } catch (error) {
        console.log(error, "error on decode token");
      }
    }
  }, []);

  const handleGetHistory = async () => {
    try {
      setApiData(prev => ({ ...prev, loading: true }));
      const res = await FireApi(`/chat-sessions/${userInfo?.userId}`, "GET");
      setApiData({
        data: res.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setApiData({
        data: [],
        loading: false,
        error: error.message || "Failed to fetch chat history",
      });
    }
  };

  useEffect(() => {
    if (userInfo.userId) {
      handleGetHistory();
    }
  }, [userInfo.userId]);

  return (
    <HistoryContext.Provider
      value={{
        apiData,
        userInfo,
        setUserInfo,
        handleGetHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

// Custom hook to use the context
export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};