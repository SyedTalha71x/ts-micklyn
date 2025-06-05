"use client"

import { useState } from "react"
import CryptoTable from "@/components/crypto-table"
import MobileHeader from "@/components/mobile-header"
import NavigationTabs from "@/components/navigation-tabs"
import TotalBalance from "@/components/total-balance"
import FinancialChart from "@/components/financial.chart"

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background dark:bg-black flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex md:w-[20%] md:flex-shrink-0 bg-gray-100 shadow-xl">
        <div className="h-full w-full  p-4">
          <TotalBalance />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 p-4 bg-background shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <div className="h-full overflow-y-auto pt-7">
          <TotalBalance />
        </div>
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Bottom Navigation */}
        <div className="fixed -ml-[2%] md:ml-0 mx-auto md:w-[80%]  p-2">
          <NavigationTabs />
        </div>
      </div>
    </div>
  )
}
