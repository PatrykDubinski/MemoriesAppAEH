import React, { JSX } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Note } from '@/services/StorageService';
import { useAppTheme } from '@/styles/theme';
import { formatDate } from '@/utils/formatters';
import { useNotes } from '@/contexts/NotesContext';
import { RootStackParamList } from '@/navigation/types';

type NoteItemNavigationProp = StackNavigationProp<RootStackParamList, 'Note'>;


interface NoteItemProps {
  note: Note;
}

const NoteItem = ({ note }: NoteItemProps): JSX.Element => {
  const theme = useAppTheme();
  const navigation = useNavigation<NoteItemNavigationProp>();
  const { removeNote } = useNotes();

  const handleEdit = () => {
    navigation.navigate('Note', { noteId: note.id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeNote(note.id);
            } catch (error) {
              Alert.alert('Error', 'Unable to remove note.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={handleEdit}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{note.title}</Text>
        <Text style={[styles.date, { color: theme.colors.secondary }]} numberOfLines={1}>
          {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
        </Text>
        {note.imageUri && (
          <Image source={{ uri: note.imageUri }} style={styles.thumbnail} />
        )}
        <Text style={[styles.date, { color: theme.colors.secondary }]}>
          Last change: {formatDate(new Date(note.updatedAt))}
        </Text>
        {note.location && (
          <Text style={[styles.location, { color: theme.colors.secondary }]}>
            <Ionicons name="location-outline" size={14} color={theme.colors.secondary} />
            {` Lat: ${note.location.latitude.toFixed(2)}, Lon: ${note.location.longitude.toFixed(2)}`}
          </Text>
        )}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
          <Ionicons name="pencil-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 4,
      marginRight: 10,
      resizeMode: 'cover',
    },
  container: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default NoteItem;