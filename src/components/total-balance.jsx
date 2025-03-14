import { Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TotalBalance() {
  const [showBalance, setShowBalance] = useState(true);

  const handleSettingsRedirect = () => {
    window.location.href = "/settings/manage-wallet";
  };

  return (
    <div className="flex justify-between">
      <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-xl dark:bg-[#101010]">
        <div className="flex items-center gap-2">
          <h2 className="text-md font-bold dark:text-white">Total balance</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 dark:hover:bg-gray-700"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <EyeOff className="h-3 w-3 dark:text-gray-300" />
            ) : (
              <Eye className="h-3 w-3 dark:text-gray-300" />
            )}
          </Button>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-400 font-semibold">
          USD: {showBalance ? "$29,850.15" : "••••••••"}
        </p>
      </div>
      <div onClick={handleSettingsRedirect}>
        <button
          size="sm"
          className="rounded-lg cursor-pointer text-white bg-primary p-3 border dark:border-gray-600 dark:bg-[#101010] dark:hover:bg-gray-600"
        >
          <Settings size={20} className="dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
}
