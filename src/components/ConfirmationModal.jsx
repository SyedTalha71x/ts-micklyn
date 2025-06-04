import React from "react";

const ConfirmationModal = (props) => {
  const { confirmationIndexNumber, intent, handleConfirmation } = props;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-gray-700 shadow-xl">
        <h3 className="text-lg text-center font-bold">
          Confirm Transaction {confirmationIndexNumber}
        </h3>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
          Are you sure you want to proceed?
        </p>
        <div className="space-y-3 mb-6">
          {Object.entries(intent)
            .filter(
              ([key]) =>
                !["intentIndex", "isFirstIntent", "isSecondIntent"].includes(
                  key
                )
            )
            .map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{key}:</span>
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
  );
};

export default ConfirmationModal;
