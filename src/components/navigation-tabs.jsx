import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Icon from "../../public/Icon.svg";
import Wallet from "../../public/wallet.svg";
import { baseUrl } from "@/hooks/fireApi";

const NavigationTabsWithChat = () => {
  const [activeWallet, setActiveWallet] = useState(1);
  const [totalWallets, setTotalWallets] = useState(2);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Add a ref for the message container
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const storeAddress = localStorage.getItem("address");
    setAddress(storeAddress);
  }, []);

  // Auto-scroll effect whenever messages change
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, loading]); // Trigger on messages change or loading state change

  useEffect(() => {
    const newSocket = io(baseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(newSocket);

    // Listen for connection status
    newSocket.on("connection_status", (data) => {
      console.log("Connection Status:", data);
      setMessages((prev) => [
        { wallet: "System", content: data.status },
        ...prev,
      ]);
    });

    // Listen for errors
    newSocket.on("error", (data) => {
      console.error("Error:", data);
      setMessages((prev) => [...prev, { wallet: "Error", content: data.message }]);
    });

    // Listen for chat responses
    newSocket.on("chat_response", (data) => {
      console.log("Chat Response:", data);
      setLoading(false); // Stop loading when response is received
      if (data.reply) {
        setMessages((prev) => [...prev, { wallet: "Chat", content: data.reply }]);
      }
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const switchWallet = () => {
    setActiveWallet((prev) => (prev % totalWallets) + 1);
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        event: "chat_message",
        data: {
          user_input: message,
          address: address || "Unknown Address",
          chat_history: "",
        },
      };

      socket.emit("chat_message", messageData);

      setMessages((prev) => [...prev, { wallet: "You", content: message }]);
      setMessage("");
      setLoading(true); // Start loading when message is sent
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* System Status */}
      <div className="text-center mb-4">
        {messages.find((msg) => msg.wallet === "System") && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            System: Connected
          </p>
        )}
      </div>

      {/* Chat Section */}
      <div className="mt-4 flex flex-col items-center gap-2 bg-white dark:bg-[#101010] rounded-xl border border-[#A0AEC0] dark:border-gray-700 p-2 shadow-sm w-full">
        {/* Chat Messages - Added ref here */}
        <div 
          ref={messageContainerRef}
          className="w-full h-40 overflow-y-auto bg-gray-100 dark:bg-[#232428] rounded-md p-2 scroll-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                msg.wallet === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg text-sm ${
                  msg.wallet === "You"
                    ? "bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 max-w-[80%]"
                }`}
              >
                <strong>{msg.wallet}:</strong> {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg text-sm bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                Chat: Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input and Actions */}
        <div className="w-full">
          <input
            className="w-full bg-transparent border-none outline-none text-sm px-2 dark:text-gray-200 dark:placeholder-gray-400"
            placeholder="Write message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage(); 
              }
            }}
          />
        </div>

        <div className="flex justify-between items-center w-full">
          <div
            className="flex items-center justify-center h-8 w-8 relative cursor-pointer shrink-0"
            onClick={switchWallet}
          >
            <img src={Wallet} alt="" className="dark:invert" />
            {totalWallets > 1 && (
              <span className="absolute -top-1 -right-1 text-xs bg-gray-200 dark:bg-gray-600 rounded-full h-4 w-4 flex items-center justify-center dark:text-white">
                {activeWallet}
              </span>
            )}
          </div>

          <button
            className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600"
            onClick={sendMessage}
          >
            <img src={Icon} alt="Send" className="h-4 w-4" />
          </button>
        </div>
        
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-between items-center gap-3 mt-4">
        <div className="bg-white dark:bg-[#101010] rounded-xl p-4 shadow-sm border border-[#A0AEC0] dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Holding</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum is simply
          </p>
        </div>

        <div className="bg-white dark:bg-[#101010] rounded-xl p-4 shadow-sm border border-[#A0AEC0] dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Trending</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum is simply
          </p>
        </div>

        <div className="bg-white dark:bg-[#101010] md:block hidden rounded-xl p-4 shadow-sm border border-[#A0AEC0] dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Gainers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum is simply
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationTabsWithChat;