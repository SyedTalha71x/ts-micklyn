/* eslint-disable no-unused-vars */
import { useState } from "react";
import Icon from "../../public/Icon.svg";
import { IoWalletOutline } from "react-icons/io5";
import Wallet from "../../public/wallet.svg";

const NavigationTabsWithChat = () => {
  const [activeWallet, setActiveWallet] = useState(1);
  const [totalWallets, setTotalWallets] = useState(2); // Example: user has 2 wallets

  const switchWallet = () => {
    // Cycle through wallets
    setActiveWallet((prev) => (prev % totalWallets) + 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Navigation Cards */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="bg-white dark:bg-[#101010] rounded-xl p-4 shadow-sm border border-[#A0AEC0] dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Holding</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum is simply
          </p>
        </div>

        <div className="bg-white dark:bg-[#101010] rounded-xl p-4 shadow-sm border border-[#A0AEC0] dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Trending</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum is simply
          </p>
        </div>

        <div className="bg-white dark:bg-[#101010] md:block hidden rounded-xl p-4 shadow-sm border border-[#A0AEC0] dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Gainers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum is simply
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 bg-white dark:bg-[#101010] rounded-xl border border-[#A0AEC0] dark:border-gray-700 p-2 shadow-sm w-full">
        <div className="w-full">
          <input
            className="w-full bg-transparent border-none outline-none text-sm px-2 dark:text-gray-200 dark:placeholder-gray-700"
            placeholder="Write message here..."
          />
        </div>

        <div className="flex justify-between items-center w-full">
          <div
            className="flex items-center justify-center h-8 w-8 relative cursor-pointer shrink-0"
            onClick={switchWallet}
          >
            <img src={Wallet} alt="" className="dark:invert" />
            {totalWallets > 1 && (
              <span className="absolute -top-1 -right-1 text-xs bg-gray-200 dark:bg-gray-600 rounded-full h-4 w-4 flex items-center justify-center dark:text-white">
                {activeWallet}
              </span>
            )}
          </div>

          <button className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center shrink-0">
            <img
              src={Icon}
              alt="Send"
              className="h-4 w-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationTabsWithChat;
