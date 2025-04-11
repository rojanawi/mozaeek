import { createContext, useContext, useState, ReactNode } from 'react';

interface GridDimensions {
  width: number;
  height: number;
}

export interface BackgroundOption {
  id: string;
  title: string;
  url: string;
  category: 'people' | 'animals' | 'objects' | 'buildings' | 'none';
}

interface GridContextType {
  dimensions: GridDimensions;
  setDimensions: (dimensions: GridDimensions) => void;
  hasPhotos: boolean;
  setHasPhotos: (hasPhotos: boolean) => void;
  selectedBackground: BackgroundOption;
  setSelectedBackground: (background: BackgroundOption) => void;
}

export const backgroundOptions: BackgroundOption[] = [
  { id: 'none', title: 'No Background', url: '', category: 'none' },
  { id: 'portrait1', title: 'Portrait 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop', category: 'people' },
  { id: 'portrait2', title: 'Portrait 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop', category: 'people' },
  { id: 'portrait3', title: 'Portrait 3', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1287&auto=format&fit=crop', category: 'people' },
  { id: 'cat1', title: 'Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1243&auto=format&fit=crop', category: 'animals' },
  { id: 'dog1', title: 'Dog', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1335&auto=format&fit=crop', category: 'animals' },
  { id: 'lion1', title: 'Lion', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1259&auto=format&fit=crop', category: 'animals' },
  { id: 'car1', title: 'Sports Car', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1270&auto=format&fit=crop', category: 'objects' },
  { id: 'bike1', title: 'Motorcycle', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1170&auto=format&fit=crop', category: 'objects' },
  { id: 'guitar1', title: 'Guitar', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=1170&auto=format&fit=crop', category: 'objects' },
  { id: 'building1', title: 'Modern Building', url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1287&auto=format&fit=crop', category: 'buildings' },
  { id: 'building2', title: 'Skyscraper', url: 'https://images.unsplash.com/photo-1478066792002-98827d59f591?q=80&w=1289&auto=format&fit=crop', category: 'buildings' },
  { id: 'building3', title: 'Classic Architecture', url: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1290&auto=format&fit=crop', category: 'buildings' },
  { id: 'pose1', title: 'Dance Pose', url: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?q=80&w=1287&auto=format&fit=crop', category: 'people' },
  { id: 'pose2', title: 'Yoga Pose', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1202&auto=format&fit=crop', category: 'people' },
  { id: 'horse1', title: 'Horse', url: 'https://images.unsplash.com/photo-1534073737927-85f1c416d3ba?q=80&w=1274&auto=format&fit=crop', category: 'animals' },
  { id: 'piano1', title: 'Piano', url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=1170&auto=format&fit=crop', category: 'objects' },
  { id: 'building4', title: 'Bridge', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1288&auto=format&fit=crop', category: 'buildings' },
  { id: 'eagle1', title: 'Eagle', url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?q=80&w=1335&auto=format&fit=crop', category: 'animals' },
  { id: 'car2', title: 'Classic Car', url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?q=80&w=1331&auto=format&fit=crop', category: 'objects' },
];

const GridContext = createContext<GridContextType | undefined>(undefined);

export function GridProvider({ children }: { children: ReactNode }) {
  const [dimensions, setDimensions] = useState<GridDimensions>({
    width: 4,
    height: 4,
  });
  const [hasPhotos, setHasPhotos] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>(backgroundOptions[0]);

  return (
    <GridContext.Provider value={{ 
      dimensions, 
      setDimensions, 
      hasPhotos, 
      setHasPhotos,
      selectedBackground,
      setSelectedBackground
    }}>
      {children}
    </GridContext.Provider>
  );
}

export function useGrid() {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
}