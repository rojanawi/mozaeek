import { StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';

interface CameraPreviewProps {
  cameraRef: (ref: any) => void;
  cameraType: CameraType;
  position: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  onPress: () => void;
}

export function CameraPreview({ cameraRef, cameraType, position, onPress }: CameraPreviewProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[styles.cameraView, position]}
    >
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={cameraType}
        mirror={true}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cameraView: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 8,
  },
});