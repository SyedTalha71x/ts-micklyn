import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NotificationIcon from "../../public/octicon_history-16.svg";
import VectorSvg from "../../public/Vector.svg";

export default function MobileHeader({ onMenuClick }) {
  return (
    <div className="px-2 ">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMenuClick}
        >
          <span className="sr-only">Menu</span>
          <Menu className="h-4 w-4 dark:text-white" />
        </Button>
        <h2 className="mt-0"><span className="font-bold">USD</span>: $0</h2>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <img src="/rotate-left.png" className="  dark:hidden"/>
           <img src="/rotate-left light.png" className="hidden  dark:block"/>
        </Button>
      </div>

      {/* <div className="mt-6 flex items-center gap-3 p-2 rounded-xl border border-gray-300">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-muted text-xs dark:text-white">
            CC
          </AvatarFallback>
        </Avatar>
        <div className="">
          <h2 className="text-sm font-bold dark:text-white">
            Top Trending Crypto Currency
          </h2>
          <p className="text-xs text-gray-400">
            Here are today top trending crypto..
          </p>
        </div>
      </div> */}
    </div>
  );
}
