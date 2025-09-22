import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NotificationIcon from "../../public/octicon_history-16.svg";
import VectorSvg from "../../public/Vector.svg";

export default function MobileHeader({ onMenuClick }) {
  return (
    <div className="p-4 ">
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
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <img
            src={NotificationIcon}
            className=" block dark:hidden"
            alt="Light Mode Image"
          />
          <img
            src={VectorSvg}
            className=" hidden dark:block"
            alt="Dark Mode Image"
          />
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
