import React from 'react';
import Icon from '../../public/Icon.svg'
import { CiMail } from "react-icons/ci";


const NavigationTabsWithChat = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Navigation Cards */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-300 flex-1">
          <h3 className="font-bold text-md">Holding</h3>
          <p className="text-xs text-gray-500">Lorem ipsum is simply</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-300 flex-1">
          <h3 className="font-bold text-md">Trending</h3>
          <p className="text-xs text-gray-500">Lorem ipsum is simply</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-300 flex-1">
          <h3 className="font-bold text-md">Gainers</h3>
          <p className="text-xs text-gray-500">Lorem ipsum is simply</p>
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="mt-4 flex  items-center gap-2 bg-white rounded-xl border border-gray-300 p-2 shadow-sm">
        <div className="flex  items-center justify-center h-8 w-8 rounded-full bg-gray-100">
       <CiMail className="h-5 w-5 cursor-pointer" />
        </div>
        
        <input 
          className="flex-1 bg-transparent border-none outline-none text-sm"
          placeholder="Write message here..."
        />
        
        <button className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
       <img src={Icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default NavigationTabsWithChat;