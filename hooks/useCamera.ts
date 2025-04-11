import { useState, useCallback } from 'react';
import { CameraType, useCameraPermissions } from 'expo-camera';

export function useCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [error, setError] = useState<string | null>(null);

  const handleCameraRef = useCallback((ref: any) => {
    if (ref) {
      setCameraRef(ref);
    }
  }, []);

  const toggleCameraType = () => {
    setCameraType(current => current === 'back' ? 'front' : 'back');
  };

  const takePicture = async () => {
    if (!cameraRef) {
      setError('Camera not ready');
      return null;
    }

    try {
      setError(null);
      const photo = await cameraRef.takePictureAsync({
        quality: 1,
        base64: false,
      });
      return photo;
    } catch (error) {
      console.error('Failed to take picture:', error);
      setError('Failed to take picture. Please try again.');
      return null;
    }
  };

  return {
    permission,
    requestPermission,
    cameraRef: handleCameraRef,
    cameraType,
    toggleCameraType,
    takePicture,
    error,
  };
}