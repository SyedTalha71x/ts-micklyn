import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateAccountPicture from "../../public/Layer_1.svg";
import CreateAccountPictureDark from '../../public/Layer_1_black.svg'

export default function CreateAccount() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen items-center dark:bg-black justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
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
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4">
            <Input
              type="email"
              placeholder="Abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`dark:border-gray-400`}
            />

            <Button
              variant="outline"
              className="w-full dark:bg-[#232428]"
              type="submit"
            >
              Confirm
            </Button>
          </form>

          <div className="flex items-center justify-center">
            {/* <Separator className="w-1/3" /> */}
            <span className="px-2 text-xs text-muted-foreground">or</span>
            {/* <Separator className="w-1/3" /> */}
          </div>

          <Button variant="outline" className="w-full dark:bg-[#232428]">
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.7023 12.6844C16.6909 10.8436 18.1747 9.9436 18.2403 9.90797C17.3522 8.54297 15.9545 8.33047 15.4636 8.31172C14.2659 8.18672 13.1091 8.99297 12.5 8.99297C11.8795 8.99297 10.9227 8.32922 9.91818 8.35047C8.61136 8.37172 7.39773 9.09922 6.72955 10.2655C5.35227 12.6317 6.38409 16.1255 7.70682 17.9361C8.36818 18.8211 9.15227 19.8155 10.1773 19.7761C11.1795 19.7367 11.5682 19.1367 12.7773 19.1367C13.975 19.1367 14.3409 19.7761 15.3886 19.7536C16.4705 19.7367 17.1432 18.8605 17.7818 17.9642C18.5318 16.9417 18.8432 15.9361 18.8545 15.8886C18.8318 15.8799 16.7159 15.0536 16.7023 12.6844Z" />
              <path d="M14.8284 7.17516C15.3647 6.49891 15.7307 5.57391 15.6307 4.63641C14.8193 4.67141 13.7943 5.18766 13.2352 5.85141C12.7352 6.44266 12.2943 7.40766 12.4057 8.30766C13.3261 8.37766 14.2693 7.84016 14.8284 7.17516Z" />
            </svg>
            Continue with Apple
          </Button>

          <Button variant="outline" className="w-full dark:bg-[#232428]">
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5846 12.5288C17.5846 11.8514 17.5262 11.1986 17.4008 10.5713H12V13.5913H15.1754C15.0662 14.3002 14.7077 14.9104 14.1615 15.3246V17.0704H16.2923C17.3731 16.0731 17.5846 14.4831 17.5846 12.5288Z"
                fill="#4285F4"
              />
              <path
                d="M12 18.5C13.8208 18.5 15.3631 17.9407 16.2923 17.0704L14.1615 15.3246C13.6923 15.6407 12.9962 15.8329 12 15.8329C10.3923 15.8329 9.02769 14.7502 8.52308 13.2671H6.32308V15.0671C7.24615 17.1329 9.44615 18.5 12 18.5Z"
                fill="#34A853"
              />
              <path
                d="M8.52308 13.2671C8.42308 12.9509 8.36923 12.6179 8.36923 12.2764C8.36923 11.935 8.42308 11.602 8.52308 11.2857V9.48571H6.32308C5.87692 10.3354 5.625 11.2857 5.625 12.2764C5.625 13.2671 5.87692 14.2175 6.32308 15.0671L8.52308 13.2671Z"
                fill="#FBBC05"
              />
              <path
                d="M12 8.72C12.9231 8.72 13.7538 9.02286 14.4 9.63429L16.2923 7.74286C15.3631 6.88143 13.8208 6.3 12 6.3C9.44615 6.3 7.24615 7.66714 6.32308 9.73286L8.52308 11.5329C9.02769 10.0498 10.3923 8.72 12 8.72Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-muted-foreground">
            Already have an account.{" "}
            <a
              href="#"
              className="font-semibold text-foreground hover:underline"
            >
              Login!
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
