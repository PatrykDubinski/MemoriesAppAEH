import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StorageService from '@/services/StorageService'; // Użyj aliasu
import { Note } from '@/services/StorageService';

// Mock uuid, jeśli jeszcze nie jest globalnie w jest.setup.ts
// (jest.setup.ts już to robi, więc to jest redundantne, ale dla jasności)
// jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

describe('StorageService - Notes', () => {
  beforeEach(async () => {
    // Wyczyść AsyncStorage przed każdym testem
    await AsyncStorage.clear();
  });

  const mockNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
    title: 'Test Note',
    content: 'This is a test note.',
  };

  it('should save a new note and retrieve it', async () => {
    const savedNote = await StorageService.saveNote(mockNoteData);
    expect(savedNote.id).toBeDefined();
    expect(savedNote.title).toBe(mockNoteData.title);
    expect(savedNote.createdAt).toBeDefined();
    expect(savedNote.updatedAt).toBe(savedNote.createdAt); // Przy tworzeniu powinny być takie same

    const notes = await StorageService.getNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].id).toBe(savedNote.id);
  });

  it('should retrieve an empty array if no notes are saved', async () => {
    const notes = await StorageService.getNotes();
    expect(notes).toEqual([]);
  });

  it('should update an existing note', async () => {
    const initialNote = await StorageService.saveNote(mockNoteData);
    const updatedData = {
      id: initialNote.id,
      title: 'Updated Test Note',
      content: 'Updated content.',
    };
    const updatedNote = await StorageService.saveNote(updatedData);

    expect(updatedNote.id).toBe(initialNote.id);
    expect(updatedNote.title).toBe(updatedData.title);
    expect(updatedNote.content).toBe(updatedData.content);
    expect(updatedNote.updatedAt).not.toBe(initialNote.createdAt);

    const noteFromStorage = await StorageService.getNoteById(initialNote.id);
    expect(noteFromStorage?.title).toBe(updatedData.title);
  });

  it('should throw error if trying to update non-existent note', async () => {
    const nonExistentUpdate = {
      id: 'non-existent-id',
      title: 'Non Existent',
      content: 'Content'
    };
    await expect(StorageService.saveNote(nonExistentUpdate)).rejects.toThrow('Note not found for update.');
  });

  it('should delete a note', async () => {
    const note1 = await StorageService.saveNote({ title: 'Note 1', content: 'Content 1' });
    await StorageService.saveNote({ title: 'Note 2', content: 'Content 2' });

    let notes = await StorageService.getNotes();
    expect(notes).toHaveLength(2);

    await StorageService.deleteNoteById(note1.id);
    notes = await StorageService.getNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('Note 2');
  });

  it('should get notes sorted by updatedAt descending', async () => {
    // Save note1 (will be older)
    const note1 = await StorageService.saveNote({ title: 'Note 1', content: 'Content 1' });
    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 50));
    // Save note2 (will be newer)
    const note2 = await StorageService.saveNote({ title: 'Note 2', content: 'Content 2' });
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 50));
    // Update note1, making it the newest
    await StorageService.saveNote({ id: note1.id, title: 'Note 1 Updated', content: 'Content 1 Updated'});

    const notes = await StorageService.getNotes();
    expect(notes).toHaveLength(2);
    expect(notes[0].title).toBe('Note 1 Updated'); // note1 should be first
    expect(notes[1].title).toBe('Note 2');
  });

  it('getNoteById should return null if note not found', async () => {
    const note = await StorageService.getNoteById('non-existent-id');
    expect(note).toBeNull();
  });

    // Testy dla obsługi błędów AsyncStorage (np. gdy AsyncStorage.getItem rzuca błąd)
  it('getNotes should throw error if AsyncStorage fails', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage.getItem failed'));
    await expect(StorageService.getNotes()).rejects.toThrow('Could not load notes.');
  });

  it('saveNote should throw error if AsyncStorage fails on setItem', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage.setItem failed'));
    await expect(StorageService.saveNote(mockNoteData)).rejects.toThrow('Could not save the note.');
  });

  it('deleteNoteById should throw error if AsyncStorage fails on setItem', async () => {
    const note = await StorageService.saveNote(mockNoteData);
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('AsyncStorage.setItem failed'));
    await expect(StorageService.deleteNoteById(note.id)).rejects.toThrow('Could not delete the note.');
  });

});