import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardHeader,
  Card3,
} from "@/components/ui/card";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function TransactionPassword() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const validatePassword = () => {
    // Strict 12 character validation
    if (transactionPassword.length !== 12) {
      setPasswordError("Transaction password must be exactly 12 characters");
      return false;
    }
    if (transactionPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const HandleSetTransactionPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setIsLoading(true);
    try {
      const response = await FireApi("/update", "PUT", {
        transaction_password: transactionPassword,
      });
      toast.success(response.message);
      setTransactionPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message || "Password must contain uppercase, lowercase, number, and special character.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormEmpty = !transactionPassword || !confirmPassword;

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-md overflow-hidden">
      {isMobile ? (
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-4 pt-6">
                        <h1 className="text-lg manrope-font-700">Set Transaction Password</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password must be exactly 12 characters long
            </p>
          </div>

          <div className="space-y-4 mt-4">
            <form className="space-y-4" onSubmit={HandleSetTransactionPassword}>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter 12-character password"
                  value={transactionPassword}
                  onChange={(e) => {
                    setTransactionPassword(e.target.value);
                    // Immediate validation feedback
                    if (e.target.value.length > 12) {
                      setPasswordError("Maximum 12 characters allowed");
                    } else {
                      setPasswordError("");
                    }
                  }}
                  maxLength={12}
                  className="text-sm border border-[#687588] dark:bg-[#080808]"
                />
                <div className="flex justify-between">
                  <span className={`text-xs ${
                    transactionPassword.length === 12 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {transactionPassword.length}/12 characters
                  </span>
                </div>
              </div>

              <Input
                type="password"
                placeholder="Confirm 12-character password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={12}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />
              
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}
              
              <Button
                variant="outline"
                className={`w-full text-sm h-10 ${
                  isFormEmpty || passwordError
                    ? "dark:border-none border dark:bg-[#232428] border-[#687588]"
                    : "bg-black text-white"
                }`}
                type="submit"
                disabled={isFormEmpty || isLoading || passwordError || transactionPassword.length !== 12}
              >
                {isLoading ? <Loader className="animate-spin" /> : "Set Password"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Card3 className="w-full max-w-md" bgColor="dark:bg-[#2A2B2E] bg-gray-100">
          <CardHeader className="flex flex-col items-center space-y-4 pt-6">
           
            <h1 className="text-xl manrope-font-700">Set Transaction Password</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Password must be exactly 12 characters long
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4 pb-6" onSubmit={HandleSetTransactionPassword}>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter 12-character password"
                  value={transactionPassword}
                  onChange={(e) => {
                    setTransactionPassword(e.target.value);
                    // Immediate validation feedback
                    if (e.target.value.length > 12) {
                      setPasswordError("Maximum 12 characters allowed");
                    } else {
                      setPasswordError("");
                    }
                  }}
                  maxLength={12}
                  className="text-sm border border-[#687588] dark:bg-[#080808]"
                />
                <div className="flex justify-between">
                  <span className={`text-xs ${
                    transactionPassword.length === 12 ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    {transactionPassword.length}/12 characters
                  </span>
                </div>
              </div>

              <Input
                type="password"
                placeholder="Confirm 12-character password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={12}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />
              
              {passwordError && (
                <p className="text-red-500 text-xs">{passwordError}</p>
              )}

              <Button
                variant="outline"
                className={`w-full text-sm h-10 ${
                  isFormEmpty || passwordError
                    ? "dark:border-none border dark:bg-[#232428] border-[#687588]"
                    : "bg-black text-white"
                }`}
                type="submit"
                disabled={isFormEmpty || isLoading || passwordError || transactionPassword.length !== 12}
              >
                {isLoading ? <Loader className="animate-spin" /> : "Set Password"}
              </Button>
            </form>
          </CardContent>
        </Card3>
      )}
    </div>
  );
}