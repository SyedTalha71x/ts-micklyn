import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enSettings from './locales/client/en/settings.json';
import enMain from './locales/client/en/main.json';

// Import French translations
import frSettings from './locales/client/fr/settings.json';
import frMain from './locales/client/fr/main.json';

// Import Chinese translations
import zhSettings from './locales/client/zh/settings.json';
import zhMain from './locales/client/zh/main.json';

// Import Spanish translations
import esSettings from './locales/client/es/settings.json';
import esMain from './locales/client/es/main.json';

// Import Japanese translations
import jaSettings from './locales/client/ja/settings.json';
import jaMain from './locales/client/ja/main.json';

// Import Arabic translations
import arSettings from './locales/client/ar/settings.json';
import arMain from './locales/client/ar/main.json';

const resources = {
  en: {
    settings: enSettings,
    chat: enMain,
  },
  fr: {
    settings: frSettings,
    chat: frMain,
  },
  zh: {
    settings: zhSettings,
    chat: zhMain,
  },
  es: {
    settings: esSettings,
    chat: esMain,
  },
  ja: {
    settings: jaSettings,
    chat: jaMain,
  },
  ar: {
    settings: arSettings,
    chat: arMain,
  }
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    
    interpolation: {
      escapeValue: false, 
    },
    
    defaultNS: 'settings',
    ns: ['settings', 'chat'],
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false, 
    }
  });

// Log to verify initialization
console.log('i18n initialized:', i18n.isInitialized);
console.log('Available languages:', Object.keys(resources));
console.log('Available namespaces:', i18n.options.ns); 

// RTL support for Arabic
// i18n.on('languageChanged', (lng) => {
//   if (lng === 'ar') {
//     document.documentElement.dir = 'rtl';
//     document.documentElement.lang = 'ar';
//   } else {
//     document.documentElement.dir = 'ltr';
//     document.documentElement.lang = lng;
//   }
// });


export default i18n;