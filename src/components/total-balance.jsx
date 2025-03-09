import { Eye, EyeOff, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function TotalBalance() {
  const [showBalance, setShowBalance] = useState(true)
  const handleSettingsRedirect = () =>{
    window.location.href = '/settings/manage-wallet'
  }

  return (
    <div className="flex  justify-between">
      <div className="border border-gray-300 p-3 rounded-xl">
        <div className="flex items-center gap-2 ">
          <h2 className="text-md font-bold">Total balance</h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
        <p className="text-sm text-gray-400 font-semibold">USD: {showBalance ? "$29,850.15" : "••••••••"}</p>
      </div>
      <div onClick={handleSettingsRedirect}>

      <Button  size="sm" className="rounded-lg cursor-pointer  bg-primary text-primary-foreground">
       <Settings size={30}/>
      </Button>
      </div>
    </div>
  )
}

