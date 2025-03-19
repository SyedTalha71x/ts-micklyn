/* eslint-disable no-unused-vars */
const MobileSidebar = ({ activeItem, setActiveItem, onItemClick }) => {
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
    ];
  
    return (
      <div className="w-full space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => onItemClick(item.path)}
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