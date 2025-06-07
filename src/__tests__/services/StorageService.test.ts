import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StorageService from '@/services/StorageService';
import { Note } from '@/services/StorageService';

describe('StorageService - Notes', () => {
  beforeEach(async () => {
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
    expect(savedNote.updatedAt).toBe(savedNote.createdAt);

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

    const noteFromStorage = await StorageService.getNoteById(initialNote.id);
    expect(noteFromStorage?.title).toBe(updatedData.title);
  });

  it('should throw error if trying to update non-existent note', async () => {
    const nonExistentUpdate = {
      id: 'non-existent-id',
      title: 'Non Existent',
      content: 'Content'
    };
    await expect(StorageService.saveNote(nonExistentUpdate)).rejects.toThrow('Could not save the note.');
  });

  it('should delete a note', async () => {
    const note1 = await StorageService.saveNote({ title: 'Note 1', content: 'Content 1' });
    await StorageService.saveNote({ title: 'Note 2', content: 'Content 2' });

    let notes = await StorageService.getNotes();
    expect(notes).toHaveLength(2);

    await StorageService.deleteNoteById(note1.id);
    notes = await StorageService.getNotes();
    expect(notes).toHaveLength(0);
  });

  it('should get notes sorted by updatedAt descending', async () => {
    const note1 = await StorageService.saveNote({ title: 'Note 1', content: 'Content 1' });
    await new Promise(resolve => setTimeout(resolve, 50));
    const note2 = await StorageService.saveNote({ title: 'Note 2', content: 'Content 2' });
    await new Promise(resolve => setTimeout(resolve, 50));
    await StorageService.saveNote({ id: note1.id, title: 'Note 1 Updated', content: 'Content 1 Updated'});

    const notes = await StorageService.getNotes();
    expect(notes).toHaveLength(2);
    expect(notes[0].title).toBe('Note 1 Updated');
    expect(notes[1].title).toBe('Note 1');
  });

  it('getNoteById should return null if note not found', async () => {
    const note = await StorageService.getNoteById('non-existent-id');
    expect(note).toBeNull();
  });

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