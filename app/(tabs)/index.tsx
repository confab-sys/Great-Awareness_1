import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const COLORS = ['#1C2922', '#E42F45', '#D3E4DE', '#893245'];
  const [colorIndex, setColorIndex] = useState(0);
  const router = useRouter();

  const handleColorChange = useCallback(() => {
    setColorIndex((prevIndex) => (prevIndex + 1) % COLORS.length);
  }, []);

  const handleNavigation = useCallback(() => {
    try {
      router.push('/hello_conscious_one');
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  }, [router]);

  useEffect(() => {
    const intervalId = setInterval(handleColorChange, 1000);
    return () => clearInterval(intervalId);
  }, [handleColorChange]);

  useEffect(() => {
    const timeoutId = setTimeout(handleNavigation, 10000);
    return () => clearTimeout(timeoutId);
  }, [handleNavigation]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS[colorIndex] }]}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
