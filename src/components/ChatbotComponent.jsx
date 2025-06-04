import React from 'react'

const ChatbotComponent = () => {
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

      {/* {showConfirmation && (
        <ConfirmationModal
          confirmationIndexNumber={pendingAction?.intentIndex + 1}
          intent={pendingAction}
          socket={socket}
          handleConfirmation={handleConfirmation}
        />
      )} */}

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
                    // <Typewriter text={msg.content} className="relative" />
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

            {showRecordingModal && (
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
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatbotComponent