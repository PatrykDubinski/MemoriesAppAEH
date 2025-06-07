import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

export const lightColors = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#ffffff',
  card: '#f8f9fa',
  text: '#212529',
  border: '#dee2e6',
  error: '#dc3545',
  success: '#28a745',
  inputBackground: '#f1f1f1',
  placeholder: '#888',
};

export const darkColors = {
  primary: '#007bff',
  secondary: '#adb5bd',
  background: '#121212',
  card: '#1e1e1e',
  text: '#e0e0e0',
  border: '#2c2c2c',
  error: '#cf6679',
  success: '#66bb6a',
  inputBackground: '#2c2c2c',
  placeholder: '#777',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    title: 28,
  },
  fontFamily: {
    regular: 'System',
    bold: 'System',
  },
};

export const getTheme = (isDarkMode: boolean) => {
    const base = {
      dark: isDarkMode,
      colors: isDarkMode ? darkColors : lightColors,
      spacing,
      typography,
      navigationTheme: isDarkMode
        ? {
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              primary: darkColors.primary,
              background: darkColors.background,
              card: darkColors.card,
              text: darkColors.text,
              border: darkColors.border,
            },
          }
        : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: lightColors.primary,
              background: lightColors.background,
              card: lightColors.card,
              text: lightColors.text,
              border: lightColors.border,
            },
          }
    }
    return base
};

export const useAppTheme = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    console.warn('useAppTheme used outside of AppProvider, returning default light theme');
    const defaultTheme = getTheme(false);
    return defaultTheme;
  }
  const { theme: currentThemeMode, isThemeLoading } = appContext;

  if (isThemeLoading) {
    const loadingTheme = getTheme(false);
    return loadingTheme;
  }

  const finalTheme = getTheme(currentThemeMode === 'dark');
  return finalTheme;
};