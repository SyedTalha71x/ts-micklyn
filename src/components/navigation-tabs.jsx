// import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import Icon from "../../public/Icon.svg";
// import { baseUrl } from "@/hooks/fireApi";
// import { Mic } from "lucide-react";
// import { jwtDecode } from "jwt-decode";
// import { Typewriter } from "@/lib/Typewriter";

// const NavigationTabsWithChat = () => {
//   // State variables
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [myToken, setMyToken] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [pendingAction, setPendingAction] = useState(null);
//   const [lastUserMessage, setLastUserMessage] = useState("");
//   const [typingText, setTypingText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [fullResponse, setFullResponse] = useState("");
//   const [typingSpeed, setTypingSpeed] = useState(15);
//   const [email, setEmail] = useState(null);
//   const [checkConfirmation, setCheckConfirmation] = useState(null);
//   const messageContainerRef = useRef(null);

//   // Initialize user data from localStorage
//   useEffect(() => {
//     const storeAddress = localStorage.getItem("address");
//     const userVisitToken = localStorage.getItem("user-visited-dashboard");
//     setMyToken(userVisitToken);
//     setAddress(storeAddress);

//     if (userVisitToken) {
//       try {
//         const decodedToken = jwtDecode(userVisitToken);
//         console.log(decodedToken, "fffffffffffffffffffffff");
//         setUserId(decodedToken.id);
//         setEmail(decodedToken.email);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     if (messageContainerRef.current) {
//       messageContainerRef.current.scrollTop =
//         messageContainerRef.current.scrollHeight;
//     }
//   }, [messages, loading, typingText]);

//   useEffect(() => {
//     if (isTyping && fullResponse) {
//       const words = fullResponse.split(/(\s+)/);
//       let currentWordIndex = 0;
//       let intraWordIndex = 0;
//       let visibleText = "";

//       const typeNextChar = () => {
//         if (currentWordIndex < words.length) {
//           const currentWord = words[currentWordIndex];

//           // If we're not done with the current word
//           if (intraWordIndex < currentWord.length) {
//             // Add the next character of the current word
//             visibleText += currentWord[intraWordIndex];
//             intraWordIndex++;

//             // Random delay for character typing (faster within words)
//             const charDelay = typingSpeed * (0.6 + Math.random() * 0.8);
//             setTypingText(visibleText);
//             setTimeout(typeNextChar, charDelay);
//           }
//           // Current word is complete
//           else {
//             currentWordIndex++;
//             intraWordIndex = 0;

//             // Add pauses at punctuation for natural rhythm
//             const lastChar = visibleText.slice(-1);
//             let wordDelay = typingSpeed;

//             // Longer pauses after punctuation
//             if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
//               if ([".", "!", "?"].includes(lastChar)) {
//                 wordDelay = typingSpeed * (3 + Math.random() * 2); // Longer pause at end of sentences
//               } else {
//                 wordDelay = typingSpeed * (1.5 + Math.random() * 1.5); // Medium pause at commas, etc.
//               }
//             } else {
//               wordDelay = typingSpeed * (0.3 + Math.random() * 0.7); // Short pause between words
//             }

//             setTimeout(typeNextChar, wordDelay);
//           }
//         } else {
//           // Typing complete
//           setIsTyping(false);
//           setFullResponse("");

//           // Add the fully typed message to the chat
//           setMessages((prev) => {
//             const newMessages = [...prev];
//             const lastMessage = newMessages[newMessages.length - 1];

//             // Prevent duplication when typing finishes
//             if (lastMessage?.wallet !== "Chat" || lastMessage?.isTyping) {
//               return [
//                 ...prev,
//                 {
//                   wallet: "Chat",
//                   content: visibleText,
//                   isJson: false,
//                   isTyping: false,
//                 },
//               ];
//             }
//             return newMessages;
//           });

//           setTypingText("");
//         }
//       };

//       // Start typing animation
//       typeNextChar();
//     }
//   }, [isTyping, fullResponse]);

//   useEffect(() => {
//     const newSocket = io(baseUrl, {
//       transports: ["websocket", "polling"],
//       reconnectionAttempts: 5,
//       timeout: 10000,
//     });

//     setSocket(newSocket);

//     newSocket.on("connection_status", (data) => {
//       setMessages((prev) => [
//         { wallet: "System", content: data.status },
//         ...prev,
//       ]);
//     });

//     newSocket.on("error", (data) => {
//       setMessages((prev) => [
//         ...prev,
//         { wallet: "Error", content: data.message },
//       ]);
//     });

//     newSocket.on("chat_response", (data) => {
//       setLoading(false);
//       const reply = data?.data?.reply;
//       const checkConfirmation = data?.data;
//       setCheckConfirmation(checkConfirmation);

//       // Handle multiple intents with sequential confirmations
//       if (Array.isArray(reply) && reply.length > 1) {
//         // First intent confirmation
//         if (checkConfirmation?.is_confirmed1 === false) {
//           setPendingAction({
//             ...reply[0],
//             isFirstIntent: true,  // Flag to track first intent
//             isSecondIntent: false
//           });
//           setShowConfirmation(true);
//           return;
//         }

//         // Second intent confirmation
//         if (checkConfirmation?.is_confirmed2 === false) {
//           setPendingAction({
//             ...reply[1],
//             isFirstIntent: false,
//             isSecondIntent: true
//           });
//           setShowConfirmation(true);
//           return;
//         }
//       }
//       // Handle single intent case
//       else if (checkConfirmation?.is_confirmed1 === false || checkConfirmation?.is_confirmed2 === false) {
//         setPendingAction({
//           ...(Array.isArray(reply) ? reply[0] : reply,
//           isFirstIntent: true,
//           isSecondIntent: false,
//         )
//         });
//         setShowConfirmation(true);
//         return;
//       }

//       if (typeof reply === "string") {
//         setFullResponse(reply);
//         setIsTyping(true);
//       } else if (typeof reply === "object" && reply !== null) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             wallet: "Chat",
//             content: reply?.data || reply,
//             isJson: true,
//           },
//         ]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           {
//             wallet: "Chat",
//             content: "No valid reply received.",
//             isJson: false,
//           },
//         ]);
//       }
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // Handle confirmation modal actions
//   const handleConfirmation = (confirmed) => {
//     setShowConfirmation(false);

//     if (confirmed && pendingAction && socket) {
//       // Prepare chat history
//       const chatHistory = messages.reduce((acc, msg, i) => {
//         if (msg.wallet === "You" && messages[i + 1]?.wallet === "Chat") {
//           acc.push({
//             user: msg.content,
//             bot_reply: messages[i + 1].content,
//           });
//         }
//         return acc;
//       }, []);

//       // Resend message with updated confirmation states
//       const messageData = {
//         event: "chat_message",
//         data: {
//           user_input: lastUserMessage,
//           address: address || import.meta.env.VITE_WALLET_ADDRESS,
//           solana_address: import.meta.env.VITE_SOLANA_WALLET_ADDRESS,
//           ethereum_address: import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS,
//           polygon_address: import.meta.env.VITE_POLYGON_WALLET_ADDRESS,
//           chat_history: chatHistory,
//           bearer_token: myToken,
//           is_confirmed1: pendingAction?.action === "buy" ? true : checkConfirmation?.is_confirmed1,
//           is_confirmed2:
//             pendingAction?.action === "transfer_token"
//               ? true
//               : checkConfirmation?.is_confirmed2,
//           user_id: userId,
//           transaction_data: pendingAction.transaction,
//         },
//       };

//       socket.emit("chat_message", messageData);
//       setLoading(true);
//     }
//   };

//   const handleConfirmation = (confirmed) => {
//     setShowConfirmation(false);

//     if (pendingAction && socket) {
//       // Prepare chat history
//       const chatHistory = messages.reduce((acc, msg, i) => {
//         if (msg.wallet === "You" && messages[i + 1]?.wallet === "Chat") {
//           acc.push({
//             user: msg.content,
//             bot_reply: messages[i + 1].content,
//           });
//         }
//         return acc;
//       }, []);

//       // Determine which confirmation to update based on the intent
//       const isFirstIntent = pendingAction.isFirstIntent;
//       const isSecondIntent = pendingAction.isSecondIntent;

