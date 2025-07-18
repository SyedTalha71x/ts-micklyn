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
      // toast.error(error.message);
      console.log(error)
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-background px-4 py-3 shadow-md rounded-lg cursor-pointer text-sm font-semibold dark:text-white"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <span>Chat History</span>
        {openDropdown ? (
          <ChevronUp size={18} className="dark:text-gray-300" />
        ) : (
          <ChevronDown size={18} className="dark:text-gray-300" />
        )}
      </div>

      {/* Dropdown content */}
      {openDropdown && (
        <div className="mt-2 text-white rounded-md ">
          {apiData.data.length > 0 ? (
            apiData?.data?.map((item, index) => (
              <div
                onClick={() => handleGetSessionId(item)}
                key={index}
                className="mr-2 text-black text-sm bg-white shadow-xs p-2 rounded-md flex justify-between items-center mb-2"
              >
                <p className="cursor-pointer text-[13px] truncate max-w-[180px]">
                  {item?.first_user_input || "New Chat"}
                </p>
                <MdDeleteOutline 
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  size={20} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(item);
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-black text-sm">No history found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryTab;