// TotalBalance.jsx
import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { chatHistoryUrl, FireApi } from "@/hooks/fireApi";
import ChatHistoryTab from "./ChatHistoryTab";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "@/Context/HistoryContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const handleCreateSession = async ({
  userId,
  userEmail,
  setUserInfo,
  handleGetHistory,
}) => {
  try {
    const res = await FireApi(
      "/chat-sessions",
      "POST",
      {
        user_id: userId,
        email_address: userEmail,
      },
      chatHistoryUrl
    );
    localStorage.setItem("chat_session", res?.data?.session_id);
    setUserInfo({
      sessionId: res?.data?.session_id,
    });
    handleGetHistory(userId);
  } catch (error) {
    console.log(error);
  }
};

export default function TotalBalance() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { setUserInfo, handleGetHistory } = useHistory();

  useEffect(() => {
    const userToken = localStorage.getItem("user-visited-dashboard");
    if (userToken) {
      try {
        const decodedToken = jwtDecode(userToken);
        setUserId(decodedToken.id);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.log(error, "error on decode token");
      }
    }
  }, []);

  useEffect(() => {
    const alreadyCreated = localStorage.getItem("session_created");
    if (userId && userEmail && !alreadyCreated) {
      handleCreateSession({ userId, userEmail, setUserInfo, handleGetHistory });
      localStorage.setItem("session_created", "true");
    }
  }, [userId, userEmail, setUserInfo, handleGetHistory]);

  const handleNewChat = () => {
    localStorage.removeItem("session_created");
    handleCreateSession({
      userId,
      userEmail,
      setUserInfo,
      handleGetHistory,
    });
    localStorage.setItem("session_created", "true");
  };

  return (
    <div className="flex flex-col gap-4 relative min-h-screen">
      {/* create new chat */}
      <div className="sticky top-0 z-10 bg-none pt-2 pb-2">
        <button
          onClick={handleNewChat}
          className="w-[96%] rounded-md cursor-pointer shadow-md gap-2 dark:bg-[#101010] dark:border dark:shadow-sm text-sm font-semibold text-black bg-[#d1d5dc] text-center py-2 w-20 dark:text-white hover:opacity-90 transition-opacity"
        >
          New Chat
        </button>
      </div>

      <ChatHistoryTab />
    </div>
  );
}