//       // Resend message with updated confirmation states
//       const messageData = {
//         event: "chat_message",
//         data: {
//           user_input: lastUserMessage,
//           address: address || import.meta.env.VITE_WALLET_ADDRESS,
//           solana_address: import.meta.env.VITE_SOLANA_WALLET_ADDRESS,
//           ethereum_address: import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS,
//           polygon_address: import.meta.env.VITE_POLYGON_WALLET_ADDRESS,
//           chat_history: chatHistory,
//           bearer_token: myToken,
//           is_confirmed1: isFirstIntent ? confirmed : checkConfirmation?.is_confirmed1,
//           is_confirmed2: isSecondIntent ? confirmed : checkConfirmation?.is_confirmed2,
//           user_id: userId,
//           transaction_data: pendingAction.transaction,
//         },
//       };

//       socket.emit("chat_message", messageData);
//       setLoading(true);
//     }
//   };

//   // Send message function
//   const sendMessage = (text = message) => {
//     if (text.trim() && socket) {
//       // Prepare chat history
//       const chatHistory = messages.reduce((acc, msg, i) => {
//         if (msg.wallet === "You" && messages[i + 1]?.wallet === "Chat") {
//           acc.push({
//             user: msg.content,
//             bot_reply: messages[i + 1].content,
//           });
//         }
//         return acc;
//       }, []);

//       // Prepare message data
//       const messageData = {
//         event: "chat_message",
//         data: {
//           user_input: text,
//           address: address || import.meta.env.VITE_WALLET_ADDRESS,
//           solana_address: import.meta.env.VITE_SOLANA_WALLET_ADDRESS,
//           ethereum_address: import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS,
//           polygon_address: import.meta.env.VITE_POLYGON_WALLET_ADDRESS,
//           chat_history: chatHistory,
//           bearer_token: myToken,
//           is_confirmed1: false,
//           is_confirmed2: false,
//           user_id: userId,
//           email_address: email,
//         },
//       };

//       // Send message
//       socket.emit("chat_message", messageData);
//       setLastUserMessage(text);
//       setMessages((prev) => [...prev, { wallet: "You", content: text }]);
//       setMessage("");
//       setLoading(true);
//     }
//   };

//   // Voice recording function
//   const startRecording = async () => {
//     try {
//       setRecording(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       const audioChunks = [];

//       mediaRecorder.addEventListener("dataavailable", (event) => {
//         audioChunks.push(event.data);
//       });

//       mediaRecorder.addEventListener("stop", async () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
//         const formData = new FormData();
//         formData.append("file", audioBlob, "audio.webm");
//         formData.append("model", "whisper-1");
//         formData.append("language", "en");

//         const response = await fetch(
//           "https://api.openai.com/v1/audio/transcriptions",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
//             },
//             body: formData,
//           }
//         );

//         const data = await response.json();
//         if (data.text) {
//           sendMessage(data.text);
//         }
//         setRecording(false);
//       });

//       mediaRecorder.start();
//       setTimeout(() => mediaRecorder.stop(), 5000);
//     } catch (error) {
//       console.error("Recording error:", error);
//       setRecording(false);
//     }
//   };

//   const customStyles = `
// @keyframes cursor-blink {
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0; }
// }
// .animate-cursor-blink {
//   animation: cursor-blink 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
// }
// `;

//   return (
//     <>
//       {/* Add custom styles for cursor animation */}
//       <style dangerouslySetInnerHTML={{ __html: customStyles }} />
//       {/* Confirmation Modal */}
//       {showConfirmation && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl">
//             <h3 className="text-lg text-center font-bold">
//               Confirm Transaction
//             </h3>
//             <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
//               Are you sure you want to proceed?
//             </p>
//             <div className="space-y-3 mb-6">
//               {/* Dynamically render keys and values */}
//               {pendingAction &&
//                 Object.entries(pendingAction).map(([key, value]) => (
//                   <div key={key} className="flex justify-between">
//                     <span className="text-gray-600 dark:text-gray-300">
//                       {key}:
//                     </span>
//                     <span className="font-medium truncate max-w-[180px]">
//                       {value !== null ? value : "N/A"}
//                     </span>
//                   </div>
//                 ))}
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => handleConfirmation(false)}
//                 className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
//               >
//                 Denied
//               </button>
//               <button
//                 onClick={() => handleConfirmation(true)}
//                 className="px-4 py-2 rounded-md cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Chat Interface */}
//       {!messages.some((msg) => msg.wallet === "You") && (
//         <h2 className="text-2xl font-bold mb-4 dark:text-white max-w-5xl mx-auto text-center mt-[20rem]">
//           What can I help with?
//         </h2>
//       )}

