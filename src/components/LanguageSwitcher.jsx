import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n, t } = useTranslation('common');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select px-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        aria-label={t('language')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;