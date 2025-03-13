import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import NotificationIcon from "../../public/octicon_history-16.svg";
import VectorSvg from "../../public/Vector.svg";

export default function MobileHeaderChat({ onMenuClick }) {
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
        <span className="font-semibold flex dark:text-white gap-1 text-sm">
          Bell <div className="text-gray-400">:$69155.4</div>
        </span>
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

    </div>
  );
}
