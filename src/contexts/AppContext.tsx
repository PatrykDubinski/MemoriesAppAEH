import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme';

export type ThemeMode = 'light' | 'dark';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isThemeLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = (await AsyncStorage.getItem(
          THEME_STORAGE_KEY,
        )) as ThemeMode | null;

        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme from storage', e);
      } finally {
        setIsThemeLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme to storage', e);
    }
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isThemeLoading,
    }),
    [theme, isThemeLoading],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
