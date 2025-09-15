import { useNavigate } from "react-router-dom";

const MobileSidebar = ({ activeItem, setActiveItem, onItemClick, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("wallet-address");
    localStorage.removeItem("user-visited-dashboard");
    navigate("/login");
  };

  const menuItems = [
    { name: "Wallet Connections", path: "/settings/wallet-connections" },
    { name: "Token", path: "/settings/about-token" },
    { name: "Import Wallet", path: "/settings/import-wallet" },
    { name: "Import Tokens", path: "/settings/import-tokens" },
    { name: "Transfer Token", path: "/settings/transfer-token" },
    { name: "Settings", path: "/settings/security-privacy" },
    { name: "Preferences", path: "/settings/preferences" },
    { name: "Portfolio", path: "/settings/portfolio" },
    { name: "Notification", path: "/settings/notification" },
    { name: "Profile", path: "/settings/user-profile" },
    { name: "Logout", onClick: handleLogout },
  ];

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
      setActiveItem(item.path);
    }
    
    // Close the sidebar after clicking an item (on mobile)
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-full space-y-2">
      {menuItems.map((item, index) => (
        <div
          key={item.path || index}
          onClick={() => handleItemClick(item)}
          className={`flex justify-between items-center p-4 rounded-lg border bg-white dark:bg-[#1B1C1E] shadow-sm text-sm cursor-pointer ${
            activeItem === item.path ? "border-blue-500 dark:border-blue-400" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <span className={activeItem === item.path ? "text-blue-600 dark:text-blue-400 font-medium" : ""}>
            {item.name}
          </span>
          <span className="text-gray-400">›</span>
        </div>
      ))}
    </div>
  );
};

export default MobileSidebar;