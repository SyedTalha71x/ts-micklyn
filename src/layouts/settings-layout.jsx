import Sidebar from "@/components/sidebar";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileSidebar from "@/components/ui/mobile-sidebar";

const SettingsLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeItem, setActiveItem] = useState("/settings");
  const [showContent, setShowContent] = useState(!isMobile);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowContent(!mobile);
    };

    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    setActiveItem(location.pathname);
    if (isMobile) {
      setShowContent(true);
    }
  }, [location, isMobile]);

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
    if (isMobile) {
      setShowContent(true);
    }
  };

  const handleBack = () => {
    if (isMobile) {
      setShowContent(false);
      // Don't navigate to a new route, just toggle the view
      // This keeps us on the same route but shows the menu instead
    }
  };

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex justify-center items-center min-h-screen   p-4 dark:bg-black bg-gray-50">
      <div className="flex flex-col w-full max-w-4xl md:bg-white bg-[#FAFAFA]  md:dark:bg-[#101010] dark:bg-black md:shadow-lg shadow-none rounded-lg overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          {isMobile && showContent ? (
            <>
              <ChevronLeft
                size={24}
                className="cursor-pointer"
                onClick={handleBack}
              />
              <h1 className="text-xl manrope-font text-center flex-1">
                {getPageTitle()}
              </h1>
              <div className="w-6"></div>
            </>
          ) : (
            <div className="flex justify-between items-center w-full px-4 py-2">
              {/* Left Side: Arrow + Heading */}
              <div className="flex items-center">
                {/* <ArrowLeft
                  size={24}
                  className="cursor-pointer bg-black dark:bg-white dark:text-black rounded text-white p-1"
                  onClick={() => navigate(-1)}
                /> */}
                <h3 className="text-xl dark:text-white font-bold manrope-font">
                  Account Setting
                </h3>
              </div>

              {/* Right Side: Button */}
              <button onClick={() => navigate('/chat')} className="hover:cursor-pointer text-sm md:text-base px-4 py-2 bg-black text-white dark:bg-[#202229] dark:text-white rounded-lg">
                Back to Chat
              </button>
            </div>
          )}
        </div>
        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop: sidebar + content side by side */}
          {!isMobile && (
            <>
              <div className="w-64 ">
                <Sidebar
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  openModal={handleItemClick}
                  isMobile={isMobile}
                />
              </div>
              <main
                className="flex-1 p-4 overflow-y-auto"
                style={{ height: "500px" }}
              >
                <Outlet />
              </main>
            </>
          )}
          {/* Mobile: either menu or content */}
          {isMobile && !showContent && (
            <div className="w-full">
              <div className="p-4">
                <h2 className="text-base manrope-font mb-3 ml-2">Management</h2>
                <MobileSidebar
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          )}
          {/* Mobile content view */}
          {isMobile && showContent && (
            <main className="flex-1 p-4 overflow-y-auto ">
              <Outlet />
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