//       <div className="max-w-5xl mx-auto p-4 text-center">
//         {/* System Status */}
//         {messages.find((msg) => msg.wallet === "System") && (
//           <div className="text-center mb-4">
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               System: Connected
//             </p>
//           </div>
//         )}

//         {/* Chat Messages */}
//         <div
//           ref={messageContainerRef}
//           className="w-full lg:h-[28rem] h-[16rem] overflow-y-auto rounded-md p-2 scroll-auto"
//         >
//           {messages.map((msg, index) => {
//             const isLast = index === messages.length - 1;

//             return (
//               <div
//                 key={index}
//                 className={`mb-2 flex ${
//                   msg.wallet === "You" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-3 py-2 rounded-lg text-sm ${
//                     msg.wallet === "You"
//                       ? "bg-gray-200 text-black"
//                       : "text-gray-800 dark:text-gray-200 max-w-[80%] text-left"
//                   } whitespace-pre-wrap`}
//                 >
//                   {/* Render typing animation for the latest message */}
//                   {msg.wallet === "Chat" && isLast && isTyping ? (
//                     <Typewriter text={fullResponse} className="relative" />
//                   ) : msg.isJson ? (
//                     <div className="mt-1">
//                       {Array.isArray(msg.content) && msg.content.length > 1
//                         ? msg.content.map((intent, intentIndex) => (
//                             <div key={intentIndex} className="mb-4">
//                               <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">
//                                 Intent {intentIndex + 1}: {intent.action}
//                               </h4>
//                               <div className="pl-4">
//                                 {Object.entries(intent).map(([key, value]) => {
//                                   if (value == null) return null;
//                                   return (
//                                     <div key={key} className="mb-1">
//                                       <strong>
//                                         {key.charAt(0).toUpperCase() +
//                                           key.slice(1)}
//                                         :
//                                       </strong>{" "}
//                                       {value}
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             </div>
//                           ))
//                         : Object.entries(msg.content).map(([key, value]) => (
//                             <div key={key} className="mb-1">
//                               {typeof value === "object" && value !== null ? (
//                                 <div>
//                                   {Object.entries(value).map(
//                                     ([nestedKey, nestedValue]) => {
//                                       if (nestedValue == null) return null;
//                                       return (
//                                         <div key={nestedKey}>
//                                           <strong>
//                                             {nestedKey.charAt(0).toUpperCase() +
//                                               nestedKey.slice(1)}
//                                             :
//                                           </strong>{" "}
//                                           {nestedValue}
//                                         </div>
//                                       );
//                                     }
//                                   )}
//                                 </div>
//                               ) : (
//                                 <>
//                                   <Typewriter
//                                     text={value}
//                                     className="relative"
//                                   />
//                                 </>
//                               )}
//                             </div>
//                           ))}
//                     </div>
//                   ) : (
//                     msg.content
//                   )}
//                 </div>
//               </div>
//             );
//           })}

//           {/* Active typing indicator - more realistic cursor */}
//           {isTyping && typingText && (
//             <div className="flex justify-start">
//               <div className="px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200 max-w-[80%] text-left whitespace-pre-wrap relative">
//                 {typingText}
//                 <span className="inline-block w-0.5 h-4 ml-0.5 bg-gray-800 dark:bg-gray-200 animate-cursor-blink absolute"></span>
//               </div>
//             </div>
//           )}

//           {/* Loading indicator */}
//           {loading && !isTyping && (
//             <div className="flex justify-start">
//               <div className="px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-200">
//                 <span className="inline-flex gap-1">
//                   <span
//                     className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
//                     style={{ animationDelay: "0ms" }}
//                   ></span>
//                   <span
//                     className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
//                     style={{ animationDelay: "300ms" }}
//                   ></span>
//                   <span
//                     className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
//                     style={{ animationDelay: "600ms" }}
//                   ></span>
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Message Input */}
//         <div className="mt-4 flex flex-col items-center gap-2 bg-white dark:bg-[#101010] rounded-xl border border-[#A0AEC0] dark:border-gray-700 p-2 pt-3 shadow-sm w-full h-[6rem]">
//           <div className="w-full flex items-center gap-2">
//             <input
//               className="flex-1 bg-transparent border-none outline-none text-sm px-2 dark:text-gray-200 dark:placeholder-gray-400"
//               placeholder="Write message here..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               disabled={isTyping}
//             />

