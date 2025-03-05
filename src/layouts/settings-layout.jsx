import Sidebar from "@/components/ui/sidebar";
import { X } from "lucide-react";
import { Outlet } from "react-router-dom";

// Main Layout Component
const SettingsLayout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden h-[600px]">
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div>
            <X size={25} className="cursor-pointer"/>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
