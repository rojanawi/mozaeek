import { createContext, useContext, useState, ReactNode } from 'react';

interface GridDimensions {
  width: number;
  height: number;
}

interface GridContextType {
  dimensions: GridDimensions;
  setDimensions: (dimensions: GridDimensions) => void;
  hasPhotos: boolean;
  setHasPhotos: (hasPhotos: boolean) => void;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export function GridProvider({ children }: { children: ReactNode }) {
  const [dimensions, setDimensions] = useState<GridDimensions>({
    width: 4,
    height: 4,
  });
  const [hasPhotos, setHasPhotos] = useState(false);

  return (
    <GridContext.Provider value={{ dimensions, setDimensions, hasPhotos, setHasPhotos }}>
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