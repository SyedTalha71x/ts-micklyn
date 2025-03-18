/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Card3, CardContent, CardHeader } from "@/components/ui/card";
import CreateAccountPicture from "../../public/Layer_1.svg";
import CreateAccountPictureDark from "../../public/Layer_1_black.svg";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isMobile, setIsMobile] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Check if the screen size is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Check if all OTP digits are filled
  const isOtpComplete = otp.every(digit => digit !== "");

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit

    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4).split("");
    const newOtp = [...otp];

    pastedData.forEach((value, index) => {
      if (index < 4 && /^\d$/.test(value)) {
        newOtp[index] = value;
      }
    });

    setOtp(newOtp);

    // Focus last filled input or first empty input
    const lastFilledIndex = newOtp.findLastIndex((value) => value !== "");
    const focusIndex = lastFilledIndex === 3 ? 3 : lastFilledIndex + 1;
    inputRefs[focusIndex]?.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    console.log("Submitted OTP:", otpString);
  };

  const renderPlaceholder = (index) => {
    return otp[index] === "" ? "-" : "";
  };

  return (
    <div className={`flex min-h-screen items-center justify-center dark:bg-black ${isMobile ? 'bg-white' : 'bg-gray-50'} p-4`}>
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
            <h1 className="text-lg manrope-font-700">Create Account</h1>
            <p className="text-sm text-black dark:text-white manrope-font-500 text-center">
              Enter the verification code sent to abc@gmail.com
            </p>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    ref={inputRefs[index]}
                    className="w-12 h-12 text-center text-lg border border-[#687588]"
                    autoFocus={index === 0}
                    placeholder="-"
                  />
                ))}
              </div>
              <div className="flex justify-center items-center mb-4">

                <span className="text-sm text-black dark:text-white manrope-font-500 text-center">A new one will be available in 45 sec</span>
              </div>


              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full text-sm  manrope-font-700 dark:bg-[#232428] h-10 border border-[#687588] dark:border-none" 
                  variant="outline"
                  disabled={!isOtpComplete}
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
            <h1 className="text-xl manrope-font-700">Create Account</h1>
            <p className="text-sm text-black dark:text-white manrope-font-500 text-center">
              Enter the verification code sent to abc@gmail.com
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    ref={inputRefs[index]}
                    className="w-12 h-12 text-center text-lg border border-[#000000] dark:bg-[#080808] dark:border-gray-400"
                    autoFocus={index === 0}
                    placeholder="-"
                  />
                ))}
              </div>
              <div className="flex justify-center items-center mb-4">

<span className="text-sm text-black dark:text-white manrope-font-500 text-center">A new one will be available in 45 sec</span>
</div>

              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full border manrope-font-700 border-[#CECECE] dark:bg-[#232428] dark:border-none" 
                  variant="outline"
                  disabled={!isOtpComplete}
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