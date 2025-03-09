import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CryptoWatchlist() {
  const [activeTab, setActiveTab] = useState("watchlist");
  
  const cryptoData = [
    { name: "BTC", fullName: "Bitcoin", value: "$69,915.4", change: "-2%" },
    { name: "LTC", fullName: "Litecoin", value: "$69,915.4", change: "+2%" },
    { name: "ETH", fullName: "Ethereum", value: "$2,932.76", change: "-2%" },
    { name: "XMR", fullName: "Monero", value: "$435.87", change: "-2%" },
    { name: "DOT", fullName: "Polkadot", value: "$31.45", change: "-3%" },
  ];
  
  return (
    <div className="border border-gray-300 rounded-xl h-full overflow-auto bg-white">
      {/* Tab Switcher */}
      <div className="flex p-2 cursor-pointer gap-2">
        <button 
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            activeTab === "watchlist" 
              ? "bg-white text-black" 
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("watchlist")}
        >
          Watchlist
        </button>
        <button 
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
            activeTab === "history" 
              ? "bg-white text-black" 
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>
      
      {/* Crypto List */}
      <div className="p-4">
        {activeTab === "watchlist" && (
          <div className="space-y-4">
            {cryptoData.map((crypto) => (
              <div key={crypto.name} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{crypto.name}</span>
                  <span className="text-xs text-gray-500">{crypto.fullName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm">{crypto.value}</span>
                  <span className={`text-xs ${
                    crypto.change.startsWith("+") ? "text-green-500" : "text-red-500"
                  }`}>
                    {crypto.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "history" && (
          <div className="py-8 text-center text-gray-500">
            History information would be displayed here
          </div>
        )}
      </div>
    </div>
  );
}