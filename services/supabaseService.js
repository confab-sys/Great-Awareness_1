import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../config/supabase';

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
            book_id: purchaseData.bookId,
            transaction_id: purchaseData.transactionId,
            amount: purchaseData.amount,
            phone_number: purchaseData.phoneNumber,
            receipt: purchaseData.receipt,
            status: 'completed'
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
      // First get the book to find the file path
      const book = await this.getBook(bookId);
      if (!book || !book.file_path) {
        throw new Error('Book not found or has no file path');
      }

      // Generate a signed URL with expiration
      const { data, error } = await this.supabase
        .storage
        .from(this.storageBucket)
        .createSignedUrl(book.file_path, SUPABASE_CONFIG.TEMP_URL_EXPIRY);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating temporary download URL:', error);
      throw error;
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
}

const supabaseService = new SupabaseService();
export default supabaseService;