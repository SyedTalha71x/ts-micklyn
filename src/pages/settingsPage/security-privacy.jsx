import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const SecurityPrivacy = () => {
  const [hideBalance, setHideBalance] = useState(false)

  return (
    <div className="w-full space-y-2 manrope-font ">
      <h2 className="text-lg manrope-font">Safe guard</h2>

      <div className="space-y-4">
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span>Lock Method</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card>

        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span>Change Password</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">USD</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-4 flex flex-row  justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span>Auto Lock</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">Instantly</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-base manrope-font">Authentication</h3>
        <Card className="text-gray-800 flex flex-row p-4 justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span>DApp Auto-Disconnect</span>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-2">Off</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-base manrope-font">Privacy</h3>
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span>Hide balance when opening app</span>
          <Switch checked={hideBalance} onCheckedChange={setHideBalance} />
        </Card>
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="text-base manrope-font">Wallet Backups</h3>
        <Card className="p-4 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-primary">1 Wallet needs backup</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Card>
      </div>
    </div>
  )
}

export default SecurityPrivacy

