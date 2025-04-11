import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';
import { useGrid } from '@/context/GridContext';
import { backgroundOptions } from '@/context/GridContext';
import { ImageUploader } from './ImageUploader';

export function BackgroundSelector() {
  const { selectedBackground, setSelectedBackground } = useGrid();
  const categories = ['none', 'people', 'animals', 'objects', 'buildings'] as const;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <ImageIcon size={20} color="#fff" style={styles.sectionIcon} />
        Background Template
      </Text>
      <Text style={styles.description}>
        Choose a background template to help align your photos.
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedBackground.category === category && styles.categoryTabActive
            ]}
            onPress={() => {
              const firstInCategory = backgroundOptions.find(bg => bg.category === category);
              if (firstInCategory) setSelectedBackground(firstInCategory);
            }}
          >
            <Text style={[
              styles.categoryText,
              selectedBackground.category === category && styles.categoryTextActive
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.backgroundScroll} 
        contentContainerStyle={styles.backgroundGrid}
        showsVerticalScrollIndicator={false}
      >
        {backgroundOptions
          .filter(bg => bg.category === selectedBackground.category)
          .map((background) => (
            <TouchableOpacity
              key={background.id}
              style={[
                styles.backgroundOption,
                selectedBackground.id === background.id && styles.backgroundOptionSelected
              ]}
              onPress={() => setSelectedBackground(background)}
            >
              {background.url ? (
                <Image
                  source={{ uri: background.url }}
                  style={styles.backgroundPreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noBackgroundPreview}>
                  <Text style={styles.noBackgroundText}>No Background</Text>
                </View>
              )}
              <Text style={styles.backgroundTitle} numberOfLines={1}>
                {background.title}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View style={styles.divider} />

      <ImageUploader />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
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
  categoryScroll: {
    marginTop: 16,
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  backgroundScroll: {
    maxHeight: 400,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 4,
    columnGap: '1%',
    paddingTop: 8,
    paddingBottom: 24, // Add padding at the bottom of the grid
  },
  backgroundOption: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  backgroundOptionSelected: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  backgroundPreview: {
    width: '100%',
    height: '80%',
  },
  noBackgroundPreview: {
    width: '100%',
    height: '80%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBackgroundText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  backgroundTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 24, // Add margin below the divider
  },
});