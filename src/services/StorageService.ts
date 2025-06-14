import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const NOTES_KEY = '@app_notes';

export interface NoteLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  location?: NoteLocation;
  imageUri?: string;
}

export const getNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    const notes: Note[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    // Właściwie sortowanie jest niepotrzebne. W idealnym przypadku dane powinny być posortowane z backendu.
    return notes.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } catch (e) {
    console.error('Error loading notes from storage', e);
    throw new Error('Could not load notes.');
  }
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const notes = await getNotes();
    return notes.find(note => note.id === id) || null;
  } catch (e) {
    console.error(`Error loading note with id ${id}`, e);
    throw new Error('Could not load the note.');
  }
};

export const saveNote = async (
  noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; location?: NoteLocation },
): Promise<Note> => {
  try {
    const notes = await getNotes();
    const now = new Date().toISOString();
    let newOrUpdatedNote: Note;

    if (noteData.id) {
      console.log(notes)
      const noteIndex = notes.findIndex(n => n.id === noteData.id);
      if (noteIndex === -1) {
        throw new Error('Note not found for update.');
      }
      newOrUpdatedNote = {
        ...notes[noteIndex],
        title: noteData.title,
        content: noteData.content,
        location: noteData.location,
        imageUri: noteData.imageUri,
        updatedAt: now,
      };
      notes[noteIndex] = newOrUpdatedNote;
    } else {
      newOrUpdatedNote = {
        id: uuidv4(),
        title: noteData.title,
        content: noteData.content,
        location: noteData.location,
        imageUri: noteData.imageUri,
        createdAt: now,
        updatedAt: now,
      };
      notes.push(newOrUpdatedNote);
    }

    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return newOrUpdatedNote;
  } catch (e) {
    console.error('Error saving note to storage', e);
    throw new Error('Could not save the note.');
  }
};

export const deleteNoteById = async (id: string): Promise<void> => {
  try {
    let notes = await getNotes();
    notes = notes.filter(note => note.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error(`Error deleting note with id ${id}`, e);
    throw new Error('Could not delete the note.');
  }
};