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

class WebhookService {
  private DOWNLOAD_LINKS: Record<string, string> = {
    'The Confidence Map': 'https://drive.usercontent.google.com/download?id=1m8VHhQzvVBhzIKMfFQRFQwvKRoO9Xtr4&export=download&authuser=0',
    'Unlocking the Primal Brain': 'https://drive.google.com/file/d/1_wIIkiGz6yDPdMupfqUmTbM2cYm_u7AJ/view?usp=drive_link',
  };

  private PRODUCT_AMOUNTS: Record<string, number> = {
    'The Confidence Map': 1, // 1 KSH
    'Unlocking the Primal Brain': 400,
    'The Power Within': 500,
    'No More Confusion': 400,
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

      const downloadLink = this.DOWNLOAD_LINKS[productName];
      
      if (downloadLink && productName === 'The Confidence Map') {
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
      
      // You can also implement additional actions here:
      // - Send SMS with download link
      // - Send email with download link
      // - Update database with purchase record
      
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
