import { useNavigate } from "react-router-dom";

/* eslint-disable no-unused-vars */
const MobileSidebar = ({ activeItem, setActiveItem, onItemClick }) => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("wallet-address");
    localStorage.removeItem("user-visited-dashboard");
    navigate("/login");
  };

    const menuItems = [
      { name: "Manage Wallet", path: "/settings/manage-wallet" },
      { name: "Wallet connections", path: "/settings/wallet-connections" },
      { name: "Address Book", path: "/settings/address-book" },
      { name: "Activity", path: "/settings/activity" },
      { name: "Security & Privacy", path: "/settings/security-privacy" },
      { name: "System Status", path: "/settings/system-status" },
      { name: "Preferences", path: "/settings/preferences" },
      { name: "Notification", path: "/settings/notification" },
      { name: "Price Alert", path: "/settings/price-alert" },
      { name: "Logout", onClick: handleLogout },
    ];

    const handleItemClick = (item) => {
      if (item.onClick) {
        handleLogout();
      } else {
        setActiveItem(item.path);
      }
    };
  
    return (
      <div className="w-full space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleItemClick(item)}
            className="flex justify-between items-center p-4 rounded-lg border bg-white dark:bg-[#1B1C1E] shadow-sm text-sm cursor-pointer"
          >
            <span>{item.name}</span>
            <span className="text-gray-400">›</span>
          </div>
        ))}
      </div>
    );
  };

  export default MobileSidebar