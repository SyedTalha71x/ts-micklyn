"use client"

import { useState } from "react"
import CryptoTable from "@/components/crypto-table"
import MobileHeader from "@/components/mobile-header"
import NavigationTabs from "@/components/navigation-tabs"
import TotalBalance from "@/components/total-balance"

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div
          className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-xs bg-background shadow-lg transform transition-transform duration-500 ease-in-out p-4
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
        >
          <div className="h-full overflow-y-auto pt-7">
            <CryptoTable />
          </div>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Original desktop layout - CryptoTable in column */}
        <div className="hidden p-4 md:block md:w-1/4 lg:w-1/5">
          <CryptoTable />
        </div>

        <div className="flex-1 md:flex hidden flex-col ">
          <div className="p-4">
            <TotalBalance />
          </div>

          {/* Placeholder for financial chart */}
          {/* <div className="flex justify-center p-3 ">
            <div className="w-full">
              <FinancialChart />
            </div>
          </div> */}
        </div>
      </div>

      <div className="fixed bottom-0 lg:w-[70%] w-full ml-auto left-0 right-0">
        <div className="flex-1">
          <NavigationTabs />
        </div>
      </div>
    </div>
  )
}

