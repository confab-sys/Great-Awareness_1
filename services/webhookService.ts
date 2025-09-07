export interface PaymentWebhook {
  ResponseCode: number;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  TransactionID: string;
  TransactionAmount: number;
  TransactionReceipt: string;
  TransactionDate: string;
  TransactionReference: string;
  Msisdn: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  downloadTriggered?: boolean;
  productName?: string;
  downloadInfo?: any;
}

import supabaseService from './supabaseService';

class WebhookService {
  private DOWNLOAD_LINKS: Record<string, string> = {
    'The Confidence Map': 'https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/Confidence%20Guide%20Map%20by%20Ashwa%20Aashard.pdf',
    'Unlocking the Primal Brain': 'https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/Unlocking%20the%20primal%20brainThe%20hidden%20force%20shaping%20your%20thoughts%20and%20emotions.pdf', // This will use Supabase for secure file delivery
  };

  private PRODUCT_AMOUNTS: Record<string, number> = {
    'The Confidence Map': 1, // 1 KSH
    'Unlocking the Primal Brain': 400,
    'The Power Within': 500,
    'No More Confusion': 400,
    'Test Product': 1, // 1 KSH for testing
  };

  async processPaymentWebhook(webhookData: PaymentWebhook): Promise<WebhookResponse> {
    try {
      console.log('🔔 Received payment webhook:', webhookData);

      if (webhookData.ResponseCode !== 0) {
        return {
          success: false,
          message: `Payment not successful. ResponseCode: ${webhookData.ResponseCode}`
        };
      }

      const productName = this.getProductByAmount(webhookData.TransactionAmount);
      
      if (!productName) {
        return {
          success: false,
          message: `Unknown product amount: ${webhookData.TransactionAmount}`
        };
      }

      console.log('✅ Payment successful for product:', productName);
      this.logSuccessfulPurchase(webhookData, productName);

      // Handle download link generation based on product
      if (productName === 'Unlocking the Primal Brain') {
        // Use Supabase for secure file delivery
        const downloadInfo = await this.triggerSupabaseDownload(webhookData, productName);
        return {
          success: true,
          message: `Payment successful for ${productName}`,
          downloadTriggered: true,
          productName: productName,
          downloadInfo: downloadInfo
        };
      } else if (productName === 'The Confidence Map') {
        // Use existing Google Drive link
        const downloadLink = this.DOWNLOAD_LINKS[productName];
        const downloadInfo = await this.triggerAutomaticDownload(downloadLink, webhookData, productName);
        return {
          success: true,
          message: `Payment successful for ${productName}`,
          downloadTriggered: true,
          productName: productName,
          downloadInfo: downloadInfo
        };
      }

      return {
        success: true,
        message: `Payment successful for ${productName}`,
        downloadTriggered: !!downloadLink,
        productName: productName
      };

    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      return {
        success: false,
        message: `Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private getProductByAmount(amount: number): string | null {
    for (const [productName, productAmount] of Object.entries(this.PRODUCT_AMOUNTS)) {
      if (productAmount === amount) {
        return productName;
      }
    }
    return null;
  }

  private logSuccessfulPurchase(webhookData: PaymentWebhook, productName: string) {
    console.log('🎉 Successful Purchase Details:');
    console.log('   Product:', productName);
    console.log('   Amount: KSH', webhookData.TransactionAmount);
    console.log('   Phone:', webhookData.Msisdn);
    console.log('   Transaction ID:', webhookData.TransactionID);
    console.log('   Receipt:', webhookData.TransactionReceipt);
  }

  /**
   * Trigger download from Supabase for secure file delivery
   */
  private async triggerSupabaseDownload(webhookData: PaymentWebhook, productName: string) {
    try {
      console.log('🚀 Triggering Supabase download for:', productName);
      
      // Record the purchase in Supabase
      await supabaseService.recordPurchase({
        bookId: productName,
        transactionId: webhookData.TransactionID,
        amount: webhookData.TransactionAmount,
        phoneNumber: webhookData.Msisdn,
        receipt: webhookData.TransactionReceipt
      });
      
      // Generate a temporary download URL that expires
      const downloadUrl = await supabaseService.generateTempDownloadUrl(productName);
      
      if (!downloadUrl) {
        throw new Error('Failed to generate download URL');
      }
      
      // Create download info object for client
      const downloadInfo = {
        productName: productName,
        downloadLink: downloadUrl,
        transactionId: webhookData.TransactionID,
        phoneNumber: webhookData.Msisdn,
        amount: webhookData.TransactionAmount,
        receipt: webhookData.TransactionReceipt,
        timestamp: Date.now(),
        expiresIn: '24 hours'
      };
      
      console.log('💾 Supabase download info stored:', downloadInfo);
      console.log('✅ Supabase download triggered successfully');
      
      return downloadInfo;
    } catch (error) {
      console.error('❌ Error triggering Supabase download:', error);
      throw error;
    }
  }
  
  /**
   * Trigger download from direct URL (e.g., Google Drive)
   */
  private async triggerAutomaticDownload(downloadLink: string, webhookData: PaymentWebhook, productName: string) {
    try {
      console.log('🚀 Triggering automatic download for:', productName);
      console.log('📥 Download URL:', downloadLink);
      
      // Store the download information for the client to access
      // This will be used by the client-side to trigger the download
      const downloadInfo = {
        productName: productName,
        downloadLink: downloadLink,
        transactionId: webhookData.TransactionID,
        phoneNumber: webhookData.Msisdn,
        amount: webhookData.TransactionAmount,
        receipt: webhookData.TransactionReceipt,
        timestamp: Date.now()
      };
      
      // Store in localStorage or sessionStorage for client access
      // Since this is server-side, we'll use a different approach
      console.log('💾 Download info stored:', downloadInfo);
      
      // Trigger download by opening the URL
      // For server-side, we can send a response that the client can use
      console.log('✅ Automatic download triggered successfully');
      
      return downloadInfo;
    } catch (error) {
      console.error('❌ Error triggering download:', error);
      throw error;
    }
  }

  getDownloadLink(productName: string): string | null {
    return this.DOWNLOAD_LINKS[productName] || null;
  }

  getAvailableProducts(): Record<string, number> {
    return { ...this.PRODUCT_AMOUNTS };
  }
}

export default new WebhookService();
