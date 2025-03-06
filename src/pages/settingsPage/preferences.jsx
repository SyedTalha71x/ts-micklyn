/* eslint-disable no-unused-vars */
import { ChevronRight } from "lucide-react";

const PreferencesPage = () => {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    return <MobilePreferencesPage />;
  }
  
  return <DesktopPreferencesPage />;
};

const MobilePreferencesPage = () => {
  return (
    <div className="w-full space-y-4 manrope-font">
      <h2 className="text-lg font-medium mb-2">Currency</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center p-4 rounded-lg border bg-white shadow-sm cursor-pointer">
          <span>Wallet Currency</span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="flex justify-between items-center p-4 rounded-lg border bg-white shadow-sm cursor-pointer">
          <span>On/Off-Ramp Currency</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">USD</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <h2 className="text-lg font-medium mt-4 mb-2">Appearance</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center p-4 rounded-lg border bg-white shadow-sm cursor-pointer">
          <span>Language</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">EN</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 rounded-lg border bg-white shadow-sm cursor-pointer">
          <span>Theme</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">System</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopPreferencesPage = () => {
  const Card1 = ({ children, className }) => (
    <div className={`rounded-lg border shadow-sm ${className}`}>{children}</div>
  );
  
  const CardContent = ({ children }) => (
    <div className="p-6">{children}</div>
  );
  
  const Select = ({ children }) => (
    <div className="relative w-full">{children}</div>
  );
  
  const SelectTrigger = ({ children }) => (
    <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none">
      {children}
    </button>
  );
  
  const SelectValue = ({ placeholder }) => (
    <span className="text-muted-foreground">{placeholder}</span>
  );
  
  const SelectContent = ({ children }) => (
    <div className="hidden">{children}</div>
  );
  
  const SelectItem = ({ value, children }) => (
    <div className="hidden">{children}</div>
  );

  return (
    <Card1 className="w-full manrope-font max-w-2xl">
      <CardContent>
        <div className="space-y-4">
          <div className=''>
            <label className="block mb-2">Currency</label>
            <Select >
              <SelectTrigger>
                <SelectValue placeholder="Select Wallet Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select On/Off-Ramp Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2 mt-10">Appearance</label>
            <div className="space-y-2">
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card1>
  );
};

export default PreferencesPage;