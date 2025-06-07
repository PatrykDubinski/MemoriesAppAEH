import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from '@/navigation/AppNavigator';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { AppProvider } from '@/contexts/AppContext';
import { NotesProvider } from '@/contexts/NotesContext';
import { useAppTheme } from '@/styles/theme';
import { Text, View } from 'react-native';

export default function App() {

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProvider>
          <NotesProvider>
            <ThemedApp />
          </NotesProvider>
        </AppProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const ThemedApp = () => {
    const currentTheme = useAppTheme();
  if (!currentTheme || typeof currentTheme.dark === 'undefined') {
      console.error("currentTheme object is problematic in ThemedApp:", currentTheme);
      return <View><Text>Ładowanie motywu...</Text></View>;
    }

    return (
      <>
        <StatusBar style={currentTheme.dark ? 'light' : 'dark'} />
        <AppNavigator />
      </>
    );
};