import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/GlobalStyles';
import { useUser } from './UserContext';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: ThemeType;
  isDarkMode: boolean;
  colors: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const { user } = useUser();
  const [theme, setThemeState] = useState<ThemeType>('system');

  // Đồng bộ theme dựa theo dữ liệu Settings của User (nếu có)
  useEffect(() => {
    if (user?.preferences?.theme) {
      setThemeState(user.preferences.theme as ThemeType);
    }
  }, [user?.preferences?.theme]);

  const isDarkMode = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDarkMode ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={{ theme, isDarkMode, colors }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};