//             <button
//               className={`h-8 w-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600 ${
//                 isTyping ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               onClick={sendMessage}
//               disabled={isTyping}
//             >
//               <img src={Icon} alt="Send" className="h-4 w-4" />
//             </button>

//             <button
//               className={`h-8 w-8 rounded-full ${
//                 recording ? "bg-red-600" : "bg-black"
//               } text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600 ${
//                 isTyping || recording ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               onClick={startRecording}
//               disabled={isTyping || recording}
//             >
//               <Mic size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default NavigationTabsWithChat;

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Icon from "../../public/Icon.svg";
import { baseUrl } from "@/hooks/fireApi";
import { Mic } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Typewriter } from "@/lib/Typewriter";

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
  const [typingSpeed, setTypingSpeed] = useState(15);
  const [email, setEmail] = useState(null);
  const [checkConfirmation, setCheckConfirmation] = useState(null);
  const [currentIntentIndex, setCurrentIntentIndex] = useState(0);
  const messageContainerRef = useRef(null);

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

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, loading, typingText]);

  useEffect(() => {
    const newSocket = io(baseUrl, {
      transports: ["socketio", "polling"],
      reconnectionAttempts: 5,
      timeout: 10000,
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

    newSocket.on("chat_response", (data) => {
      setLoading(false);
      const reply = data?.data?.reply;
      const checkConfirmation = data?.data;
      setCheckConfirmation(checkConfirmation);

      // Handle multiple intents with sequential confirmations
      if (Array.isArray(reply) && reply.length > 0) {
        // Check if we need to show confirmation for any intent
        const needsConfirmation1 =
          checkConfirmation?.is_confirmed1 === false &&
          checkConfirmation?.is_confirmed1 !== undefined;
        const needsConfirmation2 =
          checkConfirmation?.is_confirmed2 === false &&
          checkConfirmation?.is_confirmed2 !== undefined;

        // Only show modal if not already denied
        if (needsConfirmation1 && checkConfirmation?.is_confirmed1 !== false) {
          setPendingAction({
            ...reply[0],
            intentIndex: 0,
          });
          setShowConfirmation(true);
          return;
        } else if (
          needsConfirmation2 &&
          reply.length > 1 &&
          checkConfirmation?.is_confirmed2 !== false
        ) {
          setPendingAction({
            ...reply[1],
            intentIndex: 1,
          });
          setShowConfirmation(true);
          return;
        }
      }

      // Handle denied intents
      if (checkConfirmation?.is_confirmed1 === false) {
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: "You denied the first intent",
            isJson: false,
          },
        ]);

        // Only proceed to second intent if first was denied
        if (
          Array.isArray(reply) &&
          reply.length > 0 &&
          checkConfirmation?.is_confirmed1 === false
        ) {
          setPendingAction({
            ...reply[0],
            intentIndex: 0,
          });
          setShowConfirmation(true);
          return;
        }
      }

      if (checkConfirmation?.is_confirmed2 === false) {
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: "You denied the second intent",
            isJson: false,
          },
        ]);
        return;
      }

      // Show original response if no confirmations needed
      if (typeof reply === "string") {
        setFullResponse(reply);
        setIsTyping(true);
      } else if (typeof reply === "object" && reply !== null) {
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: reply?.data || reply,
            isJson: true,
          },
        ]);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);

    if (pendingAction && socket) {
      const chatHistory = messages.reduce((acc, msg, i) => {
        if (msg.wallet === "You" && messages[i + 1]?.wallet === "Chat") {
          acc.push({
            user: msg.content,
            bot_reply: [pendingAction],
          });
        }
        return acc;
      }, []);

      const messageData = {
        event: "chat_message",
        data: {
          user_input: lastUserMessage,
          address: address || import.meta.env.VITE_WALLET_ADDRESS,
          solana_address: import.meta.env.VITE_SOLANA_WALLET_ADDRESS,
          ethereum_address: import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS,
          polygon_address: import.meta.env.VITE_POLYGON_WALLET_ADDRESS,
          chat_history: chatHistory,
          bearer_token: myToken,
          is_confirmed1:
            pendingAction.intentIndex === 0
              ? confirmed
              : checkConfirmation?.is_confirmed1,
          is_confirmed2:
            pendingAction.intentIndex === 1
              ? confirmed
              : checkConfirmation?.is_confirmed2,
          user_id: userId,
          transaction_data: pendingAction.transaction,
          requires_processing: false,
        },
      };

      console.log("Sending data to backend:", messageData);

      socket.emit("chat_message", messageData);
      setLoading(true);

      if (!confirmed) {
        setMessages((prev) => [
          ...prev,
          {
            wallet: "Chat",
            content: `You denied intent ${pendingAction.intentIndex + 1}`,
            isJson: false,
          },
        ]);
      }
    }
  };

  const sendMessage = (text = message) => {
    if (text.trim() && socket) {
      const chatHistory = messages.reduce((acc, msg, i) => {
        if (msg.wallet === "You" && messages[i + 1]?.wallet === "Chat") {
          acc.push({
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
          // address: address || import.meta.env.VITE_WALLET_ADDRESS,
          solana_address: import.meta.env.VITE_SOLANA_WALLET_ADDRESS,
          ethereum_address: import.meta.env.VITE_ETHEREUM_WALLET_ADDRESS,
          polygon_address: import.meta.env.VITE_POLYGON_WALLET_ADDRESS,
          chat_history: chatHistory,
          bearer_token: myToken,
          is_confirmed1: false,
          is_confirmed2: false,
          user_id: userId,
          email_address: email,
          requires_processing: true,
        },
      };

      console.log(
        messageData,
        "fffffffffffffffffffffffffffffffffffffffffffffffffff"
      );

      socket.emit("chat_message", messageData);
      setLastUserMessage(text);
      setMessages((prev) => [...prev, { wallet: "You", content: text }]);
      setMessage("");
      setLoading(true);
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

  const customStyles = `
    @keyframes cursor-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-cursor-blink {
      animation: cursor-blink 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {showConfirmation && (
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
      )}

      {!messages.some((msg) => msg.wallet === "You") && (
        <h2 className="text-2xl font-bold mb-4 dark:text-white max-w-5xl mx-auto text-center mt-[20rem]">
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
          className="w-full lg:h-[28rem] h-[16rem] overflow-y-auto rounded-md p-2 scroll-auto"
        >
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1;

            return (
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
                      : "text-gray-800 dark:text-gray-200 max-w-[80%] text-left"
                  } whitespace-pre-wrap`}
                >
                  {msg.wallet === "Chat" && isLast && isTyping ? (
                    <Typewriter text={fullResponse} className="relative" />
                  ) : msg.isJson ? (
                    <div className="mt-1">
                      {Array.isArray(msg.content) && msg.content.length > 1
                        ? msg.content.map((intent, intentIndex) => (
                            <div key={intentIndex} className="mb-4">
                              <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Intent {intentIndex + 1}: {intent.action}
                              </h4>
                              <div className="pl-4">
                                {Object.entries(intent).map(([key, value]) => {
                                  if (value == null) return null;
                                  return (
                                    <div key={key} className="mb-1">
                                      <strong>
                                        {key.charAt(0).toUpperCase() +
                                          key.slice(1)}
                                        :
                                      </strong>{" "}
                                      {value}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        : Object.entries(msg.content).map(([key, value]) => (
                            <div key={key} className="mb-1">
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
                                <>{value}</>
                              )}
                            </div>
                          ))}
                    </div>
                  ) : // msg.content
                  typeof msg.content === "object" ? (
                    JSON.stringify(msg.content, null, 2)
                  ) : (
                    msg.content
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
                recording ? "bg-red-600" : "bg-black"
              } text-white flex items-center justify-center cursor-pointer hover:bg-gray-700 dark:bg-[#101010] dark:hover:bg-gray-600 ${
                isTyping || recording ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={startRecording}
              disabled={isTyping || recording}
            >
              <Mic size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationTabsWithChat;
