import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { chatBaseUrl, chatHistoryUrl, FireApi } from "@/hooks/fireApi";
import { jwtDecode } from "jwt-decode";
import { Typewriter } from "@/lib/Typewriter";
import ConfirmationModal from "./ConfirmationModal";
import { useHistory } from "@/Context/HistoryContext";
import Catoshi from "./Catoshi";
import UserBalance from "./UserBalance";
import WalletAddresses from "./WalletAddresses";
import MyAssets from "./MyAssets";
import AllPortfolio from "./AllPortfolio";
import TokenBalance from "./TokenBalance";
import { IoMicOutline } from "react-icons/io5";
import CryptoDisplay from "./CryptoDisplay";
import { useProfile } from "@/Context/ProfileContext";
import ListTransactions from "./ListTransactions";
import { LucideWalletCards } from "lucide-react";

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

  // New state for better intent handling
  const [currentIntentIndex, setCurrentIntentIndex] = useState(0);
  const [processedIntents, setProcessedIntents] = useState([]);
  const [allIntentsData, setAllIntentsData] = useState(null);

  const [userAddresses, setUserAddresses] = useState({
    solana: "",
    ethereum: "",
    polygon: "",
    bsc: "",
  });

  const { userInfo } = useHistory();
  const { getWatchlistData } = useProfile();
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

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

  const toCamelCase = (str) => {
    return str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
  };

  const convertKeysToCamelCase = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => convertKeysToCamelCase(item));
    }

    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      // Skip empty string values
      if (value !== "") {
        const newKey = toCamelCase(key);
        newObj[newKey] = convertKeysToCamelCase(value);
      }
    });
    return newObj;
  };

  const handleResponseByType = (
    responseType,
    reply,
    fullReplyItem,
    checkConfirmation
  ) => {
    switch (responseType) {
      case "simple":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false,
            responseType: "simple",
            isHistory: false,
          },
        ]);
        break;

      case "toggle_watchlist":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false,
            responseType: "toggle_watchlist",
            isHistory: false,
          },
        ]);
        getWatchlistData();
        break;

      case "transaction":
        if (Array.isArray(reply)) {
          reply = reply.map((item) => {
            if (typeof item === "object" && item !== null) {
              return Object.fromEntries(
                Object.entries(item).map(([key, val]) => [
                  key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()),
                  val,
                ])
              );
            }
            return item;
          });
        }

        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply[0],
            isJson: true,
            responseType: "transaction",
            isHistory: false,
          },
        ]);
        break;

      case "all_wallets_addresses":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false,
            responseType: "all_wallets_addresses",
            walletResponse: reply.all_wallets,
            walletTitle: reply.title,
            isHistory: false,
          },
        ]);
        break;

        case "all_portfolios":
          setMessages((prev) => [
            ... prev,
            {
              wallet: "Chat",
              content: reply,
              isJson: false,
              responseType: "all_portfolios",
              portfolioResponse: reply.all_portfolios,
              portfolioTitle: reply.title,
              isHistory: false,
            },
          ]);
          break;

          case "all_transactions":
          setMessages((prev) => [
            ...prev,
            {
              wallet: "Chat",
              content: reply,
              isJson: false,
              responseType: "all_transactions",
              transactionResponse: reply.all_transactions,
              transactionTitle: reply.title,
              isHistory: false
            }
          ]);
          break;

      case "all_assets":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false,
            responseType: "all_assets",
            assetResponse: reply.all_assets,
            isHistory: false,
          },
        ]);
        break;

      case "get_token_balance":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "get_token_balance",
            tokenResponse: reply.data || reply,
            tokenTitle: reply.title || reply,
            isHistory: false,
          },
        ]);
        break;

      case "get_top_cryptos":
        // Updated to use the new CryptoDisplay component
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: false,
            responseType: "get_top_cryptos",
            cryptoData: reply?.data || reply,
            cryptoTitle: reply?.title || reply,
            cryptoMetric: reply?.metric || "market_cap",
            isHistory: false,
          },
        ]);
        break;

      case "all_copy_trades":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply?.all_copy_trades[0],
            isJson: true,
            responseType: "all_copy_trades",
            isHistory: false,
          },
        ]);
        break;

      case "get_user_balance":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "get_user_balance",
            chainData: reply,
            isHistory: false,
          },
        ]);
        break;

      case "get_token_info":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "get_token_info",
            isHistory: false,
          },
        ]);
        break;

      case "chatoshi":
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: "chatoshi",
            chatoshiData: reply,
            isHistory: false,
          },
        ]);
        break;

      default:
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply,
            isJson: true,
            responseType: responseType || "unknown",
            isHistory: false,
          },
        ]);
    }
  };

  useEffect(() => {
    const newSocket = io(chatBaseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 1000000,
    });

    setSocket(newSocket);

   newSocket.on("connection_status", (data) => {
  if (data.status !== "connected") {
    setMessages((prev) => [
      { wallet: "System", content: data.status, isHistory: false },
      ...prev,
    ]);
  }
});


    newSocket.on("error", (data) => {
      setMessages((prev) => [
        ...prev,
        { wallet: "Error", content: data.message, isHistory: false },
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

      if (data?.response_type === "chatoshi") {
        handleResponseByType(
          "chatoshi",
          data.data.replies,
          data,
          checkConfirmation
        );
        return;
      }

      const replies = data?.data?.replies;
      if (!Array.isArray(replies)) {
        console.error("Invalid replies format");
        return;
      }

      const checkConfirmation = data;
      setCheckConfirmation(checkConfirmation);

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
        if (
          transactionReplies.length === 1 &&
          !hasHandledIntents.current.intent0
        ) {
          setPendingAction({
            ...transactionReplies[0].reply,
            intentIndex: 0,
            response_type: "transaction",
          });
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
          setShowConfirmation(false);
          hasHandledIntents.current.intent0 = false;
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const replies = allIntentsData?.data?.replies;
    if (!Array.isArray(allIntentsData?.data?.replies) || replies.length === 0) {
      return;
    }

    const transactionReplies = replies.filter(
      (item) => item.response_type === "transaction"
    );

    if (processedIntents.length === transactionReplies.length) {
      setMessages((prev) => [
        ...prev,
        {
          wallet: "Chat",
          content: "All transactions processed successfully!",
          isJson: false,
          status: "success",
          isHistory: false,
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

    if (
      !hasHandledIntents.current[currentHandledKey] &&
      !showConfirmation &&
      currentIntentIndex < transactionReplies.length
    ) {
      const currentReply = transactionReplies[currentIntentIndex];

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

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);

    const updatedProcessedIntents = [
      ...processedIntents,
      { index: pendingAction.intentIndex, confirmed },
    ];
    setProcessedIntents(updatedProcessedIntents);

    setMessages((prev) => [
      ...prev,
      {
        wallet: "Chat",
        content: `Transaction ${pendingAction.intentIndex + 1} ${
          confirmed ? "confirmed" : "denied"
        }`,
        isJson: false,
        status: confirmed ? "success" : "error",
        isHistory: false,
      },
    ]);

    const transactionReplies =
      allIntentsData?.data?.replies?.filter(
        (item) => item.response_type === "transaction"
      ) || [];

    if (!allIntentsData) {
      const messageData = {
        event: "chat_message",
        data: {
          user_input: lastUserMessage,
          address: address || import.meta.env.VITE_WALLET_ADDRESS,
          solana_address: userAddresses?.solana || "dont have user address",
          ethereum_address: userAddresses?.ethereum || "dont have user address",
          polygon_address: userAddresses?.polygon || "dont have user address",
          bsc_address: userAddresses?.bsc || "don't have user address",
          chat_history: messages,
          bearer_token: myToken,
          is_confirmed1: pendingAction.intentIndex === 0 ? confirmed : false,
          is_confirmed2: pendingAction.intentIndex === 1 ? confirmed : false,
          user_id: userId,
          requires_processing: false,
          requires_confirmation: false,
          email_address: email,
          userId: userId,
          session_id: userInfo?.sessionId,
          previous_queries: [
            {
              reply: pendingAction,
            },
          ],
        },
      };

      socket.emit("chat_message", messageData);
      setLoading(true);
      return;
    }

    if (updatedProcessedIntents.length === transactionReplies.length) {
      const messageData = {
        event: "chat_message",
        data: {
          user_input: lastUserMessage,
          address: address || import.meta.env.VITE_WALLET_ADDRESS,
          solana_address: userAddresses?.solana || "dont have user address",
          ethereum_address: userAddresses?.ethereum || "dont have user address",
          polygon_address: userAddresses?.polygon || "dont have user address",
          bsc_address: userAddresses?.bsc || "don't have user address",
          chat_history: messages,
          bearer_token: myToken,
          is_confirmed1: updatedProcessedIntents[0]?.confirmed || false,
          is_confirmed2: updatedProcessedIntents[1]?.confirmed || false,
          user_id: userId,
          session_id: userInfo?.sessionId,
          email_address: email,
          previous_queries: [transactionReplies[0], transactionReplies[1]],
          requires_processing: false,
          requires_confirmation: false,
        },
      };

      socket.emit("chat_message", messageData);
      setLoading(true);

      setAllIntentsData(null);
      setCurrentIntentIndex(0);
      setProcessedIntents([]);
    } else {
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
          bsc_address: userAddresses?.bsc || "don't have user address",

          chat_history: chatHistory,
          bearer_token: myToken,
          is_confirmed1: false,
          is_confirmed2: false,
          user_id: userId,
          email_address: email,
          session_id: userInfo?.sessionId,
          requires_processing: true,
          requires_confirmation: true,
        },
      };

      socket.emit("chat_message", messageData);
      setLastUserMessage(text);
      setMessages((prev) => [
        ...prev,
        { wallet: "You", content: text, isHistory: false },
      ]);
      setMessage("");
      setLoading(true);

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

  const resetChat = () => {
    setMessages([]);
    setMessage("");
    setLastUserMessage("");
    setIsTyping(false);
    setCurrentIntentIndex(0);
    setProcessedIntents([]);
    setAllIntentsData(null);
    hasHandledIntents.current = { intent0: false, intent1: false };
  };

  const GetHistoryChat = async () => {
    try {
      if (!userId || !userInfo?.sessionId) {
        console.log("Missing userId or sessionId");
        resetChat();
        return;
      }

      const chatRes = await FireApi(
        `/get-chat-sessions/${userId}/${userInfo.sessionId}`,
        "GET",
        null,
        chatHistoryUrl
      );

      if (chatRes.data?.messages?.length > 0) {
        const formattedMessages = processApiResponse(chatRes);
        setMessages(formattedMessages);
      } else {
        resetChat();
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      resetChat();
    }
  };

  const processApiResponse = (apiResponse) => {
    const formattedMessages = [];

    const toCamelCase = (str) => {
      return str.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
      );
    };

    const convertKeysToCamelCase = (obj) => {
      if (!obj || typeof obj !== "object") return obj;

      const newObj = {};
      Object.keys(obj).forEach((key) => {
        if (obj.keys === null || obj.keys === "") {
          return null;
        }
        const newKey = toCamelCase(key);
        newObj[newKey] = convertKeysToCamelCase(obj[key]);
      });
      return newObj;
    };

    if (!apiResponse.data?.messages) {
      console.error("No messages found in API response");
      return formattedMessages;
    }

    apiResponse.data.messages.forEach((msg) => {
      try {
        formattedMessages.push({
          wallet: "You",
          content: msg.user_input?.trim() || "No user input",
          timestamp: msg.timestamp,
          isHistory: true,
        });

        let responseData;
        try {
          responseData =
            typeof msg.response === "string"
              ? JSON.parse(msg.response)
              : msg.response;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          responseData = {
            message: "Could not parse response",
            status: false,
          };
        }

        if (responseData?.data?.replies) {
          responseData.data.replies.forEach((replyItem) => {
            const responseType = replyItem.response_type || "simple";
            let replyContent = replyItem.reply;

            if (
              (responseType === "transaction" ||
                responseType === "transaction_complete") &&
              typeof replyContent === "object"
            ) {
              replyContent = convertKeysToCamelCase(replyContent);
            }

            let content;
            let isJson = false;
            let additionalProps = {};

            switch (responseType) {
              case "simple":
                content =
                  typeof replyContent === "string"
                    ? replyContent.trim()
                    : JSON.stringify(replyContent, null, 2);
                break;

              case "toggle_watchlist":
                content =
                  typeof replyContent === "string"
                    ? replyContent.trim()
                    : JSON.stringify(replyContent, null, 2);
                break;

              case "transaction":
              case "transaction_complete":
                content = replyContent;
                isJson = true;
                additionalProps = {
                  responseType,
                  transactionData: replyContent,
                };
                break;

              case "all_wallets_addresses":
                content = replyContent;
                additionalProps = {
                  responseType: "all_wallets_addresses",
                  walletResponse: replyContent.all_wallets || replyContent,
                  walletTitle: replyContent.title,
                  isJson: false,
                };
                break;

              case "all_portfolios":
                content = replyContent;
                additionalProps = {
                  responseType: "all_portfolios",
                  portfolioResponse:
                    replyContent.all_portfolios || replyContent,
                    portfolioTitle: replyContent.title || replyContent,
                  isJson: false,
                };
                break;

                case "all_transactions":
                  content = replyContent;
                  additionalProps = {
                    responseType: "all_transactions",
                    transactionResponse: 
                    replyContent.all_transactions || replyContent,
                    portfolioTitle: replyContent.title || replyContent,
                    isJson: false,
                  };
                  break;

              case "get_top_cryptos":
                content = replyContent;
                additionalProps = {
                  responseType: "get_top_cryptos",
                  cryptoData: replyContent?.data || replyContent,
                  cryptoTitle: replyContent?.title || replyContent,
                  cryptoMetric: replyContent?.metric || "market_cap",
                };
                break;

              case "get_token_balance":
                content = replyContent;
                additionalProps = {
                  responseType: "get_token_balance",
                  tokenResponse: replyContent.data || replyContent,
                  tokenTitle: replyContent.title || replyContent,
                };
                break;

              case "get_token_info":
              case "get_user_balance":
                content = replyContent;
                isJson = true;
                additionalProps = {
                  responseType: "get_user_balance",
                  chainData: replyContent.data || replyContent,
                };
                break;

              //          case "all_assets":
              // setMessages((prev) => [
              //   ...prev,
              //   {
              //     wallet: "Chat",
              //     content: reply,
              //     isJson: false,
              //     responseType: "all_assets",
              //     assetResponse: reply.all_assets,
              //     isHistory: false,
              //   },
              // ]);
              // break;

              case "all_assets":
                content = replyContent.all_assets || replyContent;
                isJson = true;
                additionalProps = {
                  responseType: "all_assets",
                  assetResponse: content,
                };
                break;

              case "all_copy_trades":
                content = replyContent?.all_copy_trades?.[0] || replyContent;
                isJson = true;
                additionalProps = {
                  responseType: "all_copy_trades",
                  copyTradesData: content,
                };
                break;

              case "chatoshi":
                content = replyContent;
                isJson = true;
                additionalProps = {
                  responseType: "chatoshi",
                  chatoshiData: replyContent,
                };
                break;

              case "error":
                content =
                  typeof replyContent === "string"
                    ? replyContent.trim()
                    : JSON.stringify(replyContent, null, 2);
                additionalProps = {
                  responseType: "error",
                  status: "error",
                };
                break;

              default:
                content =
                  typeof replyContent === "string"
                    ? replyContent.trim()
                    : JSON.stringify(replyContent, null, 2);
                additionalProps = {
                  responseType: responseType || "unknown",
                };
            }

            formattedMessages.push({
              wallet: "Chat",
              content: content,
              timestamp: msg.timestamp,
              isJson: isJson || typeof replyContent === "object",
              isHistory: true,
              ...additionalProps,
            });
          });
        } else {
          formattedMessages.push({
            wallet: "Chat",
            content: responseData.message || "No response available",
            timestamp: msg.timestamp,
            responseType: "simple",
            isHistory: true,
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
        formattedMessages.push({
          wallet: "Chat",
          content: "Error displaying message",
          timestamp: msg.timestamp,
          responseType: "error",
          isHistory: true,
        });
      }
    });

    return formattedMessages;
  };

  useEffect(() => {
    const token = localStorage.getItem("user-visited-dashboard");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (!userId || userId !== decoded.id) {
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    if (userId && userInfo?.sessionId) {
      GetHistoryChat();
    } else {
      resetChat();
    }
  }, [userInfo?.sessionId, userId]);

  return (
    <div className="min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {showConfirmation && (
        <ConfirmationModal
          confirmationIndexNumber={pendingAction?.intentIndex + 1}
          intent={convertKeysToCamelCase(pendingAction)}
          socket={socket}
          handleConfirmation={handleConfirmation}
        />
      )}

      {/* Main Chat Container - Flex-grow to take available space */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full mx-2 md:px-4 md:py-4">
        {/* Header - Only show when no messages */}
        {!messages.some((msg) => msg.wallet === "You") && (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">
              What can I help with?
            </h2>
          </div>
        )}

        {/* Connection Status */}
        {messages.find((msg) => msg.wallet === "System") && (
          <div className="hidden text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              System: Connected
            </p>
          </div>
        )}

        {/* Messages Container - Flex-grow with proper overflow */}
        <div className="flex-1 flex flex-col">
          <div
            ref={messageContainerRef}
            className="lg:w-[80%] lg:mx-auto xl:w-[82%] w-[100%] flex-1 overflow-y-auto overflow-x-hidden md:space-y-4 md:px-2"
            style={{
              maxHeight: "calc(100vh - 150px)",
              minHeight: "300px",
            }}
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
                if (msg.wallet === "You")
                  return "bg-gray-200 dark:bg-background dark:text-white dark:border dark:border-xs text-black";
                if (msg.status === "error") return messageColorClasses.error;
                if (msg.status === "success")
                  return messageColorClasses.success;
                return messageColorClasses.default;
              };

              return (
                <div
                  key={index}
                  className={`flex ${
                    msg.wallet === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`md:px-4 px-2 py-3 rounded-xl text-xs md:text-sm max-w-[100%] md:max-w-[75%] lg:max-w-[65%] text-left whitespace-pre-wrap ${getMessageColor()}`}
                  >
                    {msg.wallet === "Chat" &&
                    msg.responseType === "chatoshi" ? (
                      <Catoshi
                        data={msg.chatoshiData}
                        isHistory={msg.isHistory}
                      />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "get_top_cryptos" ? (
                      <CryptoDisplay
                        data={msg.cryptoData}
                        title={msg.cryptoTitle}
                      />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "get_user_balance" ? (
                      <UserBalance data={msg.chainData} />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "get_token_balance" ? (
                      <TokenBalance
                        data={msg.tokenResponse}
                        title={msg.tokenTitle}
                      />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "all_wallets_addresses" ? (
                      <WalletAddresses
                        data={msg.walletResponse}
                        title={msg.walletTitle}
                      />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "all_assets" ? (
                      <MyAssets data={msg.assetResponse} />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "all_portfolios" ? (
                      <AllPortfolio data={msg.portfolioResponse} title={msg.portfolioTitle} />
                    ) : msg.wallet === "Chat" &&
                      msg.responseType === "all_transactions" ? (
                        <ListTransactions data={msg.transactionResponse} title={msg.transactionTitle}/>
                      )
                    : msg.wallet === "Chat" && isLast && isTyping ? (
                      <Typewriter text={fullResponse} className="relative" />
                    ) : msg.isJson ? (
                      <div className="mt-1">
                        {typeof msg.content === "object" &&
                        msg.content !== null ? (
                          <div>
                            <h4 className="font-bold mb-2">
                              {msg.content.action
                                ? `Action: ${convertKeysToCamelCase(
                                    msg.content.action
                                  )}`
                                : null}
                            </h4>
                            <div className="pl-4">
                              {Object.entries(msg.content)
                                .filter(([key, value]) => {
                                  if (
                                    value === "" ||
                                    value === null ||
                                    value === undefined
                                  ) {
                                    return false;
                                  }
                                  if (
                                    ["success", "message", "status"].includes(
                                      key
                                    )
                                  ) {
                                    return false;
                                  }
                                  if (
                                    typeof value === "object" &&
                                    Object.keys(value).length === 0
                                  ) {
                                    return false;
                                  }
                                  return true;
                                })
                                .map(([key, value]) => {
                                  const formattedKey = key.replace(
                                    /_([a-z])/g,
                                    (g) => g[1].toUpperCase()
                                  );

                                  let displayValue;
                                  if (
                                    typeof value === "object" &&
                                    value !== null
                                  ) {
                                    if (
                                      Array.isArray(value) &&
                                      value.length === 0
                                    ) {
                                      return null;
                                    }
                                    displayValue = JSON.stringify(
                                      convertKeysToCamelCase(value),
                                      null,
                                      2
                                    );
                                  } else {
                                    displayValue =
                                      convertKeysToCamelCase(value);
                                  }

                                  return (
                                    <div key={key} className="mb-1">
                                      <strong>
                                        {formattedKey.charAt(0).toUpperCase() +
                                          formattedKey.slice(1)}
                                        :
                                      </strong>{" "}
                                      {displayValue}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ) : msg.isHistory ? (
                          msg.content
                        ) : (
                          <Typewriter text={msg.content} className="relative" />
                        )}
                      </div>
                    ) : typeof msg.content === "object" ? (
                      JSON.stringify(
                        convertKeysToCamelCase(msg.content),
                        null,
                        2
                      )
                    ) : msg.isHistory ? (
                      msg.content
                    ) : (
                      <Typewriter text={msg.content} className="relative" />
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && typingText && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl text-xs md:text-sm text-gray-800 dark:text-gray-200 max-w-[85%] md:max-w-[75%] lg:max-w-[65%] text-left whitespace-pre-wrap relative">
                  {typingText}
                  <span className="inline-block w-0.5 h-4 ml-0.5 bg-gray-800 dark:bg-gray-200 animate-cursor-blink absolute"></span>
                </div>
              </div>
            )}

            {loading && !isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl text-xs md:text-sm text-gray-800 dark:text-gray-200">
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
        </div>

        {/* Input Bar - Fixed at bottom with proper spacing */}
        <div className="mt-6 sticky bottom-0 bg-transparent">
          <div className=" relative flex items-center w-full md:max-w-[78%] md:mx-auto rounded-3xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-6 mb-2 md:mb-0 md:py-5 shadow-lg">
            {/* Input Field */}
            <input
              className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
              placeholder="Write message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isTyping || loading}
            />

            {/* Mic Button */}
            {/* Recording Button */}
            <button
              className={`w-8 h-8 md:h-10 md:w-10 rounded-full flex items-center justify-center shadow-md mr-3 transition-all 
    ${
      recording
        ? "bg-red-600 animate-pulse scale-105"
        : "bg-black dark:bg-[#353535] hover:bg-gray-800"
    } text-white`}
              onClick={recording ? stopRecording : startRecording}
              disabled={isTyping}
            >
              {/* Mobile: Arrow dikhao */}
              <span className="md:hidden p-1">
               <img src="/recording-01.png"/>
              </span>

              {/* Desktop: Recording UI */}
              <span className="hidden md:flex">
                {recording ? (
                  <div className="flex gap-0.5">
                    <span className="w-1 h-2 bg-white animate-pulse" />
                    <span className="w-1 h-3 bg-white animate-pulse" />
                    <span className="w-1 h-4 bg-white animate-pulse" />
                  </div>
                ) : (
                  <img src="/recording-01.png" className="cursor-pointer" />
                )}
              </span>
            </button>

            {/* Send Button */}
            {/* <button
              className="md:hidden p-1 w-8 h-8 cursor-pointer rounded-full flex items-center justify-center bg-black hover:bg-gray-800 text-white shadow-md transition-colors"
              onClick={() => sendMessage()}
              disabled={isTyping || !message.trim()}
            >
              <img src="/recording-01.png" className="md:hidden"></img>
            </button> */}
          <LucideWalletCards className="absolute bottom-2 left-4 dark:text-gray-300 text-gray-800 hover:text-gray-600 cursor-pointer" size={18}/>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NavigationTabsWithChat;
