import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BookSavedIcon from '../assets/icons/book-saved.svg';
import SearchIcon from '../assets/icons/search-normal.svg';
import TinyManIcon from '../assets/icons/tiny_main_logo.svg';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const allBooks = [
    { name: 'Unlocking the Primal Brain', source: require('../assets/icons/unlocking the primal brain.png'), category: 'Best selling' },
    { name: 'No More Confusion', source: require('../assets/icons/No more confusion.png'), category: 'Best selling' },
    { name: 'The Power Within', source: require('../assets/icons/The Power Within.png'), category: 'Best selling' },
    { name: 'The Confidence Map', source: require('../assets/icons/The Confidence Map.png'), category: 'Best selling' },
    { name: 'The Secret Behind Romantic Love', source: require('../assets/icons/The Secret Behind Romantic Love.png'), category: 'Recommended for you' },
    { name: 'Master Your Finances', source: require('../assets/icons/Master your finances.png'), category: 'Recommended for you' },
    { name: 'Breaking Free From Mastubation', source: require('../assets/icons/Breaking Free From Mastubation.png'), category: 'Recommended for you' },
    { name: 'The Woman', source: require('../assets/icons/The Woman.png'), category: 'Recommended for you' },
    { name: 'Resonance', source: require('../assets/icons/Resonance.png'), category: 'Recommended for you' },
  ];

  const filteredBooks = searchQuery
    ? allBooks.filter(book => 
        book.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allBooks;

  const bestSellingBooks = filteredBooks.filter(book => book.category === 'Best selling');
  const recommendedBooks = filteredBooks.filter(book => book.category === 'Recommended for you');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>Great Awareness</Text>
          <TinyManIcon width={30} height={30} />
        </View>
        <Text style={styles.digit}>100</Text>
      </View>
      
      <View style={styles.booksSection}>
        <Text style={styles.booksTitle}>Books</Text>
        <BookSavedIcon width={30} height={30} />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="search"
            placeholderTextColor="#000000"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Best selling</Text>
            <Text style={styles.scrollIndicator}>➜</Text>
          </View>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            <View style={styles.iconsContainer}>
              {bestSellingBooks.length > 0 ? (
                bestSellingBooks.map((book, index) => (
                  <TouchableOpacity 
                    key={`${book.name}-${index}`} 
                    onPress={() => {
                      if (book.name === 'Unlocking the Primal Brain') {
                        router.push('/unlocking-primal-brain');
                      } else if (book.name === 'No More Confusion') {
                        router.push('/no-more-confusion');
                      } else if (book.name === 'The Power Within') {
                        router.push('/the-power-within');
                      
                      } else if (book.name === 'The Confidence Map') {
                        router.push('/the-confidence-map');
                      } else {
                        console.log(`Clicked: ${book.name}`);
                      }
                    }}
                  >
                    <Image
                      source={book.source}
                      style={styles.iconImage}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No books found</Text>
              )}
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Recommended for you</Text>
            <Text style={styles.scrollIndicator}>➜</Text>
          </View>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            <View style={styles.iconsContainer}>
              {recommendedBooks.length > 0 ? (
                recommendedBooks.map((book, index) => (
                  <TouchableOpacity 
                    key={`${book.name}-${index}`} 
                    onPress={() => {
                      if (book.name === 'Unlocking the Primal Brain') {
                        router.push('/unlocking-primal-brain');
                      } else if (book.name === 'The Woman') {
                        router.push('/the-woman' as any);
                      } else if (book.name === 'Resonance') {
                        router.push('/resonance' as any);
                      } else {
                        console.log(`Clicked: ${book.name}`);
                      }
                    }}
                  >
                    <Image
                      source={book.source}
                      style={styles.iconImage}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No books found</Text>
              )}
            </View>
          </ScrollView>
        </View>
        
        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>All books</Text>
            <Text style={styles.scrollIndicator}>➜</Text>
          </View>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            <View style={styles.iconsContainer}>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <TouchableOpacity key={`${book.name}-${index}`} onPress={() => console.log(`Clicked: ${book.name}`)}>
                    <Image
                      source={book.source}
                      style={styles.iconImage}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No books found</Text>
              )}
            </View>
          </ScrollView>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3E4DE',
    width: '100%',
    maxWidth: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginTop: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: undefined,
    marginRight: 8,
  },
  digit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
  },
  booksSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 20,
  },
  booksTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
  searchContainer: {
    paddingHorizontal: 12,
    marginTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(228, 47, 69, 0.26)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  searchText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#000000',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '300',
    color: '#000000',
    padding: 0,
    marginLeft: 6,
  },
  noResultsText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 20,
    marginLeft: 12,
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollIndicator: {
    fontSize: 18,
    color: '#666666',
    opacity: 0.8,
    marginRight: 8,
  },
  scrollContainer: {
    height: 190,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 6,
    flexWrap: 'nowrap',
    gap: 0,
  },
  iconImage: {
    width: 140,
    height: 180,
    resizeMode: 'contain',
    marginRight: -10,
    borderRadius: 8,
  },

});