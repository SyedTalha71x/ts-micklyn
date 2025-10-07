"use client"

import { useEffect, useState } from "react"
import CryptoTable from "@/components/crypto-table"
import MobileHeader from "@/components/mobile-header"
import NavigationTabs from "@/components/navigation-tabs"
import { EyeIcon, EyeOffIcon, Settings } from "lucide-react"
import { FireApi } from "@/hooks/fireApi"
import { useNavigate } from "react-router-dom"
import { IoClose } from "react-icons/io5"

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [balances, setBalances] = useState([])
  const [showBalances, setShowBalances] = useState(true)
  const navigate = useNavigate()

  const addresses = {
    ETH: localStorage.getItem("eth-address"),
    POL: localStorage.getItem("polygon-address"),
    SOL: localStorage.getItem("solana-address"),
    BSC: localStorage.getItem("bsc-address"),
  }

  const fetchBalance = async (chain, url) => {
    try {
      const response = await FireApi(url, "GET")
      const data = response?.data
      if (data) {
        setBalances((prev) => [...prev, { blockchain: data.blockchain, balance: data.balance }])
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (addresses.ETH) fetchBalance("ETH", `/ethereum/get-user-balance?address=${addresses.ETH}`)
    if (addresses.POL) fetchBalance("POL", `/polygon/get-user-balance?address=${addresses.POL}`)
    if (addresses.SOL) fetchBalance("SOL", `/solana/get-user-balance?address=${addresses.SOL}`)
    if (addresses.BSC) fetchBalance("BSC", `/bsc/get-user-balance?address=${addresses.BSC}`)
  }, [])

  return (
    <div className="relative min-h-[100dvh] bg-background dark:bg-black flex flex-col md:flex-row overflow-hidden ios-root">
      <style>{`
        /* iOS Safe Area Fixes */
        .ios-root {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .ios-header {
          padding-top: env(safe-area-inset-top);
        }
      `}</style>

      {/* Mobile Header - iOS Safe Area Fixed */}
      <div className="md:hidden fixed w-full z-50 bg-white dark:bg-black py-2 border-b border-gray-200 dark:border-gray-800 ios-header">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex md:w-[20%] md:flex-shrink-0">
        <div className="h-full w-full flex flex-col">
          <div className="p-4">
            <CryptoTable />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden flex flex-col ios-sidebar
        `}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Header Section - Fixed Height */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <button
                onClick={() => navigate("/settings/wallet-connections")}
                className="bg-black dark:bg-[#1b1c1e] border border-[#A0AEC0] dark:border-gray-700 p-1.5 z-10 cursor-pointer rounded-lg text-white hover:bg-gray-800 transition-colors"
              >
                <Settings size={19} />
              </button>
              Settings
            </span>
            <button
              className="bg-black dark:bg-[#1b1c1e] w-8 h-8 text-white p-0 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
              onClick={() => setSidebarOpen(false)}
            >
              <IoClose size={22} /> {/* ✅ Now it will show */}
            </button>
          </div>

          {/* Balances Section */}
          <div className="mt-4 p-3 text-xs flex flex-col gap-2 border border-[#A0AEC0] dark:border-gray-600 rounded-lg bg-white dark:bg-[#1b1c1e]">
            <div className="flex flex-row justify-between items-center font-bold">
              Total Balances
              <button onClick={() => setShowBalances((prev) => !prev)}>
                {showBalances ? <EyeIcon size={15} /> : <EyeOffIcon size={15} />}
              </button>
            </div>
            <div className="flex justify-between">
              <span className="capitalize font-medium">USD:</span>
              <span>{showBalances ? "$0" : "****"}</span>
            </div>
          </div>
        </div>

        {/* CryptoTable Section */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4 pt-2">
            <CryptoTable />
          </div>
        </div>
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Chat Area - iOS Optimized */}
      <div className="flex-1 flex flex-col min-h-0 md:ml-0 ios-main">
        {/* Desktop Balances */}
        <div className="hidden lg:block border text-xs flex-col gap-2 border-[#A0AEC0] dark:border-gray-600 bg-white dark:bg-[#1b1c1e] p-2 rounded-lg absolute top-4 shadow-sm z-50">
          <div className="flex flex-row justify-between items-center mb-1 font-bold gap-4">
            Total Balances
            <button onClick={() => setShowBalances((prev) => !prev)}>
              {showBalances ? (
                <EyeIcon size={15} className="mt-[2px]" />
              ) : (
                <EyeOffIcon size={15} className="mt-[2px]" />
              )}
            </button>
          </div>
          <div className="flex gap-2">
            <span className="capitalize">USD:</span>
            <span>{showBalances ? "$0" : "****"}</span>
          </div>
        </div>

        {/* Desktop Settings Button */}
        <button
          onClick={() => navigate("/settings/wallet-connections")}
          className="hidden lg:block absolute top-4 right-4 bg-black dark:bg-[#1b1c1e] border border-[#A0AEC0] dark:border-gray-700 p-1.5 z-10 cursor-pointer rounded-lg text-white hover:bg-gray-800 transition-colors"
        >
          <Settings size={19} />
        </button>

        {/* Bottom Navigation - iOS Safe */}
        <div className="flex-1 w-full overflow-auto md:w-[60%] md:mx-auto h-full md:max-h-[100vh] md:mt-0">
          <NavigationTabs />
        </div>
      </div>
    </div>
  )
}
