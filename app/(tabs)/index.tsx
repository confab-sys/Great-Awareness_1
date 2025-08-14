import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MainLogo from '../../assets/icons/Main_logo.svg';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const COLORS = ['#1C2922', '#E42F45', '#D3E4DE', '#893245'];
  const [colorIndex, setColorIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % COLORS.length);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push('/hello_conscious_one');
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS[colorIndex] }]}>
      <MainLogo width={200} height={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
