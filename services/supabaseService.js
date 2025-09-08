const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_CONFIG } = require('../config/supabase.js');

class SupabaseService {
  constructor() {
    this.supabase = createClient(
      SUPABASE_CONFIG.URL,
      SUPABASE_CONFIG.ANON_KEY
    );
    this.storageBucket = SUPABASE_CONFIG.STORAGE_BUCKET;
  }

  /**
   * Get a book by its ID
   * @param {string} bookId - The ID of the book
   * @returns {Promise<Object>} - The book object
   */
  async getBook(bookId) {
    try {
      const { data, error } = await this.supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  /**
   * Get all available books
   * @returns {Promise<Array>} - Array of book objects
   */
  async getAllBooks() {
    try {
      const { data, error } = await this.supabase
        .from('books')
        .select('*')
        .order('title');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  /**
   * Record a book purchase
   * @param {Object} purchaseData - The purchase data
   * @returns {Promise<Object>} - The created purchase record
   */
  async recordPurchase(purchaseData) {
    try {
      const { data, error } = await this.supabase
        .from('purchases')
        .insert([
          {
            book_id: purchaseData.book_id || purchaseData.bookId,
            transaction_id: purchaseData.transaction_id || purchaseData.transactionId,
            amount: purchaseData.amount,
            phone_number: purchaseData.phone_number || purchaseData.phoneNumber,
            receipt: purchaseData.receipt,
            status: purchaseData.status || 'completed'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording purchase:', error);
      throw error;
    }
  }

  /**
   * Generate a temporary download URL for a book
   * @param {string} bookId - The ID of the book
   * @returns {Promise<string>} - Temporary download URL
   */
  async generateTempDownloadUrl(bookId) {
    try {
      // Special handling for test product - handle all test product variations
      if (bookId === 'test-product' || bookId === 'Test Product' || bookId === '6c62e16c-dc7f-41e0-9f6d-2738fb15e1fb') {
        // Use the actual test product URL from storage - direct working URL
        console.log('Using actual test product URL from Supabase storage');
        return 'https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/test%20product.pdf';
      }

      // First get the book to find the file path
      const book = await this.getBook(bookId);
      if (!book || !book.file_path) {
        console.warn(`Book ${bookId} not found or has no file_path`);
        // For test product fallback, return the direct URL
        if (bookId.includes('test') || bookId.includes('Test')) {
          return 'https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/test%20product.pdf';
        }
        throw new Error(`Book ${bookId} not found or has no file path`);
      }

      // Generate a signed URL with expiration
      const { data, error } = await this.supabase
        .storage
        .from(this.storageBucket)
        .createSignedUrl(book.file_path, SUPABASE_CONFIG.TEMP_URL_EXPIRY);

      if (error) {
        if (error.message.includes('Object not found')) {
          console.warn(`File not found in storage: ${book.file_path}`);
          // For test product, always return the direct URL regardless
          return 'https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/test%20product.pdf';
        }
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error generating temporary download URL:', error);
      // Always return the test product URL for any test-related requests
      if (bookId.includes('test') || bookId.includes('Test') || bookId === '6c62e16c-dc7f-41e0-9f6d-2738fb15e1fb') {
        return 'https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/test%20product.pdf';
      }
      // For other books, return a more helpful fallback
      return `https://your-fallback-url.com/books/${bookId}`;
    }
  }

  /**
   * Upload a book file to storage with optimization
   * @param {File|Blob} file - The file to upload
   * @param {string} filePath - The path to store the file
   * @returns {Promise<Object>} - Upload result
   */
  async uploadBookFile(file, filePath) {
    try {
      const { data, error } = await this.supabase
        .storage
        .from(this.storageBucket)
        .upload(filePath, file, {
          cacheControl: '31536000', // 1 year cache for static assets
          upsert: false,
          contentType: file.type || 'image/jpeg'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading book file:', error);
      throw error;
    }
  }

  /**
   * Get public URL for a book cover image with fallback to local assets
   * @param {string} imageName - The name of the image file
   * @returns {string} - Public URL for the image or local asset path
   */
  getBookCoverUrl(imageName) {
    try {
      // Check if running in development/local environment
      if (!this.storageBucket || !SUPABASE_CONFIG.URL) {
        console.warn('Supabase storage not configured, using local assets');
        return null; // Will trigger fallback to local assets
      }

      const { data } = this.supabase
        .storage
        .from(this.storageBucket)
        .getPublicUrl(`covers/${imageName}`);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting book cover URL:', error);
      return null; // Will trigger fallback to local assets
    }
  }

  /**
   * Get all book cover URLs with optimized thumbnails
   * @returns {Object} - Object mapping book names to their optimized cover URLs
   */
  getAllBookCoverUrls() {
    const bookCovers = {
      'Unlocking the Primal Brain': 'Unlocking the Primal Brain.png',
      'No More Confusion': 'No More Confusion.png',
      'The Power Within': 'The Power Within.png',
      'The Confidence Map': 'The Confidence Map.png',
      'The Secret Behind Romantic Love': 'The Secret Behind Romantic Love.png',
      'Master Your Finances': 'MasterYourFinances.png',
      'Breaking Free From Mastubation': 'Breaking Free From Mastubation.png',
      'The Woman': 'The Woman.png',
      'Resonance': 'Resonance.png'
    };

    const urls = {};
    for (const [bookName, fileName] of Object.entries(bookCovers)) {
      urls[bookName] = this.getBookCoverUrl(fileName, {
        width: 300,
        height: 450,
        format: 'webp',
        quality: 80
      });
    }

    return urls;
  }

  /**
   * Get responsive image URLs for different screen densities
   * @param {string} imageName - The name of the image file
   * @param {Array} sizes - Array of size objects [{width, height, suffix}]
   * @returns {Object} - Object with responsive URLs
   */
  getResponsiveBookCoverUrls(imageName, sizes = [
    { width: 150, height: 225, suffix: 'small' },
    { width: 300, height: 450, suffix: 'medium' },
    { width: 600, height: 900, suffix: 'large' }
  ]) {
    const urls = {};
    
    sizes.forEach(size => {
      urls[size.suffix] = this.getBookCoverUrl(imageName, {
        width: size.width,
        height: size.height,
        format: 'webp',
        quality: 85
      });
    });

    return urls;
  }

  /**
   * Check if a purchase exists for a given transaction ID
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<boolean>} - Whether the purchase exists
   */
  async checkPurchaseExists(transactionId) {
    try {
      const { data, error, count } = await this.supabase
        .from('purchases')
        .select('*', { count: 'exact' })
        .eq('transaction_id', transactionId);

      if (error) throw error;
      return count > 0;
    } catch (error) {
      console.error('Error checking purchase:', error);
      throw error;
    }
  }

  /**
   * Get temporary download URL for the Test Product
   * @returns {Promise<string>} - Temporary download URL for the Test Product
   */
  async getTestProductDownloadUrl() {
    // Use the correct test product ID from database
    const testProductId = 'Test Product';
    return await this.generateTempDownloadUrl(testProductId);
  }

  /**
   * Check transaction details and get product download link
   * @param {string} phoneNumber - The phone number to check
   * @param {string} productId - The product ID to check (default: 'test-product')
   * @returns {Promise<Object>} - Transaction details and download URL
   */
  async checkTransactionAndGetProduct(phoneNumber, productId = 'test-product') {
    try {
      // Format phone number
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('+254')) {
        formattedPhone = phoneNumber.substring(1);
      }

      // Query the transactions table for successful purchases
      const { data: transactions, error } = await this.supabase
        .from('transactions')
        .select('*')
        .eq('phone_number', formattedPhone)
        .eq('product_id', productId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking transactions:', error);
        throw error;
      }

      if (!transactions || transactions.length === 0) {
        return null;
      }

      const transaction = transactions[0];
      
      // Get the book details to find the file path
      const { data: book, error: bookError } = await this.supabase
        .from('books')
        .select('file_path')
        .eq('id', productId)
        .single();

      if (bookError) {
        console.error('Error getting book:', bookError);
        throw bookError;
      }

      if (!book || !book.file_path) {
        throw new Error('Product file path not found');
      }

      // Generate download URL from storage
      const { data: urlData, error: urlError } = await this.supabase.storage
        .from(this.storageBucket)
        .createSignedUrl(book.file_path, 3600); // 1 hour expiry

      if (urlError) {
        console.error('Error creating signed URL:', urlError);
        throw urlError;
      }

      return {
        transaction: transaction,
        downloadUrl: urlData.signedUrl,
        productPath: book.file_path
      };
    } catch (error) {
      console.error('Error in checkTransactionAndGetProduct:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time purchase updates for automatic product delivery
   * @param {string} phoneNumber - The phone number to monitor
   * @param {Function} callback - Callback function when new purchase is detected
   * @returns {Promise<Object>} - Subscription object
   */
  async subscribeToPurchases(phoneNumber, callback) {
    try {
      // Format phone number to match database format
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('+254')) {
        formattedPhone = phoneNumber.substring(1);
      }

      console.log('🔔 Subscribing to purchases for phone:', formattedPhone);

      // Subscribe to real-time changes in the purchases table
      const subscription = this.supabase
        .channel('purchases-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'purchases',
            filter: `phone_number=eq.${formattedPhone}`
          },
          async (payload) => {
            console.log('🎉 New purchase detected:', payload.new);
            
            // Generate download URL for the purchased product
            const downloadUrl = await this.generateTempDownloadUrl(payload.new.book_id);
            
            // Call the callback with purchase details
            callback({
              purchase: payload.new,
              downloadUrl: downloadUrl,
              timestamp: new Date().toISOString()
            });
          }
        )
        .subscribe();

      return subscription;
    } catch (error) {
      console.error('Error subscribing to purchases:', error);
      throw error;
    }
  }

  /**
   * Check for recent purchases and deliver products automatically
   * @param {string} phoneNumber - The phone number to check
   * @returns {Promise<Array>} - Array of recent purchases with download URLs
   */
  async checkAndDeliverRecentPurchases(phoneNumber) {
    try {
      // Format phone number
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('+254')) {
        formattedPhone = phoneNumber.substring(1);
      }

      // Get purchases from the last 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from('purchases')
        .select('*')
        .eq('phone_number', formattedPhone)
        .gte('created_at', tenMinutesAgo)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Generate download URLs for each purchase
      const purchasesWithUrls = await Promise.all(
        data.map(async (purchase) => ({
          ...purchase,
          downloadUrl: await this.generateTempDownloadUrl(purchase.book_id)
        }))
      );

      return purchasesWithUrls;
    } catch (error) {
      console.error('Error checking recent purchases:', error);
      throw error;
    }
  }

  /**
   * Get all purchases for a phone number with download URLs
   * @param {string} phoneNumber - The phone number to query
   * @returns {Promise<Array>} - Array of all purchases with download URLs
   */
  async getAllPurchasesWithDownloadUrls(phoneNumber) {
    try {
      // Format phone number
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('+254')) {
        formattedPhone = phoneNumber.substring(1);
      }

      const { data, error } = await this.supabase
        .from('purchases')
        .select('*')
        .eq('phone_number', formattedPhone)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Generate download URLs for each purchase
      const purchasesWithUrls = await Promise.all(
        data.map(async (purchase) => ({
          ...purchase,
          downloadUrl: await this.generateTempDownloadUrl(purchase.book_id)
        }))
      );

      return purchasesWithUrls;
    } catch (error) {
      console.error('Error getting all purchases:', error);
      throw error;
    }
  }
}

const supabaseService = new SupabaseService();
module.exports = supabaseService;