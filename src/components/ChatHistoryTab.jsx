// ChatHistoryTab.jsx
import React from "react";
import { useHistory } from "@/Context/HistoryContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { chatHistoryUrl, FireApi } from "@/hooks/fireApi";
import { jwtDecode } from "jwt-decode";

const ChatHistoryTab = () => {
  const [openDropdown, setOpenDropdown] = React.useState(true);
  const { apiData, userInfo, setUserInfo, handleGetHistory } = useHistory();

  // Get userId from token
  const getUserId = () => {
    const token = localStorage.getItem("user-visited-dashboard");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleGetSessionId = (data) => {
    const userId = getUserId();
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    localStorage.setItem('chat_session', data?.session_id)
    setUserInfo({
      sessionId: data?.session_id,
      userId: userId
    });
    handleGetHistory();
  };

  const handleDeleteChat = async (data) => {
    try {
      const userId = getUserId();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      await FireApi(
        `/delete-chat-sessions/${userId}/${data?.session_id}`,
        "DELETE",
        null,
        chatHistoryUrl
      );
      toast.success("Chat deleted successfully");
      handleGetHistory(userInfo?.userId || userId);
    } catch (error) {
      console.log(error);
    }
  };

  // Safe text rendering function
  const renderSafeText = (text, fallback = "New Chat") => {
    if (!text || typeof text !== 'string') return fallback;
    return text.length > 18 ? text.slice(0, 18) + "..." : text;
  };

  return (
    <div className="w-full">
      {/* Dropdown content */}
      {openDropdown && (
        <div className="-mt-1 text-white rounded-md ">
          {apiData?.data?.length > 0 ? (
            apiData.data.map((item, index) => (
              <div
                onClick={() => handleGetSessionId(item)}
                key={index}
                className="mr-2 border text-black text-sm bg-white shadow-xs p-2 rounded-md flex justify-between items-center mb-2 dark:text-white dark:bg-[#101010] dark:border dark:border-xs"
              >
                <p className="cursor-pointer text-[13px] max-w-[200px]">
                  {renderSafeText(item?.chat_title)}
                </p>
                <MdDeleteOutline 
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  size={16} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(item);
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-black text-sm dark:text-white">No history found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryTab;