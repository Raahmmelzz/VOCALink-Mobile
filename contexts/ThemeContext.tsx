// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
  theme: {
    background: string;
    card: string;
    text: string;
    textMuted: string;
    border: string; // <--- This is what TypeScript was missing!
  };
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = (value: boolean) => setIsDarkMode(value);

  // Deep OLED-friendly true black palette
  const theme = {
    background: isDarkMode ? "#000000" : "#F3F9FF", 
    card: isDarkMode ? "#111111" : "#FFFFFF",       
    text: isDarkMode ? "#F8F9FA" : "#1A1A2E",       
    textMuted: isDarkMode ? "#8E8E93" : "#6B7280",  
    border: isDarkMode ? "#1C1C1E" : "#EEF7FF",     // <--- Added the border color here too
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};