import { useState } from "react"
import { Card } from "@/components/ui/card"


const ManageWallet = () => {
  const [selectedWallet, setSelectedWallet] = useState(null)

  const walletOptions = [
    { name: "BNB Smart Chain", ticker: "BNB" },
    { name: "BitCoin", ticker: "BTC" },
    { name: "Solana", ticker: "SOL" },
    { name: "Ethereum", ticker: "ETH" },
    { name: "Polygon", ticker: "MATIC" },
  ]

  return (
    <div className="w-full ">
      <h2 className="text-lg font-medium mb-4">Select Wallet</h2>
      <div className="space-y-2">
        {walletOptions.map((wallet) => (
          <Card
            key={wallet.name}
            className={`p-4 cursor-pointer  transition-colors ${
              selectedWallet === wallet.name ? "border-2" : "border-gray-200"
            }`}
            onClick={() => setSelectedWallet(wallet.name)}
          >
            <div className="flex flex-col manrope-font">
              <span className="font-medium">{wallet.name}</span>
              <span className="text-sm text-muted-foreground">{wallet.ticker}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageWallet

