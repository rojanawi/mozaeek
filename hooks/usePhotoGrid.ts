import { useState, useCallback, useEffect } from 'react';
import { useGrid } from '@/context/GridContext';

export function usePhotoGrid() {
  const { dimensions, setHasPhotos } = useGrid();
  const TOTAL_CELLS = dimensions.width * dimensions.height;

  const [photos, setPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [retakeMode, setRetakeMode] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [gridLayout, setGridLayout] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setPhotos(Array(TOTAL_CELLS).fill(''));
    setCurrentIndex(0);
    setRetakeMode(false);
    setHasPhotos(false);
  }, [dimensions, TOTAL_CELLS, setHasPhotos]);

  useEffect(() => {
    const hasAnyPhotos = photos.some(photo => photo !== '');
    setHasPhotos(hasAnyPhotos);
  }, [photos, setHasPhotos]);

  const handleGridLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setGridLayout({ width, height });
  }, []);

  const findNextEmptyCell = useCallback((startIndex: number) => {
    const nextIndex = photos.findIndex((photo, index) => index > startIndex && photo === '');
    return nextIndex !== -1 ? nextIndex : photos.findIndex(photo => photo === '');
  }, [photos]);

  const handleCellPress = (index: number) => {
    setCurrentIndex(index);
    setRetakeMode(photos[index] !== '');
    setIsPreviewVisible(true);
  };

  const handlePhotoCapture = (photoUri: string) => {
    const newPhotos = [...photos];
    newPhotos[currentIndex] = photoUri;
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
  };

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
    if (isPreviewVisible) {
      setCurrentIndex(-1);
      setRetakeMode(false);
    }
  };

  const getCameraPosition = () => {
    const cellSize = (gridLayout.width - (dimensions.width + 1) * 4) / dimensions.width;
    const row = Math.floor(currentIndex / dimensions.width);
    const col = currentIndex % dimensions.width;
    
    return {
      width: cellSize,
      height: cellSize,
      left: col * cellSize,
      top: row * cellSize,
    };
  };

  return {
    photos,
    currentIndex,
    retakeMode,
    isPreviewVisible,
    gridLayout,
    handleGridLayout,
    handleCellPress,
    handlePhotoCapture,
    togglePreview,
    getCameraPosition,
  };
}