"use client"

import { useState } from "react"
import CryptoTable from "@/components/crypto-table"
import MobileHeader from "@/components/mobile-header"
import NavigationTabs from "@/components/navigation-tabs"
import TotalBalance from "@/components/total-balance"

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background dark:bg-black flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex md:w-[20%] md:flex-shrink-0 bg-gray-100 dark:bg-black shadow-xl dark:border dark:border-r">
        <div className="h-full w-full flex flex-col">
          <div className="p-4 overflow-y-auto flex-1">
            <TotalBalance />
          </div>
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
        <div className="h-full flex flex-col">
          <div className="overflow-y-auto flex-1 pt-7">
            <TotalBalance />
          </div>
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
      <div className="flex-1 flex flex-col flex-wrap relative h-full">
        {/* Bottom Navigation */}
        <div className="fixed md:ml-0 mx-auto w-[100%] md:w-[80%] p-2">
          <NavigationTabs />
        </div>
      </div>
    </div>
  )
}