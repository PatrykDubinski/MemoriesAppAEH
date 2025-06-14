import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/styles/theme';
import { AppContext } from '@/contexts/AppContext'
import { MainTabScreenProps } from '@/navigation/types';
import * as PlaceholderService from '@/api/placeholderApiService';
import Button from '@/components/common/Button';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'

interface SampleTodo {
  title: string;
  completed: boolean;
}

export default function SettingsScreen({ navigation }: MainTabScreenProps<'Settings'>) {
  const [sampleTodo, setSampleTodo] = useState<SampleTodo | null>(null);
    const [isLoadingTodo, setIsLoadingTodo] = useState(false);
    const [todoError, setTodoError] = useState<string | null>(null);
    const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        setNetworkState(state);
      });
      return () => {
        unsubscribe();
      };
    }, []);

   const handleFetchTodo = async () => {
       setIsLoadingTodo(true);
       setTodoError(null);
       setSampleTodo(null);
       try {
         const todoData = await PlaceholderService.fetchSampleTodo();
         setSampleTodo({ title: todoData.title, completed: todoData.completed });
       } catch (error: any) {
         setTodoError(error.message || 'Unable to fetch data.');
       } finally {
         setIsLoadingTodo(false);
       }
     };

  const themeHook = useAppTheme();
  const appContext = React.useContext(AppContext);

  if (!appContext) {
    return <Text>Error during loading app context.</Text>;
  }

  const { theme: currentThemeMode, toggleTheme, isThemeLoading } = appContext;

  return (
    <View style={[styles.container, { backgroundColor: themeHook.colors.background }]}>
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: themeHook.colors.text }]}>
          Dark mode
        </Text>
        <Switch
          trackColor={{ false: themeHook.colors.secondary, true: themeHook.colors.primary }}
          thumbColor={currentThemeMode === 'dark' ? themeHook.colors.primary : themeHook.colors.card}
          ios_backgroundColor={themeHook.colors.secondary}
          onValueChange={toggleTheme}
          value={currentThemeMode === 'dark'}
          disabled={isThemeLoading}
        />
      </View>
      <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeHook.colors.text }]}>Connection status</Text>
              {networkState ? (
                <>
                  <Text style={{ color: themeHook.colors.text }}>Connection type: {networkState.type}</Text>
                  <Text style={{ color: themeHook.colors.text }}>Connected: {networkState.isConnected ? 'Yes' : 'No'}</Text>
                  {networkState.isInternetReachable === null ? null : (
                      <Text style={{ color: themeHook.colors.text }}>Access to the Internet: {networkState.isInternetReachable ? 'Yes' : 'No'}</Text>
                  )}
                </>
              ) : (
                <Text style={{ color: themeHook.colors.text }}>Checking your connection status...</Text>
              )}
            </View>


            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: themeHook.colors.text }]}>Sample API request</Text>
              <Button
                title={isLoadingTodo ? "Fetching..." : "Fetch sample data"}
                onPress={handleFetchTodo}
                loading={isLoadingTodo}
                disabled={isLoadingTodo || !networkState?.isInternetReachable}
              />
              {isLoadingTodo && <ActivityIndicator style={{marginTop: 10}} color={themeHook.colors.primary}/>}
              {todoError && <Text style={[styles.errorText, { color: themeHook.colors.error }]}>{todoError}</Text>}
              {sampleTodo && (
                <View style={styles.todoContainer}>
                  <Text style={{ color: themeHook.colors.text, fontWeight: 'bold' }}>Fetched TODO:</Text>
                  <Text style={{ color: themeHook.colors.text }}>Title: {sampleTodo.title}</Text>
                  <Text style={{ color: themeHook.colors.text }}>Finished: {sampleTodo.completed ? 'Yes' : 'No'}</Text>
                </View>
              )}
            </View>
      <Text style={[styles.infoText, {color: themeHook.colors.secondary}]}>
        App version: 1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 18,
  },
  infoText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
  },
  section: {
      marginVertical: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#2c2c2c'
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    errorText: {
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
    },
    todoContainer: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f4f4f4',
      borderRadius: 5,
    }
});