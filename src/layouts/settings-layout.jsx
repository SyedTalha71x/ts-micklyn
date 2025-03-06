import Sidebar from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileSidebar from "@/components/ui/mobile-sidebar";

const SettingsLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeItem, setActiveItem] = useState("/settings/manage-wallet");
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
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
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
            <h1 className="text-xl p-4 manrope-font w-full md:text-left text-center">
              Account Setting
            </h1>
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
            <main className="flex-1 p-4 overflow-y-auto">
              <Outlet />
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;