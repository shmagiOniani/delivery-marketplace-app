/**
 * PhotoUpload - Component for capturing and uploading photos
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import { supabase } from '@/lib/supabase/client';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

interface PhotoUploadProps {
  maxPhotos?: number;
  onPhotosChange: (urls: string[]) => void;
  photos?: string[];
  label?: string;
  errorMessage?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  maxPhotos = 5,
  onPhotosChange,
  photos = [],
  label = 'Photos',
  errorMessage,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImageToSupabase = async (asset: Asset): Promise<string> => {
    if (!asset.uri || !asset.fileName) {
      throw new Error('Invalid image asset');
    }

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName,
      } as any);

      // Generate unique filename
      const fileExt = asset.fileName.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `job-photos/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('jobs')
        .upload(filePath, formData, {
          contentType: asset.type || 'image/jpeg',
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('jobs')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleImagePicker = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      return;
    }

    if (response.assets && response.assets.length > 0) {
      uploadImages(response.assets);
    }
  };

  const uploadImages = async (assets: Asset[]) => {
    if (photos.length + assets.length > maxPhotos) {
      Alert.alert(
        'Too Many Photos',
        `You can only upload up to ${maxPhotos} photos`
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < assets.length; i++) {
        const url = await uploadImageToSupabase(assets[i]);
        uploadedUrls.push(url);
        setUploadProgress(((i + 1) / assets.length) * 100);
      }

      onPhotosChange([...photos, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        includeBase64: false,
      },
      handleImagePicker
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        selectionLimit: maxPhotos - photos.length,
        includeBase64: false,
      },
      handleImagePicker
    );
  };

  const removePhoto = (index: number) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const newPhotos = [...photos];
          newPhotos.splice(index, 1);
          onPhotosChange(newPhotos);
        },
      },
    ]);
  };

  const showPhotoOptions = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: openCamera },
      { text: 'Choose from Library', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.counter}>
          {photos.length} / {maxPhotos}
        </Text>
      </View>

      {/* Photo Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.photosScroll}
        contentContainerStyle={styles.photosContainer}
      >
        {photos.map((uri, index) => (
          <View key={index} style={styles.photoItem}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Photo Button */}
        {photos.length < maxPhotos && (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={showPhotoOptions}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator color={Colors.primary} />
                <Text style={styles.uploadingText}>
                  {Math.round(uploadProgress)}%
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.addPhotoIcon}>📷</Text>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Error Message */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Hint */}
      <Text style={styles.hint}>
        Add clear photos of the item to help drivers understand the job better
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
  },
  counter: {
    fontSize: 14,
    color: Colors.gray,
  },
  photosScroll: {
    marginBottom: Spacing.xs,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoItem: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  addPhotoText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  uploadingContainer: {
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  hint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: Spacing.xs,
  },
});

