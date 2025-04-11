import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { Camera, RefreshCw } from 'lucide-react-native';

interface CameraControlsProps {
  onCapture: () => void;
  onFlip: () => void;
  disabled: boolean;
}

export function CameraControls({ onCapture, onFlip, disabled }: CameraControlsProps) {
  return (
    <View style={styles.bottomControls}>
      <TouchableOpacity 
        style={[styles.flipButton, disabled && styles.buttonDisabled]}
        onPress={onFlip}
        disabled={disabled}
      >
        <RefreshCw color="white" size={24} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.captureButton, disabled && styles.buttonDisabled]}
        onPress={onCapture}
        disabled={disabled}
      >
        <Camera color="white" size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
});