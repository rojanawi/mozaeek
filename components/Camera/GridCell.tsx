import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface GridCellProps {
  index: number;
  size: number;
  photoUri?: string;
  isCurrent: boolean;
  isRetakeMode: boolean;
  onPress: () => void;
}

export function GridCell({ 
  index, 
  size, 
  photoUri, 
  isCurrent, 
  isRetakeMode, 
  onPress 
}: GridCellProps) {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { width: size, height: size },
        isCurrent && styles.currentCell,
        !photoUri && styles.selectableCell
      ]}
      onPress={onPress}
    >
      {photoUri ? (
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photoUri }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          {isCurrent && isRetakeMode && (
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
          ]}>{index + 1}</Text>
          {isCurrent && (
            <Text style={styles.tapHint}>Ready to capture</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    margin: 0,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(34, 34, 34, 0.7)',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  currentPlaceholder: {
    backgroundColor: 'rgba(51, 51, 51, 0.7)',
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
    opacity: 0.3,
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
});