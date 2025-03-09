import CryptoTable from "@/components/crypto-table";
import MobileHeader from "@/components/mobile-header";
import NavigationTabs from "@/components/navigation-tabs";
import TotalBalance from "@/components/total-balance";
import ChatInput from "@/components/chat-input";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        <div className="md:w-1/3 lg:w-1/5 ">
          <CryptoTable />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <TotalBalance />
          </div>

         
        </div>
      </div>

      <div className="fixed bottom-0 w-[70%] ml-auto left-0 right-0 ">
        <div className="flex-1">
          <NavigationTabs />
        </div>
      </div>
    </div>
  );
}