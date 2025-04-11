import { StyleSheet, View, Image } from 'react-native';
import { GridCell } from './GridCell';
import { CameraPreview } from './CameraPreview';
import { CameraType } from 'expo-camera';
import { useGrid } from '@/context/GridContext';

interface PhotoGridProps {
  photos: string[];
  currentIndex: number;
  retakeMode: boolean;
  dimensions: { width: number; height: number };
  gridLayout: { width: number; height: number };
  onCellPress: (index: number) => void;
  showCamera?: boolean;
  cameraRef?: (ref: any) => void;
  cameraType?: CameraType;
  onCameraPress?: () => void;
}

export function PhotoGrid({
  photos,
  currentIndex,
  retakeMode,
  dimensions,
  gridLayout,
  onCellPress,
  showCamera,
  cameraRef,
  cameraType,
  onCameraPress,
}: PhotoGridProps) {
  const { selectedBackground } = useGrid();

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
      left: col * cellSize,
      top: row * cellSize,
    };
  };

  const cellSize = getCellSize();
  const gridWidth = cellSize * dimensions.width;
  const gridHeight = cellSize * dimensions.height;

  return (
    <View style={[styles.container, { width: gridWidth, height: gridHeight }]}>
      {selectedBackground.url ? (
        <View style={[styles.templateContainer, { width: gridWidth, height: gridHeight }]}>
          <Image
            source={{ uri: selectedBackground.url }}
            style={styles.templateImage}
            resizeMode="cover"
          />
        </View>
      ) : null}
      <View style={[styles.grid, { width: gridWidth, height: gridHeight }]}>
        {photos.map((photoUri, index) => (
          <GridCell
            key={index}
            index={index}
            size={cellSize}
            photoUri={photoUri || undefined}
            isCurrent={index === currentIndex}
            isRetakeMode={retakeMode}
            onPress={() => onCellPress(index)}
          />
        ))}
        
        {showCamera && gridLayout.width > 0 && cameraRef && cameraType && onCameraPress && (
          <CameraPreview
            cameraRef={cameraRef}
            cameraType={cameraType}
            position={getCameraPosition()}
            onPress={onCameraPress}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  templateContainer: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
  },
  templateImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
  },
});