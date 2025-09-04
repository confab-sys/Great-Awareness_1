import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BooksCatalogIcon from '../assets/icons/books catalog.svg';
import NewsCatalogIcon from '../assets/icons/news  catalog.svg';
import VideoCatalogIcon from '../assets/icons/video catalog.svg';

export default function CatalogPage() {
  const router = useRouter();

  const navigateToBooks = () => {
    router.push('/books');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Great Awareness</Text>
      
      <View style={styles.iconsContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconWrapper} onPress={navigateToBooks}>
            <BooksCatalogIcon width={80} height={80} />
            <Text style={styles.iconLabel}></Text>
          </TouchableOpacity>
          
          <View style={styles.iconWrapper}>
            <NewsCatalogIcon width={80} height={80} />
            <Text style={styles.iconLabel}></Text>
          </View>
        </View>
        
        <View style={styles.iconRow}>
          <View style={styles.iconWrapper}>
            <VideoCatalogIcon width={80} height={80} />
            <Text style={styles.iconLabel}></Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E42F45',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 50,
  },
  iconsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  iconLabel: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
});