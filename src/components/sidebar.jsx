/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ activeItem, setActiveItem, openModal, isMobile }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    // { name: "Manage Wallet", path: "/settings/manage-wallet" },
    { name: "Wallet Connections", path: "/settings/wallet-connections" },
    { name: "Token", path: "/settings/about-token" },
    { name: "Import Wallet", path: "/settings/import-wallet" },
    { name: "Transfer Token", path: "/settings/transfer-token" },
    { name: "Settings", path: "/settings/security-privacy" },
    { name: "Preferences", path: "/settings/preferences" },
    { name: "Portfolio", path: "/settings/portfolio" },
    { name: "Notification", path: "/settings/notification" },
      {name: 'Profile', path: '/settings/user-profile'},
    { name: "Logout", onClick: handleLogout },
  ];

  const handleItemClick = (item) => {
    if (item.onClick) {
      handleLogout();
    } else {
      setActiveItem(item.path);
      openModal(item.path);
    }
  };
  

  return (
    <div className="w-full p-4">
      <div className="space-y-3">
        {menuItems.map((item) => (
              <div
              key={item.name} // Use `name` as the key instead of `path` (Logout has no path)
              onClick={() => handleItemClick(item)}
              className={`block py-2 px-3 rounded-md dark:text-gray-400 text-sm manrope-font cursor-pointer 
                ${activeItem === item.path ? "bg-primary text-primary-foreground dark:bg-[#2A2B2E] dark:text-white" : "hover:bg-accent"}`}
            >
              {item.name}
            </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;