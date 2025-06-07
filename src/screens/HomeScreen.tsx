import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useNotes } from '@/contexts/NotesContext';
import NoteItem from '@/components/notes/NoteItem';
import Button from '@/components/common/Button';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import ErrorDisplay from '@/components/common/ErrorDisplay';
import { useAppTheme } from '@/styles/theme';
import { MainTabScreenProps, RootStackParamList } from '@/navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const theme = useAppTheme();
  const { notes, isLoading, error, refreshNotes } = useNotes();
  const rootNavigation = useNavigation<HomeScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      refreshNotes();
    }, [refreshNotes])
  );

  const handleAddNote = () => {
    rootNavigation.navigate('Note', {});
  };

  if (isLoading && notes.length === 0) {
    return <LoadingIndicator message="Wczytywanie notatek..." />;
  }


  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
       {error && <ErrorDisplay message={error} onRetry={refreshNotes} />}
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        Nie masz jeszcze żadnych notatek.
      </Text>
      <Button title="Dodaj pierwszą notatkę" onPress={handleAddNote} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {error && notes.length > 0 && <ErrorDisplay message={error} onRetry={refreshNotes} /> }
      <FlatList
        data={notes}
        renderItem={({ item }) => <NoteItem note={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={notes.length === 0 ? styles.emptyFlatList : styles.listContent}
        ListEmptyComponent={!isLoading ? renderEmptyComponent : null}
        onRefresh={refreshNotes}
        refreshing={isLoading}
      />
      <Button
        title="Dodaj Notatkę"
        onPress={handleAddNote}
        icon={<Ionicons name="add-circle-outline" size={22} color="#fff" style={{marginRight: 5}}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyFlatList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});