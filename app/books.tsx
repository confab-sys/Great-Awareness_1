import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import BookSavedIcon from '../assets/icons/book-saved.svg';
import SearchIcon from '../assets/icons/search-normal.svg';
import TinyManIcon from '../assets/icons/tiny_main_logo.svg';
import supabaseService from '../services/supabaseService';

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookCovers, setBookCovers] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBookCovers = async () => {
      try {
        const covers = supabaseService.getAllBookCoverUrls();
        setBookCovers(covers);
        setLoading(false);
      } catch (error) {
        console.error('Error loading book covers:', error);
        setLoading(false);
      }
    };

    loadBookCovers();
  }, []);

  const allBooks = [
    { name: 'Unlocking the Primal Brain', imageName: 'Unlocking the Primal Brain.png', category: 'Best selling' },
    { name: 'No More Confusion', imageName: 'No More Confusion.png', category: 'Best selling' },
    { name: 'The Power Within', imageName: 'The Power Within.png', category: 'Best selling' },
    { name: 'The Confidence Map', imageName: 'The Confidence Map.png', category: 'Best selling' },
    { name: 'The Secret Behind Romantic Love', imageName: 'The Secret Behind Romantic Love.png', category: 'Recommended for you' },
    { name: 'Master Your Finances', imageName: 'MasterYourFinances.png', category: 'Recommended for you' },
    { name: 'Breaking Free From Mastubation', imageName: 'Breaking Free From Mastubation.png', category: 'Recommended for you' },
    { name: 'The Woman', imageName: 'The Woman.png', category: 'Recommended for you' },
    { name: 'Resonance', imageName: 'Resonance.png', category: 'Recommended for you' },
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
      {loading && (
        <View style={styles.pageLoadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.pageLoadingText}>Loading books...</Text>
        </View>
      )}
      {!loading && (
        <>
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
                    <BookCoverImage
                      source={bookCovers[book.name]}
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
                    <BookCoverImage
                      source={bookCovers[book.name]}
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
                    <BookCoverImage
                      source={bookCovers[book.name]}
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
        </>
      )}
    </ScrollView>
  );
}

const BookCoverImage = ({ source, style }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!source) {
    return (
      <View style={[style, styles.placeholderContainer]}>
        <Text style={styles.placeholderText}>No Image</Text>
      </View>
    );
  }

  return (
    <View style={[style, styles.imageContainer]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
      <Image
        source={{ uri: source }}
        style={[styles.bookImage, style, (loading || error) && styles.hiddenImage]}
        resizeMode="cover"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
};

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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebee',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    color: '#666',
    fontSize: 12,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
  },
  pageLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  pageLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
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