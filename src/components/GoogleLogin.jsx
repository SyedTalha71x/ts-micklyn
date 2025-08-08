import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { baseUrl } from "@/hooks/fireApi";
import { Button } from "./ui/button";
import Google from "../../public/google.svg";

const GoogleBtn = () => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch(`${baseUrl}/google/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorizationCode: codeResponse.code,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Google login failed");
        }

        if (data.data?.token) {
          localStorage.setItem("user-visited-dashboard", data.data.token);
        }

        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Google login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    },
    flow: "auth-code",
  });

  return (
    <Button
      onClick={() => login()}
      variant="outline"
      className="w-full dark:bg-[#232428] cursor-pointer hover:bg-gray-200 dark:border-none manrope-font-700 border border-[#687588]"
    >
      <img src={Google} alt="" className="dark:invert" />
      Continue with Google
    </Button>
  );
};

export default GoogleBtn;
