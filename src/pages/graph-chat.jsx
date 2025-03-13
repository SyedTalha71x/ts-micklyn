/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import CryptoTable from "@/components/crypto-table"
import NavigationTabs from "@/components/navigation-tabs"
import TotalBalance from "@/components/total-balance"
import FinancialChart from "@/components/financial.chart"
import MobileHeaderChat from "@/components/mobile-header-chat"

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = useLocation()
  const isGraphChat = pathname === "/graph-chat"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="md:hidden">
        <MobileHeaderChat onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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

        {/* Main content area - Make chart scrollable on small screens */}
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 p-3">
            <div className=" w-full">
              <FinancialChart />
            </div>
          </div>
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