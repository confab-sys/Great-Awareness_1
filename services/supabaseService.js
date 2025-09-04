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
   * Upload a book file to storage
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
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading book file:', error);
      throw error;
    }
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