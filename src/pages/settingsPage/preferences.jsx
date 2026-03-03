import {
  Card4,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useTheme } from '../../Context/ThemeContext';
import { useCurrency } from '../../Context/CurrencyContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FireApi } from '@/hooks/fireApi';

const PreferencesPage = () => {
  const { t, i18n } = useTranslation('settings');
  const { 
    currencies: currencyOptions, 
    selectedCurrency,
    loading: currencyLoading,
    updateCurrency
  } = useCurrency();
  
  const { theme, toggleTheme } = useTheme(); 
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  // Handle currency change
  const handleCurrencyChange = async (currencyId) => {
    await updateCurrency(currencyId);
  };

  const handleLanguageChange = async (languageId) => {
    try {
      setLoading(true);
      // Find the selected language object
      const language = languages.find(lang => lang.id.toString() === languageId);
      
      if (language) {
        // Map API language name to i18n code
        const languageMap = {
          'English': 'en',
          'French': 'fr',
          'Spanish': 'es',
          'Chinese': 'zh',
          'Japanese': 'ja',
          'Arabic': 'ar'
        };
        
        const i18nCode = languageMap[language.name] || 'en';
        
        // Update i18n language
        await i18n.changeLanguage(i18nCode);
        localStorage.setItem('i18nextLng', i18nCode);
        
        // Call update-language API
        const response = await FireApi('/languages', 'POST', {
          id: language.id
        });
        
        if (response.status) {
          setSelectedLanguage(language);
        } else {
          toast.error(response.message || "Failed to update language");
          // Revert i18n change if API fails
          const previousLanguage = languages.find(l => l.id === selectedLanguage?.id);
          if (previousLanguage) {
            const previousCode = languageMap[previousLanguage.name] || 'en';
            await i18n.changeLanguage(previousCode);
            localStorage.setItem('i18nextLng', previousCode);
          }
        }
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLanguages = async () => {
    try {
      const res = await FireApi('/languages', 'GET');
      if (res.status && res.data?.languages) {
        // Get all languages but mark active one
        const allLanguages = res.data.languages;
        setLanguages(allLanguages);
        
        // Find active language (active === 1)
        const activeLanguage = allLanguages.find(lang => lang.active === 1);
        if (activeLanguage) {
          setSelectedLanguage(activeLanguage);
          
          // Map API language name to i18n code
          const languageMap = {
            'English': 'en',
            'French': 'fr',
            'Spanish': 'es',
            'Chinese': 'zh',
            'Japanese': 'ja',
            'Arabic': 'ar'
          };
          
          const i18nCode = languageMap[activeLanguage.name] || 'en';
          
          // Update i18n with active language from API
          if (i18n.language !== i18nCode) {
            await i18n.changeLanguage(i18nCode);
            localStorage.setItem('i18nextLng', i18nCode);
          }
        }
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    handleGetLanguages();
  }, []);

  console.log(selectedCurrency, 'selectedCurrency selectedCurrency')


  return (
    <Card4 className="w-full">
      <CardContent className="-mt-6 md:py-4">
        <div className="space-y-2 md:space-y-4">
          
          {/* Currency Selection */}
          <div>
            <label className="block mb-2 text-sm dark:text-white">
              {t('preferences.currency')}
            </label>
            <Select 
              onValueChange={handleCurrencyChange} 
              value={selectedCurrency?.id?.toString()}
              disabled={currencyLoading}
            >
              <SelectTrigger className="w-full dark:bg-[#232428] dark:text-white">
                <SelectValue placeholder={t('preferences.selectCurrency')}>
                  {selectedCurrency ? (
                    <span className="flex items-center gap-2">
                      <span className="text-base font-bold">
                        {selectedCurrency.displaySymbol || 
                         selectedCurrency.symbol || updateCurrency}
                      </span>
                      <span>
                        {selectedCurrency.name} 
                      </span>
                    </span>
                  ) : (
                    t('preferences.selectCurrency')
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="dark:bg-[#232428] dark:text-white">
                {currencyOptions.map((currency) => {
                  // Get symbol for this currency
                  const symbol = currency.symbol;
                  
                  return (
                    <SelectItem 
                      key={currency.id} 
                      value={currency.id.toString()}
                      className={currency.active === 1 ? 'font-semibold bg-gray-100 dark:bg-gray-700' : ''}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base font-bold w-6 text-center">
                          {symbol}
                        </span>
                        <span className="flex-1">
                          {currency.name}
                        </span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
          </div>
          
          {/* Appearance Section */}
          <div>
            <label className="block mb-2 mt-4 text-sm dark:text-white">
              {t('preferences.appearance')}
            </label>
            <div className="space-y-2">
              {/* Language Selection */}
              <div>
                <Select 
                  onValueChange={handleLanguageChange} 
                  value={selectedLanguage?.id?.toString()}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full dark:bg-[#232428] dark:text-white">
                    <SelectValue placeholder={t('preferences.language')}>
                      {selectedLanguage?.name || t('preferences.selectLanguage')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#232428] dark:text-white">
                    {languages.map((language) => (
                      <SelectItem 
                        key={language.id} 
                        value={language.id.toString()}
                        className={language.active === 1 ? 'font-semibold bg-gray-100 dark:bg-gray-700' : ''}
                      >
                        <span className="flex items-center gap-2">
                          {language.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Theme Selection */}
              <div>
                <Select
                  value={theme}
                  onValueChange={toggleTheme}
                >
                  <SelectTrigger className="w-full dark:bg-[#232428] dark:text-white">
                    <SelectValue placeholder={t('preferences.theme')} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#232428] dark:text-white">
                    <SelectItem value="light">{t('preferences.light')}</SelectItem>
                    <SelectItem value="dark">{t('preferences.dark')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card4>
  );
};

export default PreferencesPage;