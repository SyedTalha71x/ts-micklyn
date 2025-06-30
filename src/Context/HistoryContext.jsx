import React, { createContext, useContext, useState, useEffect } from "react";
import { chatHistoryUrl, FireApi } from "@/hooks/fireApi";
import { jwtDecode } from "jwt-decode";

const HistoryContext = createContext(undefined);

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

  //Decode token once on load
  useEffect(() => {
    const userToken = localStorage.getItem("user-visited-dashboard");
    const chatSession = localStorage.getItem("chat_session");
    
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        console.log("Decoded Token:", decodedToken);
        setUserInfo({
          userId: decodedToken.id,
          email: decodedToken.email,
          sessionId: chatSession,
        });
      } catch (error) {
        console.log("Error decoding token", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userInfo.userId) return;

    const fetchHistory = async () => {
      try {
        setApiData(prev => ({ ...prev, loading: true }));
        const res = await FireApi(`/chat-sessions/${userInfo.userId}`, "GET", null, chatHistoryUrl);
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

    fetchHistory();
  }, [userInfo.userId]); 

  return (
    <HistoryContext.Provider
      value={{
        apiData,
        userInfo,
        setUserInfo,
        handleGetHistory: async (id) => {
          if (!id) return;
          try {
            setApiData(prev => ({ ...prev, loading: true }));
            const res = await FireApi(`/chat-sessions/${id}`, "GET", null, chatHistoryUrl);
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
        }
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

// Custom hook to use context
export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
