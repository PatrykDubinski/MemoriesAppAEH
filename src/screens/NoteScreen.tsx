import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { useNotes } from '@/contexts/NotesContext';
import { useAppTheme } from '@/styles/theme';
import { RootStackScreenProps } from '@/navigation/types';
import { NoteLocation } from '@/services/StorageService';
import * as LocationService from '@/services/LocationService';
import * as ImagePicker from 'expo-image-picker';
import * as ImageService from '@/services/ImageService';

export default function NoteScreen({ navigation, route }: RootStackScreenProps<'Note'>) {
  const theme = useAppTheme();
  const { addNote, updateNote, getNoteById, isLoading: isNotesContextLoading } = useNotes();
  const noteId = route.params?.noteId;
  const isEditing = !!noteId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState<NoteLocation | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    if (isEditing && noteId) {
      const noteToEdit = getNoteById(noteId);
      if (noteToEdit) {
        setTitle(noteToEdit.title);
        setContent(noteToEdit.content);
        setLocation(noteToEdit.location);
        setImageUri(noteToEdit.imageUri)
      } else {
        Alert.alert('Error', 'Note not found.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    }
  }, [noteId, isEditing, getNoteById, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit note' : 'New Note',
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={{ marginRight: 15 }} disabled={isSaving || isNotesContextLoading}>
          <Ionicons
            name={isSaving ? "hourglass-outline" : "save-outline"}
            size={28}
            color={isSaving || isNotesContextLoading ? theme.colors.secondary : theme.colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, isSaving, theme, title, content, location, isNotesContextLoading]);

  const handlePickImage = async (useCamera: boolean = false) => {
      setIsImageLoading(true);
      let permissionResult;
      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.granted === false) {
        Alert.alert("No permissions", `You need ${useCamera ? 'camera access' : 'gallery access'}, to add a photo.`);
        setIsImageLoading(false);
        return;
      }

      const pickerResult = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
          });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const tempUri = pickerResult.assets[0].uri;
        if (imageUri) {
          await ImageService.deleteImageFromAppDirectory(imageUri);
        }
        const permanentUri = await ImageService.saveImageToAppDirectory(tempUri);
        if (permanentUri) {
          setImageUri(permanentUri);
        } else {
          Alert.alert("Error", "Unable to add an image.");
        }
      }
      setIsImageLoading(false);
    };

 const handleRemoveImage = async () => {
    if (imageUri) {
      Alert.alert(
        "Remove image",
        "Are you sure you want to remove image from this note?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              await ImageService.deleteImageFromAppDirectory(imageUri);
              setImageUri(undefined);
            },
          },
        ]
      );
    }
  };

  const handleGetLocation = async () => {
    setIsFetchingLocation(true);
    setError(null);
    try {
      const currentLocation = await LocationService.getCurrentLocation();
      if (currentLocation) {
        setLocation(currentLocation);
        Alert.alert('Success', 'Location fetched successfully.');
      } else {
        Alert.alert('Info', 'Unable to fetch your location. Check permissions.');
      }
    } catch (err: any) {
      setError(err.message || 'Error during fetching your location.');
      Alert.alert('Error', err.message || 'Unable to fetch location.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Note Invalid', 'Title cannot be empty.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Note invalid', 'Content cannot be empty.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditing && noteId) {
        await updateNote({ id: noteId, title, content, location, imageUri });
      } else {
        await addNote({ title, content, location, imageUri });
      }
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Unable to save a note.');
      Alert.alert('Error', err.message || 'An error ocurred during your note creation.');
    } finally {
      setIsSaving(false);
    }
  }, [isEditing, noteId, title, content, location, imageUri, addNote, updateNote, navigation]);


  if (isNotesContextLoading && isEditing) {
      return <LoadingIndicator message="Fetching note data..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}

        <FormField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Title of your note..."
          returnKeyType="next"
          editable={!isSaving}
        />
        <FormField
          label="Content"
          value={content}
          onChangeText={setContent}
          placeholder="Content of your note..."
          multiline
          numberOfLines={10}
          style={styles.contentInput}
          textAlignVertical="top"
          editable={!isSaving}
        />

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Zdjęcie</Text>
          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <Button title="Remove image" onPress={handleRemoveImage} variant="danger" style={styles.removeImageButton} />
            </View>
          )}
          <View style={styles.imageButtonsContainer}>
            <Button
              title="Take a picture"
              onPress={() => handlePickImage(true)}
              loading={isImageLoading}
              disabled={isSaving}
              icon={<Ionicons name="camera-outline" size={20} color={theme.dark ? theme.colors.text : "#fff"} style={{marginRight: 5}}/>}
              style={styles.imageButton}
            />
            <Button
              title="Image from gallery"
              onPress={() => handlePickImage(false)}
              loading={isImageLoading}
              disabled={isSaving}
              icon={<Ionicons name="images-outline" size={20} color={theme.dark ? theme.colors.text : "#fff"} style={{marginRight: 5}}/>}
              style={styles.imageButton}
            />
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Button
            title={location ? "Update location" : "Add location"}
            onPress={handleGetLocation}
            loading={isFetchingLocation}
            disabled={isSaving}
            variant="secondary"
            icon={<Ionicons name="location-outline" size={20} color={theme.dark ? theme.colors.text : "#fff"} style={{marginRight: 5}}/>}
          />
          {location && (
            <Text style={[styles.locationText, { color: theme.colors.secondary }]}>
              Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
              {` (from: ${new Date(location.timestamp).toLocaleTimeString('pl-PL')})`}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contentInput: {
    minHeight: 150,
  },
  errorText: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  locationContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  locationText: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginVertical: 14,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    imagePreviewContainer: {
      alignItems: 'center',
      marginBottom: 12,
    },
    imagePreview: {
      width: 200,
      height: 150,
      resizeMode: 'cover',
      borderRadius: 8,
      marginBottom: 12,
    },
    removeImageButton: {
    },
    imageButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    imageButton: {
      flex: 1,
      marginHorizontal: 4,
    },
});