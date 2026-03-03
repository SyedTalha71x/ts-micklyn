import { useState, useEffect } from "react";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ChangePassword() {
  const { t } = useTranslation('settings');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [unauthorized, setUnathorized] = useState(false);
  
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

  useEffect(() => {
    setUnathorized(localStorage.getItem("unauthorized-token"));
  }, [unauthorized]);

  const HandleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error(t('changePassword.passwordMismatch'));
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await FireApi("/change-password", "POST", {
        confirmPassword,
        newPassword,
        password,
      });
      toast.success(response.message || t('changePassword.success'));
      setPassword("");
      setConfirmPassword("");
      setNewPassword("");
      
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message || t('changePassword.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormEmpty = !password || !confirmPassword || !newPassword;

  // Custom Input Component with Password Toggle
  const PasswordInput = ({ value, onChange, placeholder, showPassword, setShowPassword }) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:bg-none dark:outline-none dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  // Mobile Version
  if (isMobile) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="dark:bg-[#2A2B2E] bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-col items-center space-y-4 pt-6 px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg">
              <img
                src="/Layer_1.svg"
                className="h-full w-full block dark:hidden"
                alt="Light Mode"
              />
              <img
                src="/Layer_1_black.svg"
                className="h-full w-full hidden dark:block"
                alt="Dark Mode"
              />
            </div>
            <h1 className="text-lg font-bold dark:text-white">{t('changePassword.resetTitle')}</h1>
          </div>

          <div className="space-y-4 mt-4 px-4 pb-6">
            <form className="space-y-4" onSubmit={HandleChangePassword}>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('changePassword.currentPassword')}
                </label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('changePassword.currentPlaceholder')}
                  showPassword={showCurrentPassword}
                  setShowPassword={setShowCurrentPassword}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('changePassword.newPassword')}
                </label>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('changePassword.newPlaceholder')}
                  showPassword={showNewPassword}
                  setShowPassword={setShowNewPassword}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('changePassword.confirmPassword')}
                </label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('changePassword.confirmPlaceholder')}
                  showPassword={showConfirmPassword}
                  setShowPassword={setShowConfirmPassword}
                />
              </div>

              {/* Custom Button - Like WalletConnections */}
              <button
                type="submit"
                disabled={isFormEmpty || isLoading}
                className={`w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50 mt-6 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin h-5 w-5" />
                    {t('changePassword.loading')}
                  </span>
                ) : (
                  t('changePassword.button')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Version
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="dark:bg-[#2A2B2E] bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b dark:border-gray-700 pb-3 p-6">
          <h1 className="text-xl font-bold text-center dark:text-white">{t('changePassword.title')}</h1>
        </div>

        <div className="space-y-4 p-6">
          <form className="space-y-4" onSubmit={HandleChangePassword}>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('changePassword.currentPassword')}
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('changePassword.currentPlaceholder')}
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('changePassword.newPassword')}
              </label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('changePassword.newPlaceholder')}
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('changePassword.confirmPassword')}
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('changePassword.confirmPlaceholder')}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
            </div>

            {/* Custom Button - Like WalletConnections */}
            <button
              type="submit"
              disabled={isFormEmpty || isLoading}
              className={`w-full py-2 px-4 cursor-pointer bg-[#2A2B2E] dark:text-[#2A2B2E] dark:bg-gray-200 text-white font-semibold rounded-md disabled:opacity-50 mt-6 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin h-5 w-5" />
                  {t('changePassword.loading')}
                </span>
              ) : (
                t('changePassword.button')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}