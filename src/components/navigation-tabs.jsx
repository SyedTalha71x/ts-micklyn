import React from 'react';
import Icon from '../../public/Icon.svg';
import { CiMail } from "react-icons/ci";

const NavigationTabsWithChat = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 ">
      {/* Navigation Cards */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="bg-white dark:bg-[#101010] rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Holding</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Lorem ipsum is simply</p>
        </div>
        
        <div className="bg-white dark:bg-[#101010] rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Trending</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Lorem ipsum is simply</p>
        </div>
        
        <div className="bg-white dark:bg-[#101010] md:block hidden rounded-xl p-4 shadow-sm border border-gray-300 dark:border-gray-700 flex-1">
          <h3 className="font-bold text-md dark:text-white">Gainers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Lorem ipsum is simply</p>
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="mt-4 flex items-center gap-2 bg-white dark:bg-[#101010] rounded-xl border border-gray-300 dark:border-gray-700 p-2 shadow-sm flex-nowrap">
        {/* Left Email Icon */}
        <div className="flex items-center justify-center h-8 w-8 rounded-full dark:text-white  shrink-0">
          <CiMail className="h-5 w-5 cursor-pointer dark:text-white" />
        </div>
        
        <input 
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm px-2 w-full dark:text-gray-200 dark:placeholder-gray-500"
          placeholder="Write message here..."
        />
        
        <button className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
          <img src={Icon} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default NavigationTabsWithChat;