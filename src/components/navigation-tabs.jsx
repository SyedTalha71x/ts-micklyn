import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Icon from "../../public/Icon.svg";
import Wallet from "../../public/wallet.svg";
import { baseUrl } from "@/hooks/fireApi";
import { Mic } from "lucide-react";

const NavigationTabsWithChat = () => {
  const [activeWallet, setActiveWallet] = useState(1);
  const [totalWallets, setTotalWallets] = useState(2);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    const storeAddress = localStorage.getItem("address");
    setAddress(storeAddress);
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const newSocket = io(baseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(newSocket);

    newSocket.on("connection_status", (data) => {
      console.log("Connection Status:", data);
      setMessages((prev) => [
        { wallet: "System", content: data.status },
        ...prev,
      ]);
    });

    newSocket.on("error", (data) => {
      console.error("Error:", data);
      setMessages((prev) => [
        ...prev,
        { wallet: "Error", content: data.message },
      ]);
    });

    // newSocket.on("chat_response", (data) => {
    //   console.log("Chat Response:", data);
    //   setLoading(false);
    //   if (data.reply) {
    //     setMessages((prev) => [
    //       ...prev,
    //       { wallet: "Chat", content: data?.reply || data?.reply?.data },
    //     ]);
    //   }
    // });

    // newSocket.on("chat_response", (data) => {
    //   console.log("Chat Response:", data);
    //   setLoading(false);

    //   if (data.reply) {
    //     const isJson = typeof data.reply === "object" && data.reply !== null;

    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         wallet: "Chat",
    //         content: isJson ? data.reply : data.reply,
    //         isJson, // Add a flag to indicate if the content is JSON
    //       },
    //     ]);
    //   }
    // });

    newSocket.on("chat_response", (data) => {
      console.log("Chat Response:", data);
      setLoading(false);

      // Extract the reply from the nested structure
      const reply = data?.data?.reply;

      if (typeof reply === "string") {
        // Case 1: If reply is a string
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false, // Mark it as plain text
          },
        ]);
      } else if (typeof reply === "object" && reply !== null) {
        // Case 2: If reply is a JSON object
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply?.data || reply,
            isJson: true, // Mark it as JSON
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: "No valid reply received.",
            isJson: false,
          },
        ]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const switchWallet = () => {
    setActiveWallet((prev) => (prev % totalWallets) + 1);
  };

  const sendMessage = (text = message) => {
    if (text.trim() && socket) {
      const messageData = {
        event: "chat_message",
        data: {
          user_input: text,
          address: address || "0xE274274fE850788FDA67d6DfD26Cee5ab51b34C3",
          chat_history: "",
        },
      };

      socket.emit("chat_message", messageData);

      setMessages((prev) => [...prev, { wallet: "You", content: text }]);
      setMessage("");
      setLoading(true);
    }
  };

  // --------- Voice Recording and Sending ---------
  const startRecording = async () => {
    try {
      setRecording(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        formData.append("model", "whisper-1");
        formData.append("language", "en"); // Force English transcription

        // Safely use environment variable
        const response = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: formData,
          }
        );

        const data = await response.json();
        if (data.text) {
          sendMessage(data.text);
        }
        setRecording(false);
      });

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000);
    } catch (error) {
      console.error("Recording error:", error);
      setRecording(false);
    }
  };

  // --------- End Recording and Sending ---------

  return (
    <>
      {!messages.some((msg) => msg.wallet === "You") && (
        <h2 className="text-2xl font-bold mb-4 dark:text-white max-w-5xl mx-auto text-center mt-[20rem]">
          What can I help with?
        </h2>
      )}

      <div className="max-w-5xl mx-auto p-4 text-center">
        {/* System Status */}
        <div className="text-center mb-4">
          {messages.find((msg) => msg.wallet === "System") && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              System: Connected
            </p>
          )}
        </div>

        {/* Chat Messages */}
        <div
          ref={messageContainerRef}
          className="w-full max-h-[28rem] overflow-y-auto  rounded-md p-2 scroll-auto"
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
                    ? "bg-gray-200 text-black"
                    : " text-gray-800 dark:text-gray-200 max-w-[80%] text-left"
                } whitespace-pre-wrap `}
              >
                {msg.isJson ? (
                  <div className="mt-1">
                    {Object.entries(msg.content).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <strong>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>{" "}
                        {typeof value === "object" && value !== null ? (
                          <div>
                            {Object.entries(value).map(
                              ([nestedKey, nestedValue]) => (
                                <div key={nestedKey}>
                                  <strong>
                                    {nestedKey.charAt(0).toUpperCase() +
                                      nestedKey.slice(1)}
                                    :
                                  </strong>{" "}
                                  {nestedValue}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          value
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg text-sm  text-gray-800 dark:text-gray-200">
                Generating...
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="mt-4 flex flex-col items-center gap-2 bg-white dark:bg-[#101010] rounded-xl border border-[#A0AEC0] dark:border-gray-700 p-2 pt-3 shadow-sm w-full h-[6rem] scroll-auto">
          {/* Input and Actions */}
          <div className="w-full flex items-center gap-2">
            <input
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 dark:text-gray-200 dark:placeholder-gray-400"
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

            <button
              className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600"
              onClick={sendMessage}
            >
              <img src={Icon} alt="Send" className="h-4 w-4" />
            </button>

            <button
              className={`h-8 w-8 rounded-full ${
                recording ? "bg-red-600" : "bg-black"
              } text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600`}
              onClick={startRecording}
              disabled={recording}
            >
              <Mic />
            </button>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="flex justify-between items-center gap-3 mt-4">
          {/* same Holding / Trending / Gainers cards */}
        </div>
      </div>
    </>
  );
};

export default NavigationTabsWithChat;
