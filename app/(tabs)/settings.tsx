import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Grid2x2 as Grid } from 'lucide-react-native';
import { useGrid } from '@/context/GridContext';
import { GridPreview } from '@/components/Settings/GridPreview';
import { Slider } from '@/components/Settings/Slider';
import { WarningModal } from '@/components/Settings/WarningModal';
import { BackgroundSelector } from '@/components/Settings/BackgroundSelector';

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

        <View style={[styles.card, styles.backgroundCard]}>
          <BackgroundSelector />
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
    marginBottom: 20,
  },
  backgroundCard: {
    padding: 0,
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
});