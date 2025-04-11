import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function Slider({ value, onChange, label }: SliderProps) {
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
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.content}>
        <View style={styles.track} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Text style={styles.value}>{value}</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles.markers}>
        <Text style={styles.markerText}>1</Text>
        <Text style={styles.markerText}>8</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
  },
  content: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  markers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  markerText: {
    color: '#666',
    fontSize: 12,
  },
});