/* eslint-disable react-refresh/only-export-components */
// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || 'light';
    }
    return 'light';
  });

  // Function to toggle theme
  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Apply theme changes to the document
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Create the value object to be provided to consumers
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};