import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, RefreshCw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGrid } from '@/context/GridContext';

export default function CameraScreen() {
  const { dimensions, setHasPhotos } = useGrid();
  const TOTAL_CELLS = dimensions.width * dimensions.height;

  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retakeMode, setRetakeMode] = useState(false);
  const [gridLayout, setGridLayout] = useState({ width: 0, height: 0 });
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  // Reset photos array when dimensions change
  useEffect(() => {
    setPhotos(Array(TOTAL_CELLS).fill(''));
    setCurrentIndex(-1);
    setRetakeMode(false);
    setHasPhotos(false);
  }, [dimensions, TOTAL_CELLS, setHasPhotos]);

  useEffect(() => {
    requestPermission();
  }, []);

  // Update hasPhotos whenever photos array changes
  useEffect(() => {
    const hasAnyPhotos = photos.some(photo => photo !== '');
    setHasPhotos(hasAnyPhotos);
  }, [photos, setHasPhotos]);

  const handleCameraRef = useCallback((ref: any) => {
    if (ref) {
      setCameraRef(ref);
    }
  }, []);

  const handleGridLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setGridLayout({ width, height });
  }, []);

  const findNextEmptyCell = useCallback((startIndex: number) => {
    const nextIndex = photos.findIndex((photo, index) => index > startIndex && photo === '');
    return nextIndex !== -1 ? nextIndex : photos.findIndex(photo => photo === '');
  }, [photos]);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need camera permission to create your mosaic</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef) {
      setError('Camera not ready');
      return;
    }

    try {
      setError(null);
      const photo = await cameraRef.takePictureAsync({
        quality: 1,
        base64: false,
      });
      const newPhotos = [...photos];
      newPhotos[currentIndex] = photo.uri;
      setPhotos(newPhotos);
      
      const nextEmptyIndex = findNextEmptyCell(currentIndex);
      if (nextEmptyIndex !== -1) {
        setCurrentIndex(nextEmptyIndex);
        setRetakeMode(false);
      } else {
        setIsPreviewVisible(false);
        setCurrentIndex(-1);
        setRetakeMode(false);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      setError('Failed to take picture. Please try again.');
    }
  };

  const handleCellPress = (index: number) => {
    setCurrentIndex(index);
    setRetakeMode(photos[index] !== '');
    setError(null);
    setIsPreviewVisible(true);
  };

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
    if (isPreviewVisible) {
      setCurrentIndex(-1);
      setRetakeMode(false);
    }
  };

  const getCellSize = () => {
    if (!gridLayout.width || !gridLayout.height) return 0;
    return (gridLayout.width - (dimensions.width + 1) * 4) / dimensions.width;
  };

  const getCameraPosition = () => {
    const cellSize = getCellSize();
    const row = Math.floor(currentIndex / dimensions.width);
    const col = currentIndex % dimensions.width;
    
    return {
      width: cellSize,
      height: cellSize,
      left: col * (cellSize),
      top: row * (cellSize),
    };
  };

  const renderGrid = () => {
    const cells = [];
    const cellSize = getCellSize();

    for (let i = 0; i < TOTAL_CELLS; i++) {
      const isCurrent = i === currentIndex;
      const hasPhoto = photos[i] !== '';

      cells.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.cell,
            { width: cellSize, height: cellSize },
            isCurrent && styles.currentCell,
            !hasPhoto && styles.selectableCell
          ]}
          onPress={() => handleCellPress(i)}
        >
          {hasPhoto ? (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photos[i] }}
                style={styles.photoImage}
                resizeMode="cover"
              />
              {isCurrent && retakeMode && (
                <View style={styles.retakeOverlay}>
                  <RefreshCw color="white" size={24} />
                  <Text style={styles.retakeText}>Tap to retake</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={[
              styles.photoPlaceholder,
              isCurrent && styles.currentPlaceholder
            ]}>
              <Text style={[
                styles.photoNumber,
                isCurrent && styles.currentPhotoNumber
              ]}>{i + 1}</Text>
              {isCurrent && (
                <Text style={styles.tapHint}>Ready to capture</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return cells;
  };

  const showCamera = (currentIndex >= 0) && isPreviewVisible;
  const cameraPosition = getCameraPosition();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridContainer} onLayout={handleGridLayout}>
        <View style={styles.grid}>
          {renderGrid()}

          {showCamera && gridLayout.width > 0 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={togglePreview}
              style={[
                styles.cameraView,
                cameraPosition,
              ]}
            >
              <CameraView
                ref={handleCameraRef}
                style={StyleSheet.absoluteFill}
                type={"back"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      <TouchableOpacity 
        style={[
          styles.captureButton,
          !showCamera && styles.captureButtonDisabled
        ]}
        onPress={takePicture}
        disabled={!showCamera}
      >
        <Camera color="white" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gridContainer: {
    paddingTop: 20,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cell: {
    margin: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  currentCell: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectableCell: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  photoContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  currentPlaceholder: {
    backgroundColor: '#333',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  retakeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  photoNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentPhotoNumber: {
    color: '#fff',
    fontSize: 20,
  },
  tapHint: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  cameraView: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 8,
  },
  captureButton: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 40,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#666',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});