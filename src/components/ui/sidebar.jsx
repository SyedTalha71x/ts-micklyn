import { NavLink } from "react-router-dom";

const Sidebar = () => {
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

  return (
    <div className="w-64  p-4">
        <div className="space-y-3">

      {menuItems.map((item) => (
          <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block py-2 px-3 rounded-md text-sm  manrope-font ${
                isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`
        }
        >
          {item.name}
        </NavLink>
      ))}
      </div>
    </div>
  );
};

export default Sidebar;
