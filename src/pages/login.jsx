import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  Card3,
} from "@/components/ui/card";
import CreateAccountPicture from "../../public/Layer_1.svg";
import CreateAccountPictureDark from "../../public/Layer_1_black.svg";
import Apple from "../../public/apple.svg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FireApi } from "@/hooks/fireApi";
import { Loader } from "lucide-react";
import { useHistory } from "@/Context/HistoryContext";
import { jwtDecode } from "jwt-decode";
import GoogleBtn from "@/components/GoogleLogin";
import {
  initializeMessaging,
  requestFcmToken,
  app,
} from "@/lib/Firebase";
import { getMessaging, getToken } from "firebase/messaging";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [messagingInitialized, setMessagingInitialized] = useState(false);

  const navigate = useNavigate();
  const isFormEmpty = !password || !email;
  const { setUserInfo, handleGetHistory } = useHistory();

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const messagingInstance = getMessaging(app);
        const permission = await Notification.requestPermission();
        const vapidKey = import.meta.env.VITE_VAPID_KEY;

        const token = await getToken(messagingInstance, {
          vapidKey: vapidKey,
        });
        console.log(
          "Starting Firebase initialization...",
          // messagingInstance,
          permission,
          token
        );
        setFcmToken(token);

        const result = await initializeMessaging();
        console.log("Initialization result:", result);

        if (result.success) {
          setMessagingInitialized(true);

          if (Notification.permission === "granted") {
            console.log("Permission already granted, getting token...");
            try {
              const token = await requestFcmToken();
              console.log("Received token:", token);
              if (token) {
                setFcmToken(token);
                console.log("Token set on initialization:", token);
              } else {
                console.log(
                  "Token is null despite permission being granted"
                );
              }
            } catch (tokenError) {
              console.error("Error getting token:", tokenError);
            }
          } else {
            console.log(
              "No permission yet, will request on login. Current permission:",
              Notification.permission
            );
          }
        } else {
          console.error("Failed to initialize messaging:", result.error);
        }
      } catch (error) {
        console.error("Error in Firebase initialization:", error);
      }
    };

    initializeFirebase();
  }, []);

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
  const HandleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const response = await FireApi("/login", "POST", {
        email,
        password,
        fcm_token: fcmToken,
      });

      console.log("Login response:", response);
      if(response.data.active === 0) {
        toast.success(response.message || "Mail has been sent successfully to your email");
        navigate("/verify-otp", { state: { email, key: "activate" } });
        return;
      };

      const token = response?.data?.token;
      const decodedToken = jwtDecode(token);

      localStorage.setItem("user-visited-dashboard", token);
      localStorage.removeItem("unauthorized-token");
      localStorage.setItem("role", response?.data?.role);

      response?.data?.wallets?.forEach((wallet) => {
        switch (wallet.chain.toUpperCase()) {
          case "SOLANA":
            localStorage.setItem("solana-address", wallet.address);
            break;
          case "ETH":
            localStorage.setItem("eth-address", wallet.address);
            break;
          case "POLYGON":
            localStorage.setItem("polygon-address", wallet.address);
            break;
          case "BSC":
            localStorage.setItem("bsc-address", wallet.address);
            break;
          default:
            console.warn(`Unknown chain: ${wallet.chain}`);
        }
      });

      setUserInfo({
        userId: decodedToken.id,
        email: decodedToken.email,
        sessionId: "",
      });

      handleGetHistory(decodedToken.id);

      toast.success(response.message || "User Login Successful");
      const role = response?.data?.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/chat");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error(error.message);
      if (error.data?.active === 0) {
        navigate("/verify-otp", { state: { email, key: "login" } });
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const HandleRegisterNavigate = () => {
    navigate("/create-account");
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center dark:bg-black ${
        isMobile ? "bg-white" : "bg-gray-50"
      }  p-4`}
    >
      {/* Mobile-specific card without borders and background color */}
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
            <h1 className="text-lg manrope-font-700">Login Account</h1>
          </div>

          <div className="space-y-4 mt-4">
            <form className="space-y-4" onSubmit={HandleUserLogin}>
              <Input
                type="email"
                placeholder="Abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
                autoComplete="username"
              />

              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
                autoComplete="current-password"
              />
              <div className="flex justify-end text-sm font-semibold underline">
                <p
                  className="cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </p>
              </div>

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

            <div className="flex items-center justify-center">
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-2 text-xs text-muted-foreground">or</span>
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            <Button
              variant="outline"
              className="w-full text-sm h-10 border dark:bg-[#232428] border-[#687588] dark:border-none"
            >
              <img src={Apple} alt="" className="dark:invert" />
              Continue with Apple
            </Button>

            <GoogleBtn />
          </div>

          <div className="flex manrope-font-500 justify-center py-4">
            <p className="text-sm text-muted-foreground manrope-font-500">
              Don't have an account.{" "}
              <span
                onClick={() => HandleRegisterNavigate()}
                className="font-bold text-foreground hover:underline cursor-pointer"
              >
                Register!
              </span>
            </p>
          </div>
        </div>
      ) : (
        // Desktop view with Card3
        <Card3 className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center space-y-4 pt-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg  bg-white dark:bg-black">
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
            <h1 className="text-xl manrope-font-700">Login Account</h1>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={HandleUserLogin}>
              <Input
                type="email"
                placeholder="Abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
                autoComplete="username"
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm border border-[#687588] dark:bg-[#080808]"
                autoComplete="current-password"
              />
              <div className="flex justify-end text-sm font-semibold underline">
                <p
                  className="cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </p>
              </div>

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

            <div className="flex items-center justify-center">
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
              <span className="px-2 text-xs text-muted-foreground">or</span>
              <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            <Button
              variant="outline"
              className="w-full dark:bg-[#232428]  dark:border-none manrope-font-700 border border-[#687588]"
            >
              <img src={Apple} alt="" className="dark:invert" />
              Continue with Apple
            </Button>

            <GoogleBtn />
          </CardContent>

          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-muted-foreground manrope-font-500">
              Don't have an account.{" "}
              <span
                onClick={() => HandleRegisterNavigate()}
                className="font-bold text-foreground hover:underline cursor-pointer"
              >
                Register!
              </span>
            </p>
          </CardFooter>
        </Card3>
      )}
    </div>
  );
}
