import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Upload, X } from 'lucide-react-native';
import { useGrid } from '@/context/GridContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export function ImageUploader() {
  const { setSelectedBackground } = useGrid();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: any) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG or PNG)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 10MB');
      return;
    }

    try {
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Create a custom background option
      setSelectedBackground({
        id: 'custom',
        title: 'Custom Background',
        url: objectUrl,
        category: 'none'
      });
    } catch (err) {
      setError('Failed to load image. Please try again.');
      console.error('Image upload error:', err);
    }
  };

  const clearUpload = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    setSelectedBackground({
      id: 'none',
      title: 'No Background',
      url: '',
      category: 'none'
    });
  };

  if (Platform.OS !== 'web') {
    return null; // Only show on web platform
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Background</Text>
      <Text style={styles.description}>
        Upload your own image to use as a background template
      </Text>

      {preview ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: preview }}
            style={styles.preview}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearUpload}
          >
            <X color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => document.getElementById('background-upload')?.click()}
        >
          <Upload color="#fff" size={24} />
          <Text style={styles.uploadText}>Upload Image</Text>
          <Text style={styles.uploadHint}>(JPG, PNG, max 10MB)</Text>
          <input
            id="background-upload"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </TouchableOpacity>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0, // Remove top padding since we're using divider
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});