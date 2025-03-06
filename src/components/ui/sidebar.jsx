/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";

const Sidebar = ({ activeItem, setActiveItem, openModal, isMobile }) => {
  const menuItems = [
    { name: "Manage Wallet", path: "/settings/manage-wallet" },
    { name: "Wallet Connections", path: "/settings/wallet-connections" },
    { name: "Address Book", path: "/settings/address-book" },
    { name: "Activity", path: "/settings/activity" },
    { name: "Security & Privacy", path: "/settings/security-privacy" },
    { name: "System Status", path: "/settings/system-status" },
    { name: "Preferences", path: "/settings/preferences" },
    { name: "Price Alert", path: "/settings/price-alert" },
    { name: "Notification", path: "/settings/notification" },
  ];

  const handleItemClick = (path) => {
    setActiveItem(path);
    openModal(path);
  };

  return (
    <div className="w-full p-4">
      <div className="space-y-3">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            className={`block py-2 px-3 rounded-md text-sm manrope-font cursor-pointer 
              ${activeItem === item.path ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
