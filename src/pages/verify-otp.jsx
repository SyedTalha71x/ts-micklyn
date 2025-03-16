import React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Card3, CardContent, CardHeader } from "@/components/ui/card";
import CreateAccountPicture from "../../public/Layer_1.svg";
import CreateAccountPictureDark from "../../public/Layer_1_black.svg";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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
    // Add your submission logic here
  };

  return (
    <div className="flex min-h-screen items-center dark:bg-black justify-center bg-gray-50 p-4">
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
          <h1 className="text-xl font-semibold">Create Account</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter the verification code sent to abc@gmail.com
          </p>
        </CardHeader>

        <CardContent>
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
                  className="w-12 h-12 text-center text-lg"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="space-y-2">
              <Button type="submit" className="w-full dark:bg-[#232428]" variant="outline">
                Submit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full dark:bg-[#232428]"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card3>
    </div>
  );
}
