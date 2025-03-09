import { Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function MobileHeader() {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
        <span className="font-semibold">Bell Finance</span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarFallback className="bg-muted text-xs">CC</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-medium">Top Trending Crypto Currency</h2>
          <p className="text-xs text-muted-foreground">Updated 2 mins ago · 10 February 2023</p>
        </div>
      </div>
    </div>
  )
}

