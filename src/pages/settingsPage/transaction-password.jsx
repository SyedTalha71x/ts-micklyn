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
import { useTranslation } from "react-i18next";

export default function TransactionPassword() {
  const { t } = useTranslation('settings');
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
      setPasswordError(t('transactionPassword.errors.exactLength'));
      return false;
    }
    if (transactionPassword !== confirmPassword) {
      setPasswordError(t('transactionPassword.errors.passwordMismatch'));
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
      toast.success(response.message || t('transactionPassword.success'));
      setTransactionPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message || t('transactionPassword.errors.passwordRequirements'));
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
            <h1 className="text-lg manrope-font-700">{t('transactionPassword.mobileTitle')}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('transactionPassword.description')}
            </p>
          </div>

          <div className="space-y-4 mt-4">
            <form className="space-y-4" onSubmit={HandleSetTransactionPassword}>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={t('transactionPassword.enterPlaceholder')}
                  value={transactionPassword}
                  onChange={(e) => {
                    setTransactionPassword(e.target.value);
                    // Immediate validation feedback
                    if (e.target.value.length > 12) {
                      setPasswordError(t('transactionPassword.errors.maxLength'));
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
                    {t('transactionPassword.charactersCount', { count: transactionPassword.length })}
                  </span>
                </div>
              </div>

              <Input
                type="password"
                placeholder={t('transactionPassword.confirmPlaceholder')}
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
                {isLoading ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : null}
                {isLoading ? t('transactionPassword.loading') : t('transactionPassword.button')}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Card3 className="w-full max-w-md" bgColor="dark:bg-[#2A2B2E] bg-gray-100">
          <CardHeader className="flex flex-col items-center space-y-4 pt-6">
            <h1 className="text-xl manrope-font-700 text-center">{t('transactionPassword.title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {t('transactionPassword.description')}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4 pb-6" onSubmit={HandleSetTransactionPassword}>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={t('transactionPassword.enterPlaceholder')}
                  value={transactionPassword}
                  onChange={(e) => {
                    setTransactionPassword(e.target.value);
                    // Immediate validation feedback
                    if (e.target.value.length > 12) {
                      setPasswordError(t('transactionPassword.errors.maxLength'));
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
                    {t('transactionPassword.charactersCount', { count: transactionPassword.length })}
                  </span>
                </div>
              </div>

              <Input
                type="password"
                placeholder={t('transactionPassword.confirmPlaceholder')}
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
                {isLoading ? (
                  <Loader className="animate-spin mr-2" size={16} />
                ) : null}
                {isLoading ? t('transactionPassword.loading') : t('transactionPassword.button')}
              </Button>
            </form>
          </CardContent>
        </Card3>
      )}
    </div>
  );
}