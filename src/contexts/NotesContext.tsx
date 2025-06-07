import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import * as StorageService from '@/services/StorageService';
import { Note, NoteLocation } from '@/services/StorageService';
import { deleteImageFromAppDirectory } from '@/services/ImageService';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
  addNote: (
    noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'location'> & { location?: NoteLocation }
  ) => Promise<Note | undefined>;
  updateNote: (
    noteData: Omit<Note, 'createdAt' | 'updatedAt' | 'location'> & { id: string; location?: NoteLocation }
  ) => Promise<Note | undefined>;
  removeNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedNotes = await StorageService.getNotes();
      setNotes(loadedNotes);
    } catch (e: any) {
      setError(e.message || 'Failed to load notes.');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const addNote = async (
    noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'location'> & { location?: NoteLocation }
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const newNote = await StorageService.saveNote(noteData);
      setNotes(prevNotes =>
        [newNote, ...prevNotes].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      );
      return newNote;
    } catch (e: any) {
      setError(e.message || 'Failed to add note.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateNote = async (
    noteData: Omit<Note, 'createdAt' | 'updatedAt' | 'location'> & { id: string; location?: NoteLocation }
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const updatedNote = await StorageService.saveNote(noteData);
      setNotes(prevNotes =>
        prevNotes
          .map(n => (n.id === updatedNote.id ? updatedNote : n))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      );
      return updatedNote;
    } catch (e: any) {
      setError(e.message || 'Failed to update note.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeNote = async (id: string) => {
    setError(null);
    setIsLoading(true);
    try {
        const noteToRemove = notes.find(n => n.id === id);
        await StorageService.deleteNoteById(id);
        if (noteToRemove?.imageUri) {
          await deleteImageFromAppDirectory(noteToRemove.imageUri);
        }
        setNotes(prevNotes => prevNotes.filter(n => n.id !== id));
      } catch (e: any) {
      setError(e.message || 'Failed to delete note.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        error,
        refreshNotes,
        addNote,
        updateNote,
        removeNote,
        getNoteById,
      }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};