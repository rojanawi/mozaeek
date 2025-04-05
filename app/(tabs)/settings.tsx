import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Grid2x2 as Grid, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useGrid } from '@/context/GridContext';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface GridPreviewProps {
  width: number;
  height: number;
}

function WarningModal({ 
  visible, 
  onConfirm, 
  onCancel 
}: { 
  visible: boolean; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalIcon}>
            <AlertTriangle color="#FFB020" size={32} />
          </View>
          <Text style={styles.modalTitle}>Warning</Text>
          <Text style={styles.modalMessage}>
            Changing the grid size will delete all pictures currently placed on the grid. This action cannot be undone.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonCancel]} 
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonContinue]} 
              onPress={onConfirm}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextContinue]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function GridPreview({ width, height }: GridPreviewProps) {
  const cells = Array(width * height).fill(null);
  
  return (
    <View style={styles.previewContainer}>
      <View style={[styles.preview, { aspectRatio: width / height }]}>
        {cells.map((_, index) => (
          <View
            key={index}
            style={[
              styles.previewCell,
              {
                width: `${100 / width}%`,
                height: `${100 / height}%`,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function Slider({ 
  value, 
  onChange, 
  label 
}: { 
  value: number; 
  onChange: (value: number) => void;
  label: string;
}) {
  const translateX = useSharedValue(((value - 1) / 7) * (300 - 24));
  const isDragging = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      let newX = e.absoluteX - 40;
      newX = Math.max(0, Math.min(newX, 300 - 24));
      translateX.value = newX;
      
      const newValue = Math.round((newX / (300 - 24)) * 7) + 1;
      onChange(newValue);
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value) }],
    backgroundColor: withTiming(isDragging.value ? '#007AFF' : '#666'),
  }));

  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderContent}>
        <View style={styles.sliderTrack} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.sliderThumb, thumbStyle]}>
            <Text style={styles.sliderValue}>{value}</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles.sliderMarkers}>
        <Text style={styles.markerText}>1</Text>
        <Text style={styles.markerText}>8</Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { dimensions, setDimensions: updateDimensions, hasPhotos } = useGrid();
  const [localDimensions, setLocalDimensions] = useState({
    width: dimensions.width,
    height: dimensions.height,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const [showWarning, setShowWarning] = useState(false);

  const handleSave = () => {
    if (hasPhotos && (localDimensions.width !== dimensions.width || localDimensions.height !== dimensions.height)) {
      setShowWarning(true);
    } else {
      applyChanges();
    }
  };

  const applyChanges = () => {
    updateDimensions({
      width: localDimensions.width,
      height: localDimensions.height,
    });
    
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Settings size={24} color="#fff" />
          <Text style={styles.title}>Grid Settings</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Grid size={20} color="#fff" style={styles.sectionIcon} />
              Grid Dimensions
            </Text>
            <Text style={styles.description}>
              Adjust the sliders to set your mosaic grid dimensions.
            </Text>
          </View>

          <View style={styles.slidersContainer}>
            <Slider
              value={localDimensions.width}
              onChange={(value) => {
                setLocalDimensions(prev => ({ ...prev, width: value }));
                setSaveStatus('idle');
              }}
              label="Width"
            />
            <Slider
              value={localDimensions.height}
              onChange={(value) => {
                setLocalDimensions(prev => ({ ...prev, height: value }));
                setSaveStatus('idle');
              }}
              label="Height"
            />
          </View>

          {saveStatus === 'success' && (
            <Text style={styles.successText}>Settings saved successfully!</Text>
          )}

          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <GridPreview
              width={localDimensions.width}
              height={localDimensions.height}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              saveStatus === 'success' && styles.saveButtonSuccess
            ]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <WarningModal
        visible={showWarning}
        onConfirm={() => {
          setShowWarning(false);
          applyChanges();
        }}
        onCancel={() => {
          setShowWarning(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  description: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
  slidersContainer: {
    marginBottom: 24,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
  },
  sliderContent: {
    height: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sliderMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  markerText: {
    color: '#666',
    fontSize: 12,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  previewContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewCell: {
    backgroundColor: '#666',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#333',
  },
  modalButtonContinue: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFB020',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalButtonTextContinue: {
    color: '#FFB020',
  },
});