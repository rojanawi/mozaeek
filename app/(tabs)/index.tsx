import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCamera } from '@/hooks/useCamera';
import { usePhotoGrid } from '@/hooks/usePhotoGrid';
import { useGrid } from '@/context/GridContext';
import { PhotoGrid } from '@/components/Camera/PhotoGrid';
import { CameraControls } from '@/components/Camera/CameraControls';

export default function CameraScreen() {
  const { dimensions } = useGrid();
  const {
    permission,
    requestPermission,
    cameraRef,
    cameraType,
    toggleCameraType,
    takePicture,
    error,
  } = useCamera();

  const {
    photos,
    currentIndex,
    retakeMode,
    isPreviewVisible,
    gridLayout,
    handleGridLayout,
    handleCellPress,
    handlePhotoCapture,
    togglePreview,
  } = usePhotoGrid();

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

  const handleTakePicture = async () => {
    const photo = await takePicture();
    if (photo) {
      handlePhotoCapture(photo.uri);
    }
  };

  const showCamera = (currentIndex >= 0) && isPreviewVisible;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridContainer} onLayout={handleGridLayout}>
        <PhotoGrid
          photos={photos}
          currentIndex={currentIndex}
          retakeMode={retakeMode}
          dimensions={dimensions}
          gridLayout={gridLayout}
          onCellPress={handleCellPress}
          showCamera={showCamera}
          cameraRef={cameraRef}
          cameraType={cameraType}
          onCameraPress={togglePreview}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <CameraControls
        onCapture={handleTakePicture}
        onFlip={toggleCameraType}
        disabled={!showCamera}
      />
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