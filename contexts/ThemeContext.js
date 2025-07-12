import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const lightTheme = {
  primary: '#2c3e50',
  secondary: '#3498db',
  accent: '#e74c3c',
  background: '#f5f7fa',
  surface: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  textLight: '#bdc3c7',
  border: '#ecf0f1',
  success: '#27ae60',
  warning: '#f39c12',
  info: '#3498db',
  shadowColor: '#000',
  cardBackground: '#ffffff',
  headerBackground: '#2c3e50',
  headerText: '#ffffff',
};

export const darkTheme = {
  primary: '#34495e',
  secondary: '#3498db',
  accent: '#e74c3c',
  background: '#1a1a1a',
  surface: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#bdc3c7',
  textLight: '#7f8c8d',
  border: '#404040',
  success: '#27ae60',
  warning: '#f39c12',
  info: '#3498db',
  shadowColor: '#000',
  cardBackground: '#2d2d2d',
  headerBackground: '#34495e',
  headerText: '#ffffff',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setCurrentTheme(!isDarkMode ? darkTheme : lightTheme);
  };

  const value = {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
