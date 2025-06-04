import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Icon from "../../public/Icon.svg";
import { chatBaseUrl } from "@/hooks/fireApi";
import { Mic } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Typewriter } from "@/lib/Typewriter";
import ConfirmationModal from "./ConfirmationModal";

const NavigationTabsWithChat = () => {
  // State variables
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [myToken, setMyToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fullResponse, setFullResponse] = useState("");
  const [email, setEmail] = useState(null);
  const [checkConfirmation, setCheckConfirmation] = useState(null);
  const messageContainerRef = useRef(null);
  const hasHandledIntents = useRef({ intent0: false, intent1: false });
  const [finalReply, setFinalReply] = useState(null);

  // New state for better intent handling
  const [currentIntentIndex, setCurrentIntentIndex] = useState(0);
  const [processedIntents, setProcessedIntents] = useState([]);
  const [allIntentsData, setAllIntentsData] = useState(null);

  const [userAddresses, setUserAddresses] = useState({
    solana: "",
    ethereum: "",
    polygon: "",
  });

  // Voice recording animation states
  const [audioLevels, setAudioLevels] = useState([]);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  useEffect(() => {
    // Get addresses from localStorage
    const solanaAddress = localStorage.getItem("solana-address") || "";
    const ethereumAddress = localStorage.getItem("eth-address") || "";
    const polygonAddress = localStorage.getItem("polygon-address") || "";
    const bscAddress = localStorage.getItem("bsc-address") || "";

    // Update state with the addresses
    setUserAddresses({
      solana: solanaAddress,
      ethereum: ethereumAddress,
      polygon: polygonAddress,
      bsc: bscAddress,
    });
  }, []);

  // Initialize user data from localStorage
  useEffect(() => {
    const storeAddress = localStorage.getItem("address");
    const userVisitToken = localStorage.getItem("user-visited-dashboard");
    setMyToken(userVisitToken);
    setAddress(storeAddress);

    if (userVisitToken) {
      try {
        const decodedToken = jwtDecode(userVisitToken);
        setUserId(decodedToken.id);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    hasHandledIntents.current = { intent0: false, intent1: false };
    setCurrentIntentIndex(0);
    setProcessedIntents([]);
    setAllIntentsData(null);
  }, [setUserId]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, loading, typingText]);

  useEffect(() => {
    hasHandledIntents.current = { intent0: false, intent1: false };
    setCurrentIntentIndex(0);
    setProcessedIntents([]);
    setAllIntentsData(null);
  }, [setUserId]);

  const handleResponseByType = (
    responseType,
    reply,
    fullReplyItem,
    checkConfirmation
  ) => {
    switch (responseType) {
      case "simple":
        // Showing simple text response immediately
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false,
            responseType: "simple",
          },
        ]);
        break;

      case "transaction":
        // Transaction responses will be handled separately - don't add to messages here
        console.log("Transaction response detected, will handle in flow");
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply[0],
            isJson: true,
            responseType: "transaction",
          },
        ]);
        break;

      case "all_wallet_addresses":
        // Handle wallet addresses display
        const addresses = reply.all_wallet_addresses || reply;
        let formattedAddresses;

        if (Array.isArray(addresses)) {
          // Format addresses with bold keys and proper spacing
          formattedAddresses = addresses
            .map(
              (addr, index) =>
                `🔹 Wallet ${index + 1}\n` +
                `Chain: ${addr.chain}\n` +
                `Address: ${addr.address}\n`
            )
            .join("\n");
        } else {
          formattedAddresses = JSON.stringify(addresses, null, 2);
        }

        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: formattedAddresses,
            isJson: false,
            responseType: "all_wallet_addresses",
            isMarkdown: true,
          },
        ]);
        break;

      case "get_token_balance":
        // Show token balance
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "get_token_balance",
          },
        ]);
        break;

      case "get_token_info":
        // Show token info
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "get_token_info",
          },
        ]);
        break;

      // Show user balance
      case "get_user_balance":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "get_user_balance",
          },
          {
            data: {
              user_id: 2,
              user_input:
                "I want you to buy 5 USDC Ethereum at $10 then transfer 0.1 USDC ethereum to 0x64f9A95F529FA6E48e754F95ee32B2069A211B01",
              // "user_input" : "buy 5 usdc solana at $10 and sell them when the price reaches $10",
              email_address: "shariq@gmail.com",
              solana_address: "BQABUqf9hxkzYNtnfXZuepBnuzZwiCgBeHdNUGWhJcMH",
              ethereum_address: "0x64f9A95F529FA6E48e754F95ee32B2069A211B01",
              polygon_address: "0x67B94473D81D0cd00849D563C94d0432Ac988B49",
              chat_history: [
                {
                  user: "buy 5 usdc solana at $10 and sell them when the price reaches $10.",
                  bot_reply: [
                    {
                      action: "buy",
                      quantity: 5,
                      token: "USDC",
                      chain: "solana",
                      price_per_each_coin: 10,
                      time_of_execution: "future",
                      source_wallet_address:
                        "0x64f9A95F529FA6E48e754F95ee32B2069A211B01",
                      receiver_wallet_address: null,
                    },
                  ],
                },
              ],
              bearer_token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJjaGVja0BnbWFpbC5jb20iLCJpYXQiOjE3NDY1MTgwNDB9.fs1DLqjvy51nbU4nXp2ktr3x5hjlYOuCr0pI-SAyVJU",
              is_confirmed1: false,
              is_confirmed2: true,
              requires_confirmation: true,
            },
          },
        ]);
        break;

      default:
        // Handle unknown response types
        console.log(`Unknown response type: ${responseType}`);
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: responseType || "unknown",
          },
        ]);
    }
  };

  const [transactionIntents, setTransactionIntents] = useState([]);

  useEffect(() => {
    const newSocket = io(chatBaseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 1000000,
    });

    setSocket(newSocket);

    newSocket.on("connection_status", (data) => {
      setMessages((prev) => [
        { wallet: "System", content: data.status },
        ...prev,
      ]);
    });

    newSocket.on("error", (data) => {
      setMessages((prev) => [
        ...prev,
        { wallet: "Error", content: data.message },
      ]);
    });

    newSocket.on("chat_response", (rawData) => {
      setLoading(false);

      let data;

      if (Array.isArray(rawData) && rawData.length > 1) {
        try {
          data = JSON.parse(rawData[1]);
        } catch (err) {
          console.error("Failed to parse socket data:", err);
          return;
        }
      } else if (typeof rawData === "string") {
        try {
          data = JSON.parse(rawData);
        } catch (err) {
          console.error("Failed to parse socket data:", err);
          return;
        }
      } else {
        data = rawData;
      }

      const replies = data?.data?.replies;
      if (!Array.isArray(replies)) {
        console.error("Invalid replies format");
        return;
      }

      const checkConfirmation = data;
      setCheckConfirmation(checkConfirmation);
      console.log("Received replies:", checkConfirmation);

      const transactionReplies = replies.filter(
        (item) => item.response_type === "transaction"
      );

      const nonTransactionReplies = replies.filter(
        (item) => item.response_type !== "transaction"
      );

      nonTransactionReplies.forEach((replyItem, index) => {
        const { reply, response_type } = replyItem;
        handleResponseByType(
          response_type,
          reply,
          replyItem,
          checkConfirmation
        );
      });

      if (transactionReplies.length > 0) {
        console.log(transactionReplies, "transactionReplies");
        if (
          transactionReplies.length === 1 &&
          !hasHandledIntents.current.intent0
        ) {
          setPendingAction({
            ...transactionReplies[0].reply,
            intentIndex: 0,
            response_type: "transaction",
          });
          console.log("second check", showConfirmation);
          setShowConfirmation(true);
          hasHandledIntents.current.intent0 = true;
        } else {
          setAllIntentsData(checkConfirmation);
          setCurrentIntentIndex(0);
          setProcessedIntents([]);
          setPendingAction({
            ...transactionReplies[0].reply,
            intentIndex: 0,
            response_type: "transaction",
          });
          console.log("third check", showConfirmation);
          setShowConfirmation(false); //update 1
          hasHandledIntents.current.intent0 = false;
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle sequential intent processing (for multiple transactions only)
  useEffect(() => {
    const replies = allIntentsData?.data?.replies;
    if (!Array.isArray(allIntentsData?.data?.replies) || replies.length === 0) {
      return;
    }

    const transactionReplies = replies.filter(
      (item) => item.response_type === "transaction"
    );

    // Early return if we've processed all transactions
    if (processedIntents.length === transactionReplies.length) {
      //update 2
      console.log("All transactions completed");
      console.log("check 5 check", showConfirmation);

      setMessages((prev) => [
        ...prev,
        {
          wallet: "Chat",
          content: "All transactions processed successfully!",
          isJson: false,
          status: "success",
        },
      ]);
      setShowConfirmation(false);
      setAllIntentsData(null);
      setCurrentIntentIndex(0);
      setProcessedIntents([]);
      hasHandledIntents.current = { intent0: false, intent1: false };
      return;
    }

    const currentHandledKey = `intent${currentIntentIndex}`;

    // Only proceed if we haven't handled this intent yet and modal isn't showing
    if (
      !hasHandledIntents.current[currentHandledKey] &&
      !showConfirmation &&
      currentIntentIndex < transactionReplies.length
    ) {
      console.log(`Opening modal for transaction intent ${currentIntentIndex}`);

      const currentReply = transactionReplies[currentIntentIndex];

      console.log(currentReply, "currentReply currentReply currentReply");

      setPendingAction({
        ...currentReply.reply,
        intentIndex: currentIntentIndex,
        response_type: "transaction",
      });

      if (allIntentsData?.data?.replies[0]) {
        setShowConfirmation(true);
        return;
      }
      setShowConfirmation(false);
    }
  }, [allIntentsData, currentIntentIndex, processedIntents]);
  // const handleConfirmation = (confirmed) => {
  //   setShowConfirmation(false);

  //   if (pendingAction && socket) {
  //     const messageData = {
  //       event: "chat_message",
  //       data: {
  //         user_input: lastUserMessage,
  //         address: address || import.meta.env.VITE_WALLET_ADDRESS,
  //         solana_address: userAddresses?.solana || "dont have user address",
  //         ethereum_address: userAddresses?.ethereum || "dont have user address",
  //         polygon_address: userAddresses?.polygon || "dont have user address",
  //         chat_history: messages,
  //         bearer_token: myToken,
  //         is_confirmed1:
  //           pendingAction.intentIndex === 0
  //             ? confirmed
  //             : checkConfirmation?.data?.is_confirmed1,
  //         is_confirmed2:
  //           pendingAction.intentIndex === 1
  //             ? confirmed
  //             : checkConfirmation?.data?.is_confirmed2,
  //         user_id: userId,
  //         transaction_data: pendingAction,
  //         requires_processing: pendingAction.intentIndex === 1 ? false : true,
  //       },
  //     };

  //     if(pendingAction.intentIndex === 1) {
  //     socket.emit("chat_message", messageData);
  //     setLoading(true);
  //     return;
  //     }

  //     // Show confirmation message
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         wallet: "Chat",
  //         content: `Transaction ${pendingAction.intentIndex + 1} ${
  //           confirmed ? "confirmed" : "denied"
  //         }`,
  //         isJson: false,
  //         status: confirmed ? "success" : "error",
  //       },
  //     ]);

  //     // Add the transaction data to messages for display
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         wallet: "Chat",
  //         content: {
  //           action: pendingAction.action,
  //           quantity: pendingAction.quantity,
  //           token: pendingAction.token,
  //           chain: pendingAction.chain,
  //           price_per_each_coin: pendingAction.price_per_each_coin,
  //           source_wallet_address: pendingAction.source_wallet_address,
  //           receiver_wallet_address: pendingAction.receiver_wallet_address,
  //         },
  //         isJson: true,
  //         responseType: "transaction",
  //       },
  //     ]);

  //     // Update processed intents and move to next if multiple transactions
  //     if (allIntentsData) {
  //       setProcessedIntents((prev) => [...prev, pendingAction.intentIndex]);
  //       setCurrentIntentIndex((prev) => prev + 1);
  //     }
  //   }
  // };

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);

    // Store the confirmation status for this intent
    const updatedProcessedIntents = [
      ...processedIntents,
      { index: pendingAction.intentIndex, confirmed },
    ];
    setProcessedIntents(updatedProcessedIntents);

    // Show confirmation message in chat
    setMessages((prev) => [
      ...prev,
      {
        wallet: "Chat",
        content: `Transaction ${pendingAction.intentIndex + 1} ${
          confirmed ? "confirmed" : "denied"
        }`,
        isJson: false,
        status: confirmed ? "success" : "error",
      },
    ]);

    // Check if all intents are processed
    const transactionReplies =
      allIntentsData?.data?.replies?.filter(
        (item) => item.response_type === "transaction"
      ) || [];

      if (!allIntentsData) {
    // Single intent - send confirmation immediately
    const messageData = {
      event: "chat_message",
      data: {
        user_input: lastUserMessage,
        address: address || import.meta.env.VITE_WALLET_ADDRESS,
        solana_address: userAddresses?.solana || "dont have user address",
        ethereum_address: userAddresses?.ethereum || "dont have user address",
        polygon_address: userAddresses?.polygon || "dont have user address",
        chat_history: messages,
        bearer_token: myToken,
        is_confirmed1: pendingAction.intentIndex === 0 ? confirmed : false,
        is_confirmed2: pendingAction.intentIndex === 1 ? confirmed : false,
        user_id: userId,
        // transaction_data: pendingAction,
        requires_processing: false,
        requires_confirmation: false,
        previous_queries: [
          {
            reply: pendingAction
          }
        ]
      },
    };

    socket.emit("chat_message", messageData);
    setLoading(true);
    return;
  }

    if (updatedProcessedIntents.length === transactionReplies.length) {
      // All intents processed - now send FINAL socket message
      const messageData = {
        event: "chat_message",
        data: {
          user_input: lastUserMessage,
          address: address || import.meta.env.VITE_WALLET_ADDRESS,
          solana_address: userAddresses?.solana || "dont have user address",
          ethereum_address: userAddresses?.ethereum || "dont have user address",
          polygon_address: userAddresses?.polygon || "dont have user address",
          chat_history: messages,
          bearer_token: myToken,
          is_confirmed1: updatedProcessedIntents[0]?.confirmed || false,
          is_confirmed2: updatedProcessedIntents[1]?.confirmed || false,
          user_id: userId,
          previous_queries: [
            transactionReplies[0],
            transactionReplies[1],
        ],
          requires_processing: false,
          requires_confirmation: false,
        },
      };

      socket.emit("chat_message", messageData);
      setLoading(true);

      // Reset all intent states
      setAllIntentsData(null);
      setCurrentIntentIndex(0);
      setProcessedIntents([]);
    } else {
      // Move to next intent
      setCurrentIntentIndex((prev) => prev + 1);
    }
  };
  const sendMessage = (text = message) => {
    if (text.trim() && socket) {
      const chatHistory = messages.reduce((acc, msg, i) => {
        if (msg.wallet === "You" && messages[i + 1]?.wallet === "Chat") {
          acc.unshift({
            user: msg.content,
            bot_reply: messages[i + 1].content,
          });
        }
        return acc;
      }, []);

      const messageData = {
        event: "chat_message",
        data: {
          user_input: text,
          solana_address: userAddresses?.solana || "dont have user adress",
          ethereum_address: userAddresses?.ethereum || "dont have user adress",
          polygon_address: userAddresses?.polygon || "dont have user adress",
          chat_history: chatHistory,
          bearer_token: myToken,
          is_confirmed1: false,
          is_confirmed2: false,
          user_id: userId,
          email_address: email,
          requires_processing: true,
          requires_confirmation: true
        },
      };

      socket.emit("chat_message", messageData);
      setLastUserMessage(text);
      setMessages((prev) => [...prev, { wallet: "You", content: text }]);
      setMessage("");
      setLoading(true);

      // Reset intent handling for new message
      hasHandledIntents.current = { intent0: false, intent1: false };
      setCurrentIntentIndex(0);
      setProcessedIntents([]);
      setAllIntentsData(null);
      setShowConfirmation(false);
    }
  };

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
        formData.append("language", "en");

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

  const stopRecording = async () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (microphoneRef.current && analyserRef.current) {
      microphoneRef.current.disconnect(analyserRef.current);
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      await audioContextRef.current.close();
    }

    setRecording(false);
    mediaRecorderRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    microphoneRef.current = null;
  };

  const customStyles = `
    @keyframes cursor-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-cursor-blink {
      animation: cursor-blink 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }
  `;
  console.log(showConfirmation, "showConfirmation test check ");
  console.log(pendingAction, typeof pendingAction, "pendingAction test check ");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* {showConfirmation && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-lg text-center font-bold">
              Confirm Transaction {pendingAction?.intentIndex + 1}
            </h3>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
              Are you sure you want to proceed?
            </p>
            <div className="space-y-3 mb-6">
              {pendingAction &&
                Object.entries(pendingAction)
                  .filter(
                    ([key]) =>
                      ![
                        "intentIndex",
                        "isFirstIntent",
                        "isSecondIntent",
                      ].includes(key)
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        {key}:
                      </span>
                      <span className="font-medium truncate max-w-[180px]">
                        {value !== null ? value : "N/A"}
                      </span>
                    </div>
                  ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Denied
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="px-4 py-2 rounded-md cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )} */}

      {showConfirmation && (
        <ConfirmationModal
          confirmationIndexNumber={pendingAction?.intentIndex + 1}
          intent={pendingAction}
          socket={socket}
          handleConfirmation={handleConfirmation}
        />
      )}

      {!messages.some((msg) => msg.wallet === "You") && (
        <h2 className="text-2xl font-bold mb-4 dark:text-white max-w-5xl mx-auto text-center">
          What can I help with?
        </h2>
      )}

      <div className="max-w-5xl mx-auto p-4 text-center">
        {messages.find((msg) => msg.wallet === "System") && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              System: Connected
            </p>
          </div>
        )}

        <div
          ref={messageContainerRef}
          className="w-full lg:h-[24rem] h-[16rem] overflow-y-auto rounded-md p-2 scroll-auto"
        >
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;

            const messageColorClasses = {
              error:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
              success:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              default: "text-gray-800 dark:text-gray-200",
            };

            const getMessageColor = () => {
              if (msg.wallet === "You") return "bg-gray-200 text-black";
              if (msg.status === "error") return messageColorClasses.error;
              if (msg.status === "success") return messageColorClasses.success;
              return messageColorClasses.default;
            };

            return (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.wallet === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-auto text-left whitespace-pre-wrap ${getMessageColor()}`}
                >
                  {msg.wallet === "Chat" && isLast && isTyping ? (
                    <Typewriter text={fullResponse} className="relative" />
                  ) : msg.isJson ? (
                    <div className="mt-1">
                      {/* Display single intent data */}
                      {typeof msg.content === "object" &&
                      msg.content !== null ? (
                        <div>
                          <h4 className="font-bold mb-2">
                            {msg.content.action
                              ? `Action: ${msg.content.action}`
                              : null}
                          </h4>
                          <div className="pl-4">
                            {Object.entries(msg.content)
                              .filter(
                                ([key]) =>
                                  !["success", "message", "status"].includes(
                                    key
                                  )
                              )
                              .map(([key, value]) => {
                                return (
                                  <div key={key} className="mb-1">
                                    <strong>
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                      :
                                    </strong>{" "}
                                    {/* <Typewriter text={value} className="relative" /> */}
                                        {value}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ) : (
                        // <>{msg.content}</>
                        <>
                          <Typewriter text={msg.content} className="relative" />
                        </>
                      )}
                    </div>
                  ) : typeof msg.content === "object" ? (
                    JSON.stringify(msg.content, null, 2)
                  ) : (
                    <Typewriter text={msg.content} className="relative" />
                    // msg.content
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && typingText && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 max-w-[80%] text-left whitespace-pre-wrap relative">
                {typingText}
                <span className="inline-block w-0.5 h-4 ml-0.5 bg-gray-800 dark:bg-gray-200 animate-cursor-blink absolute"></span>
              </div>
            </div>
          )}

          {loading && !isTyping && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                <span className="inline-flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                    style={{ animationDelay: "600ms" }}
                  ></span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 bg-white dark:bg-[#101010] rounded-xl border border-[#A0AEC0] dark:border-gray-700 p-2 pt-3 shadow-sm w-full h-[6rem]">
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
              disabled={isTyping}
            />

            <button
              className={`h-8 w-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600 ${
                isTyping ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={sendMessage}
              disabled={isTyping}
            >
              <img src={Icon} alt="Send" className="h-4 w-4" />
            </button>

            <button
              className={`h-8 w-8 rounded-full ${
                recording ? "bg-red-600 animate-pulse" : "bg-black"
              } text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600 ${
                isTyping ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={recording ? stopRecording : startRecording}
              disabled={isTyping}
            >
              {recording ? (
                <div className="flex gap-0.5">
                  <span
                    className="w-1 h-2 bg-white animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1 h-3 bg-white animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1 h-4 bg-white animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              ) : (
                <Mic size={16} />
              )}
            </button>

            {/* {showRecordingModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className={`w-24 h-24 rounded-full ${
                            recording
                              ? "bg-red-500 animate-pulse"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                      <div className="relative flex items-center justify-center w-32 h-32">
                        {audioLevels.map((level, i) => (
                          <div
                            key={i}
                            className="w-2 bg-red-500 mx-0.5 rounded-full"
                            style={{
                              height: `${Math.min(100, level)}%`,
                              transition: "height 0.1s ease-out",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-lg font-medium mb-2 dark:text-white">
                      {recording ? "Listening..." : "Processing..."}
                    </p>

                    <p className="text-2xl font-bold mb-4 dark:text-white">
                      {formatTime(recordingTime)}
                    </p>

                    <button
                      onClick={stopRecording}
                      className="px-6 py-2 rounded-full bg-red-500 text-white flex items-center gap-2"
                    >
                      <MicOff size={18} />
                      Stop Recording
                    </button>

                    <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">
                      {recording ? "Speak now..." : "Processing your voice..."}
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationTabsWithChat;
