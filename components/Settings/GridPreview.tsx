import { View, StyleSheet } from 'react-native';

interface GridPreviewProps {
  width: number;
  height: number;
}

export function GridPreview({ width, height }: GridPreviewProps) {
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

const styles = StyleSheet.create({
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
});