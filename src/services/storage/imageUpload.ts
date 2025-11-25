import {supabase} from '../supabase/client';
import {launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';

export interface ImagePickerOptions {
  mediaType?: 'photo' | 'video' | 'mixed';
  allowsMultiple?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const imageUploadService = {
  async pickImage(
    options: ImagePickerOptions = {},
  ): Promise<ImagePickerResponse> {
    return new Promise((resolve, reject) => {
      launchImageLibrary(
        {
          mediaType: options.mediaType || 'photo',
          quality: options.quality || 0.8,
          maxWidth: options.maxWidth || 1024,
          maxHeight: options.maxHeight || 1024,
          selectionLimit: options.allowsMultiple ? 5 : 1,
        },
        response => {
          if (response.didCancel) {
            reject(new Error('User cancelled image picker'));
          } else if (response.errorMessage) {
            reject(new Error(response.errorMessage));
          } else {
            resolve(response);
          }
        },
      );
    });
  },

  async uploadImage(
    uri: string,
    path: string,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const {data, error} = await supabase.storage
        .from('images')
        .upload(path, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: {publicUrl},
      } = supabase.storage.from('images').getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  },

  async uploadMultipleImages(
    uris: string[],
    basePath: string,
    onProgress?: (progress: number) => void,
  ): Promise<string[]> {
    const uploadPromises = uris.map((uri, index) =>
      this.uploadImage(uri, `${basePath}/${Date.now()}-${index}.jpg`),
    );

    return Promise.all(uploadPromises);
  },
};

