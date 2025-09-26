import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardHeader,
  Card3,
} from "@/components/ui/card";
import CreateAccountPicture from "../../public/Layer_1.svg";
import CreateAccountPictureDark from "../../public/Layer_1_black.svg";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function ChangePassword() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const response = await FireApi("/change-password", "POST", {
        confirmPassword,
        newPassword,
        password,
      });
      toast.success(response.message);
      setPassword("");
      setConfirmPassword("");
      setNewPassword("");
      
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormEmpty = !password || !confirmPassword || !newPassword;

  return (
    <div
    className="w-full border border-2 max-w-md mx-auto p-4 rounded-lg overflow-hidden "    >
      {isMobile ? (
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-4 pt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg">
              <img
                src={CreateAccountPicture}
                className="h-full w-full block dark:hidden"
                alt="Light Mode Image"
              />
              <img
                src={CreateAccountPictureDark}
                className="h-full w-full hidden dark:block"
                alt="Dark Mode Image"
              />
            </div>
            <h1 className="text-lg manrope-font-700">Reset Password</h1>
          </div>

          <div className="space-y-4 mt-4">
            <form className="space-y-4" onSubmit={HandleChangePassword}>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />

              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />
              <Button
                variant="outline"
                className={`w-full text-sm h-10 ${
                  isFormEmpty
                    ? "dark:border-none border dark:bg-[#232428] border-[#687588]"
                    : "bg-black text-white"
                }`}
                type="submit"
                disabled={isFormEmpty || isLoading}
              >
                {isLoading ? <Loader className="animate-spin" /> : "Confirm"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Card3 className="w-full max-w-md" bgColor="dark:bg-[#2A2B2E] bg-gray-100">
          <CardHeader className="flex flex-col items-center space-y-4 pt-6">
          
            <h1 className="text-xl manrope-font-700">Change Password</h1>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4 pb-6" onSubmit={HandleChangePassword}>
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
              />

              <Button
                variant="outline"
                className={`w-full text-sm h-10 ${
                  isFormEmpty
                    ? "dark:border-none border dark:bg-[#232428] border-[#687588]"
                    : "bg-black text-white"
                }`}
                type="submit"
                disabled={isFormEmpty || isLoading}
              >
                {isLoading ? <Loader className="animate-spin" /> : "Confirm"}
              </Button>
            </form>
          </CardContent>
        </Card3>
      )}
    </div>
  );
}