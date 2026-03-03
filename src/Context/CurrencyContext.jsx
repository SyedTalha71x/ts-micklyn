import React, { createContext, useState, useContext, useEffect } from 'react';
import { FireApi } from '@/hooks/fireApi';
import toast from 'react-hot-toast';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [loading, setLoading] = useState(false);

  // 🔥 ID → SYMBOL MAP
  const symbolMap = {
    1: '$',   // US Dollar
    2: '€',   // Euro
    3: '¥',   // Japanese Yen
    4: '£',   // British Pound
    5: '¥',   // Chinese Yuan
    6: 'CHF'  // Swiss Franc
  };

  const getSymbolById = (id) => {
    return symbolMap[id] || '$';
  };

  // 🔵 Fetch currencies
  const fetchCurrencies = async () => {
    try {
      setLoading(true);

      const response = await FireApi('/currencies', 'GET');

      if (response.status && response.data?.currencies) {

        const list = response.data.currencies;
        setCurrencies(list);

        const activeCurrency = list.find(c => c.active === 1);

        if (activeCurrency) {
          const symbol = getSymbolById(activeCurrency.id);

          setSelectedCurrency(activeCurrency);
          setCurrencySymbol(symbol);

          localStorage.setItem('selectedCurrency', JSON.stringify(activeCurrency));
          localStorage.setItem('currencySymbol', symbol);
        }
      }

    } catch (error) {
      toast.error(error?.message || 'Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Update currency
  const updateCurrency = async (currencyId) => {
    try {
      setLoading(true);

      const response = await FireApi('/currencies', 'POST', {
        id: currencyId
      });

      if (response.status) {

        const symbol = getSymbolById(currencyId);

        const updatedList = currencies.map(c => ({
          ...c,
          active: c.id === Number(currencyId) ? 1 : 0
        }));

        const newSelected = updatedList.find(c => c.active === 1);

        setCurrencies(updatedList);
        setSelectedCurrency(newSelected);
        setCurrencySymbol(symbol);

        localStorage.setItem('selectedCurrency', JSON.stringify(newSelected));
        localStorage.setItem('currencySymbol', symbol);

        return true;
      }

      return false;

    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🟣 Load from localStorage first
  useEffect(() => {

    const storedCurrency = localStorage.getItem('selectedCurrency');
    const storedSymbol = localStorage.getItem('currencySymbol');

    if (storedCurrency) {
      setSelectedCurrency(JSON.parse(storedCurrency));
    }

    if (storedSymbol) {
      setCurrencySymbol(storedSymbol);
    }

    fetchCurrencies();

  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        selectedCurrency,
        currencySymbol,
        loading,
        updateCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};