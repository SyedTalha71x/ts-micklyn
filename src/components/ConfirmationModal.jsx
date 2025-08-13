import React, { useState } from "react";
import { FireApi } from "@/hooks/fireApi";

const ConfirmationModal = (props) => {
  const { confirmationIndexNumber, intent, handleConfirmation } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    {
      title: "Transaction Details",
      description: "Review your transaction details",
    },
    {
      title: "Security Verification",
      description: "Enter your transaction password",
    },
    {
      title: "Confirmation",
      description: "Confirm the transaction",
    },
  ];

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError("Please enter your transaction password");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await FireApi("/authenticate-transaction", "POST", {
        transaction_password: password,
      })

      if (response.success === true) {
        setActiveStep(2); 
      } else {
        setError("Incorrect transaction password");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Incorrect transaction password");
      } else {
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalConfirmation = (confirmed) => {
    if (confirmed) {
      // Reset the modal state for next use
      setActiveStep(0);
      setPassword("");
      setError("");
    }
    handleConfirmation(confirmed);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="mb-6">
          <h3 className="text-lg text-center font-bold mb-2">
            Transaction {confirmationIndexNumber} Confirmation
          </h3>
          
          {/* Stepper */}
          <div className="flex justify-between mb-4 relative">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= activeStep
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`text-xs mt-1 text-center ${
                      index <= activeStep
                        ? "text-black dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/4 w-1/2 h-1 ${
                      index < activeStep ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-600"
                    }`}
                    style={{ left: `${(index * 33) + 16.5}%` }}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
            {steps[activeStep].description}
          </p>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {activeStep === 0 && (
            <div className="space-y-3">
              {Object.entries(intent)
                .filter(
                  ([key]) =>
                    !["intentIndex", "isFirstIntent", "isSecondIntent"].includes(
                      key
                    )
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
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="transactionPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Transaction Password
                </label>
                <input
                  type="password"
                  id="transactionPassword"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-black dark:bg-gray-700 dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your transaction password"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to proceed with this transaction?
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3">
          {activeStep > 0 ? (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={isProcessing}
            >
              Back
            </button>
          ) : (
            <button
              onClick={() => handleFinalConfirmation(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={isProcessing}
            >
              Cancel
            </button>
          )}

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => {
                if (activeStep === 1) {
                  handlePasswordSubmit();
                } else {
                  setActiveStep(activeStep + 1);
                }
              }}
              className="px-4 py-2 rounded-md cursor-pointer bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-blue-600"
              disabled={isProcessing}
            >
              {isProcessing ? "Verifying..." : "Continue"}
            </button>
          ) : (
            <button
              onClick={() => handleFinalConfirmation(true)}
              className="px-4 py-2 rounded-md cursor-pointer bg-black text-white hover:bg-black/80 dark:bg-white dark:hover:bg-black/80 dark:text-black"
              disabled={isProcessing}
            >
              Confirm Transaction
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;