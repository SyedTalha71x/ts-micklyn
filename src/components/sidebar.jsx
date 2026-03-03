/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = ({ activeItem, setActiveItem, openModal, isMobile }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('settings');

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    // { name: "Manage Wallet", path: "/settings/manage-wallet" },
    { name: t('sidebar.walletConnections'), path: "/settings/wallet-connections" },
    { name: t('sidebar.token'), path: "/settings/about-token" },
    { name: t('sidebar.importWallet'), path: "/settings/import-wallet" },
    { name: t('sidebar.importTokens'), path: "/settings/import-tokens" },
    { name: t('sidebar.transferToken'), path: "/settings/transfer-token" },
    { name: t('sidebar.settings'), path: "/settings/security-privacy" },
    { name: t('sidebar.preferences'), path: "/settings/preferences" },
    { name: t('sidebar.portfolio'), path: "/settings/portfolio" },
    { name: t('sidebar.notification'), path: "/settings/notification" },
    { name: t('sidebar.profile'), path: "/settings/user-profile" },
    { name: t('sidebar.logout'), onClick: handleLogout },
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
      {/* Add Language Switcher at the top of sidebar */}
      {/* {!isMobile && (
        <div className="mb-6 px-3">
          <LanguageSwitcher />
        </div>
      )} */}
      
      <div className="space-y-3">
        {menuItems.map((item) => (
          <div
            key={item.path || item.name} // Use path if available, otherwise name
            onClick={() => handleItemClick(item)}
            className={`block py-2 px-3 rounded-md dark:text-gray-400 text-sm manrope-font cursor-pointer 
                ${
                  activeItem === item.path
                    ? "bg-primary text-primary-foreground dark:bg-[#2A2B2E] dark:text-white"
                    : "hover:bg-accent"
                }`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;