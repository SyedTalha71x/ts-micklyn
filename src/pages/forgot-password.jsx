/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Card3, CardContent, CardHeader } from "@/components/ui/card";
import CreateAccountPicture from "../../public/Layer_1.svg";
import CreateAccountPictureDark from "../../public/Layer_1_black.svg";
import { FireApi } from "@/hooks/fireApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  // Check if the screen size is mobile
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted OTP:", email);
    try {
      const res = await FireApi("/otp/reset", "POST", {
        email      });
      toast.success(res.message);
      console.log(res, "res");
      navigate("/verify-otp", { state: { email } });
      setEmail("");
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
    }
  };


  return (
    <div
      className={`flex min-h-screen items-center justify-center dark:bg-black ${
        isMobile ? "bg-white" : "bg-gray-50"
      } p-4`}
    >
      {isMobile ? (
        // Mobile view without card
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
            <h1 className="text-lg manrope-font-700">Forgot Password</h1>
            <p className="text-sm text-black dark:text-white manrope-font-500 text-center">
              Enter the email address associated with your account
            </p>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSubmit}>
                <Input
                type="email"
                placeholder="Abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808] mb-4"
              />{" "}
              <div className="flex justify-center items-center mb-4">
                <span className="text-sm text-gray-600 dark:text-white manrope-font-500 text-center">
                  Didn't receive OTP? <span className="text-black font-bold cursor-pointer">Resend</span>
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full text-sm  manrope-font-700 dark:bg-[#232428] h-10 border border-[#687588] dark:border-none"
                  variant="outline"
                  disabled={!email}
                >
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Desktop view with Card3
        <Card3 className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center space-y-4 pt-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-white dark:bg-black">
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
            <h1 className="text-xl manrope-font-700">Forgot Password</h1>
            <p className="text-sm text-black dark:text-white manrope-font-500 text-center">
              Enter the email address associated with your account for reset password
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808] mb-4"
              />{" "}
              <div className="flex justify-center items-center mb-6">
                <span className="text-sm text-gray-600 dark:text-white manrope-font-500 text-center">
                  Didn't receive OTP? <span className="text-black font-bold cursor-pointer">Resend</span>
                </span>
              </div>
              <div className="space-y-2">
                <Button
                  type="submit"
                className={`w-full text-sm h-10 ${
                  !email
                    ? "dark:border-none border dark:bg-[#232428] border-[#687588]"
                    : "bg-black text-white"
                }`}
                  variant="outline"
                  disabled={!email}
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-sm h-10 border text-[#000000] dark:text-white dark:bg-[#232428] manrope-font-700 border-[#CECECE] dark:border-none"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card3>
      )}
    </div>
  );
}
