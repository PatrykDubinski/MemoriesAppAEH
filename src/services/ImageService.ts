import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';

const imageDirectory = `${FileSystem.documentDirectory}images/`;

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imageDirectory);
  if (!dirInfo.exists) {
    console.log("Images directory doesn't exist, creating…");
    await FileSystem.makeDirectoryAsync(imageDirectory, { intermediates: true });
  }
};

/**
 * Kopiuje obrazek do trwałego katalogu aplikacji i zwraca jego nowe URI.
 * @param tempUri URI obrazka z image-pickera
 * @returns Nowe, trwałe URI obrazka lub null w przypadku błędu.
 */
export const saveImageToAppDirectory = async (tempUri: string): Promise<string | null> => {
  await ensureDirExists();
  const filename = `${uuidv4()}_${tempUri.split('/').pop()}`;
  const newUri = `${imageDirectory}${filename}`;
  try {
    await FileSystem.copyAsync({
      from: tempUri,
      to: newUri,
    });
    console.log('Image copied to:', newUri);
    return newUri;
  } catch (error) {
    console.error('Error copying image:', error);
    return null;
  }
};

/**
 * Usuwa obrazek z katalogu aplikacji.
 * @param fileUri URI obrazka do usunięcia.
 */
export const deleteImageFromAppDirectory = async (fileUri: string): Promise<void> => {
  try {
    if (fileUri.startsWith(FileSystem.documentDirectory || '')) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      console.log('Image deleted:', fileUri);
    } else {
      console.warn('Attempted to delete a file outside app document directory:', fileUri);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};