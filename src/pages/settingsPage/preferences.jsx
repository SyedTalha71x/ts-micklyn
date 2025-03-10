import {
  Card,
  Card2,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';

const PreferencesPage = () => {
  const [walletCurrencyOpen, setWalletCurrencyOpen] = useState(false);
  const [selectedWalletCurrency, setSelectedWalletCurrency] = useState('gbp');
  
  const toggleWalletCurrency = () => {
    setWalletCurrencyOpen(!walletCurrencyOpen);
  };
  
  const selectCurrency = (currency) => {
    setSelectedWalletCurrency(currency);
    setWalletCurrencyOpen(false);
  };

  return (
    <Card2 className="w-full max-w-2xl">
      <CardContent className="py-4">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm dark:text-white">Currency</label>
            <div className="relative">
              <div 
                className="border rounded-md p-2 dark:bg-[#232428] dark:text-white cursor-pointer flex items-center justify-between" 
                onClick={toggleWalletCurrency}
              >
                <span className="text-sm text-gray-500">
                  {selectedWalletCurrency === 'gbp' ? 'British pound' : 
                   selectedWalletCurrency === 'usd' ? 'US Dollar' : 'Euro'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
              
              {walletCurrencyOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#232428] border rounded-md shadow-lg z-10">
                  <div className="grid grid-cols-3 gap-2 p-2">
                    <div 
                      className={`border rounded-md p-2 cursor-pointer ${selectedWalletCurrency === 'gbp' ? 'border-blue-500 bg-blue-50 dark:bg-[#232428] dark:border-gray-700' : 'border-gray-200 dark:border-gray-500'}`}
                      onClick={() => selectCurrency('gbp')}
                    >
                      <div className="flex flex-col dark:text-white">
                        <span className="text-sm font-medium">British pound</span>
                        <span className="text-xs text-gray-500">£</span>
                      </div>
                    </div>
                    <div 
                      className={`border rounded-md p-2 cursor-pointer ${selectedWalletCurrency === 'usd' ? 'border-blue-500 bg-blue-50 dark:bg-[#232428] dark:border-gray-700' : 'border-gray-200 dark:border-gray-500'}`}
                      onClick={() => selectCurrency('usd')}
                    >
                      <div className="flex flex-col dark:text-white">
                        <span className="text-sm font-medium">US Dollar</span>
                        <span className="text-xs text-gray-500">$</span>
                      </div>
                    </div>
                    <div 
                      className={`border rounded-md p-2 cursor-pointer ${selectedWalletCurrency === 'eur' ? 'border-blue-500 bg-blue-50 dark:bg-[#232428] dark:border-gray-700' : 'border-gray-200 dark:border-gray-500'}`}
                      onClick={() => selectCurrency('eur')}
                    >
                      <div className="flex flex-col dark:text-white">
                        <span className="text-sm font-medium">Euro</span>
                        <span className="text-xs text-gray-500">€</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Select>
              <SelectTrigger className="w-full dark:bg-[#232428] dark:text-white">
                <SelectValue placeholder="On/Off-Ramp Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="btc">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block mb-2 mt-4 text-sm dark:text-white">Appearance</label>
            <div className="space-y-2">
              <div>
                <Select>
                  <SelectTrigger className="w-full dark:bg-[#232428] dark:text-white">
                    <SelectValue placeholder="Language" />
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
                  <SelectTrigger className="w-full dark:bg-[#232428] dark:text-white">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className={`dark:bg-[#232428] dark:text-white`}>
                    <SelectItem  value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card2>
  );
};

export default PreferencesPage;