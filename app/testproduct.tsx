import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ArrowBackLeftIcon from '../assets/icons/arrow back left.svg';
import paymentService from '../services/paymentService';
import supabaseService from '../services/supabaseService';
import sheetStatusService from '../services/sheetStatusService';
import * as Linking from 'expo-linking';
import { ActivityIndicator } from 'react-native';

import BlankStarIcon from '../assets/icons/blank star.svg';
import FullStarIcon from '../assets/icons/full star.svg';
import HeartCircleIcon from '../assets/icons/heart-circle.svg';


export default function TestProductPage() {
  const router = useRouter();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactionId, setPendingTransactionId] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);

  const handlePurchase = () => {
    setPaymentModalVisible(true);
  };
  
  // Define the type for payment result
  // Expanded PaymentResult type to match all possible return shapes
  interface PaymentResult {
    success: boolean;
    message: any;
    transactionId?: any;
    provider?: string;
    response?: any;
    error?: any;
    responseCode?: any;
  }
  const handlePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Empty Phone Number', 'Please enter your phone number');
      return;
    }
  
    setIsProcessing(true);
    try {
      // Use paymentService with PesaFlux provider
      const amount = 1; // Price for the test product (1 KSH)
      const productTitle = 'Test Product';
      const result = await paymentService.sendSTKPush(phoneNumber, amount, 'pesaflux', productTitle) as PaymentResult;
      if (result && result.success) {
        const transactionId = result.transactionId || (result.response && result.response.transactionId);
        if (transactionId) {
          setPendingTransactionId(transactionId);
        }
        Alert.alert(
          'Payment Request Sent!', 
          'Approve the M-Pesa prompt on your phone.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Payment Failed', (result && result.message) || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCheckPaymentStatus = async () => {
    if (!pendingTransactionId) {
      Alert.alert('No Transaction', 'There is no pending transaction to check.');
      return;
    }
    setIsChecking(true);
    try {
      // Poll backend for payment status
      const statusResult: { success: boolean; status?: string } = await paymentService.checkTransactionStatus(pendingTransactionId);
      if (statusResult && statusResult.success && statusResult.status === 'SUCCESS') {
        // Start automatic delivery monitoring
        await startAutomaticDelivery();
      } else {
        Alert.alert('Payment Pending', 'Payment not yet confirmed. Please try again in a moment.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check payment status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const startAutomaticDelivery = async () => {
    try {
      // Check for recent purchases and deliver automatically
      const recentPurchases = await supabaseService.checkAndDeliverRecentPurchases(phoneNumber);
      
      if (recentPurchases && recentPurchases.length > 0) {
        const latestPurchase = recentPurchases[0];
        setDownloadUrl(latestPurchase.downloadUrl);
        setPurchaseDetails({
          productName: 'Test Product',
          downloadUrl: latestPurchase.downloadUrl,
          amount: 1,
          transactionId: latestPurchase.transaction_id,
          phoneNumber: phoneNumber
        });
        setSuccessModalVisible(true);
        setPaymentModalVisible(false);
      } else {
        // Set up real-time subscription for future purchases
        setupPurchaseSubscription();
        Alert.alert('Monitoring', 'Setting up automatic delivery...');
      }
    } catch (error) {
      console.error('Error in automatic delivery:', error);
      Alert.alert('Error', 'Failed to set up automatic delivery. Please check again.');
    }
  };

  const setupPurchaseSubscription = () => {
    try {
      const subscription = supabaseService.subscribeToPurchases(phoneNumber, async (purchaseData) => {
        console.log('🎉 Automatic delivery triggered:', purchaseData);
        setDownloadUrl(purchaseData.downloadUrl);
        setPurchaseDetails({
          productName: purchaseData.purchase.book_id,
          downloadUrl: purchaseData.downloadUrl,
          amount: purchaseData.purchase.amount,
          transactionId: purchaseData.purchase.transaction_id,
          phoneNumber: phoneNumber
        });
        setSuccessModalVisible(true);
        setPaymentModalVisible(false);
      });

      // Store subscription for cleanup
      return subscription;
    } catch (error) {
      console.error('Error setting up subscription:', error);
    }
  };

  // Enhanced payment flow with automatic delivery
  const handlePaymentWithAutoDelivery = async () => {
    if (!phoneNumber) {
      Alert.alert('Empty Phone Number', 'Please enter your phone number');
      return;
    }
  
    setIsProcessing(true);
    try {
      // Use paymentService with PesaFlux provider
      const amount = 1; // Price for the test product (1 KSH)
      const productTitle = 'Test Product';
      const result = await paymentService.sendSTKPush(phoneNumber, amount, 'pesaflux', productTitle) as PaymentResult;
      
      if (result && result.success) {
        const transactionId = result.transactionId || (result.response && result.response.transactionId);
        if (transactionId) {
          setPendingTransactionId(transactionId);
          
          // Set up automatic delivery monitoring
          setupPurchaseSubscription();
          
          Alert.alert(
            'Payment Request Sent!', 
            'Approve the M-Pesa prompt on your phone. Your product will be delivered automatically.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert('Payment Failed', (result && result.message) || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/books')}
      >
        <ArrowBackLeftIcon width={24} height={24} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.heartButton}
        onPress={() => router.push('/favorites')}
      >
        <HeartCircleIcon width={24} height={24} />
      </TouchableOpacity>
      
      <View style={styles.centerIconPlaceholder}>
        <Text style={styles.placeholderText}>Test Product Image</Text>
      </View>
      
      <Text style={styles.title}>Test Product <Text style={styles.formatText}>(pdf.epub)</Text></Text>
      <Text style={styles.authorText}>by Great Awareness</Text>
      <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            <Text style={styles.discountPrice}>1ksh</Text>
          </Text>
        </View>
        <View style={styles.starsContainer}>
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <Text style={styles.ratingText}>5.0</Text>
        </View>
        <Text style={styles.reviewsText}>Reviews</Text>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          This is a test product page that demonstrates the payment functionality.
          The price is set to 1 KSH for testing purposes. This product follows the
          same purchase flow as other products in the application.
        </Text>
        <View style={styles.grabCopyContainer}>
          <Text style={styles.grabCopyText}>Grab your own copy</Text>
          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <Text style={styles.purchaseButtonText}>Purchase</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={paymentModalVisible}
          onRequestClose={() => {
            setPaymentModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>M-Pesa Payment</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter Phone Number:</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="e.g., 0712345678"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.paymentOption}
                onPress={handlePaymentWithAutoDelivery}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.paymentOptionText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.paymentOptionText}>Pay with M-Pesa</Text>
                )}
              </TouchableOpacity>
              
              {pendingTransactionId && (
                <TouchableOpacity 
                style={styles.checkStatusButton}
                onPress={async () => {
                  if (!pendingTransactionId) {
                    Alert.alert('No Transaction', 'Please complete payment first.');
                    return;
                  }
                  
                  setIsChecking(true);
                  try {
                    // Check payment status
                    const statusResult = await paymentService.checkTransactionStatus(pendingTransactionId);
                    
                    if (statusResult && statusResult.success && statusResult.status === 'SUCCESS') {
                      // Payment successful - deliver product
                      const recentPurchases = await supabaseService.checkAndDeliverRecentPurchases(phoneNumber);
                      
                      if (recentPurchases && recentPurchases.length > 0) {
                        const latestPurchase = recentPurchases[0];
                        setDownloadUrl(latestPurchase.downloadUrl);
                        setPaymentModalVisible(false);
                        
                        Alert.alert(
                          'Payment Successful!',
                          'Your product is ready for download.',
                          [
                            {
                              text: 'Download Now',
                              onPress: () => Linking.openURL(latestPurchase.downloadUrl),
                            },
                            { text: 'Later', style: 'cancel' },
                          ]
                        );
                      } else {
                        // Fallback: check existing purchases
                        const allPurchases = await supabaseService.getAllPurchasesWithDownloadUrls(phoneNumber);
                        const testProductPurchase = allPurchases.find(p => p.purchase.book_id === 'test-product');
                        
                        if (testProductPurchase) {
                          setDownloadUrl(testProductPurchase.downloadUrl);
                          setPaymentModalVisible(false);
                          
                          Alert.alert(
                            'Product Found!',
                            'Your test product is ready for download.',
                            [
                              {
                                text: 'Download Now',
                                onPress: () => Linking.openURL(testProductPurchase.downloadUrl),
                              },
                              { text: 'Later', style: 'cancel' },
                            ]
                          );
                        } else {
                          Alert.alert('No Product Found', 'No purchased product found for this phone number.');
                        }
                      }
                    } else {
                      Alert.alert('Payment Pending', 'Payment not yet confirmed. Please check your M-Pesa and try again.');
                    }
                  } catch (error) {
                    console.error('Error checking payment:', error);
                    Alert.alert('Error', 'Failed to check payment status. Please try again.');
                  } finally {
                    setIsChecking(false);
                  }
                }}
                disabled={isChecking}
              >
                {isChecking ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.paymentOptionText}>Get My Product</Text>
                )}
              </TouchableOpacity>
              )}
              
              <Pressable
                style={styles.closeButton}
                onPress={() => setPaymentModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, styles.successModal]}>
              <Text style={styles.successTitle}>🎉 Purchase Successful!</Text>
              <Text style={styles.successSubtitle}>Your digital product is ready</Text>
              
              <View style={styles.successDetails}>
                <Text style={styles.successText}>✅ Test Product - KES 1.00</Text>
                <Text style={styles.successText}>📱 Phone: {phoneNumber}</Text>
                {purchaseDetails?.transactionId && (
                  <Text style={styles.successText}>🆔 Transaction: {purchaseDetails.transactionId}</Text>
                )}
              </View>

              <Text style={styles.instructionsTitle}>How to access your product:</Text>
              <Text style={styles.instructionsText}>1. Tap "Download Now" below to get your file</Text>
              <Text style={styles.instructionsText}>2. The file will open in your browser or PDF reader</Text>
              <Text style={styles.instructionsText}>3. You can also find it anytime in "My Purchases"</Text>

              <TouchableOpacity 
                style={[styles.downloadButton, styles.successDownloadButton]}
                onPress={() => {
                  if (downloadUrl) {
                    Linking.openURL(downloadUrl);
                  }
                }}
              >
                <Text style={styles.downloadButtonText}>📥 Download Now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.myPurchasesButton}
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.push('/mypurchases');
                }}
              >
                <Text style={styles.myPurchasesButtonText}>📚 Go to My Purchases</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.closeSuccessButton}
                onPress={() => setSuccessModalVisible(false)}
              >
                <Text style={styles.closeSuccessButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3E4DE',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  heartButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  centerIconPlaceholder: {
    width: 200,
    height: 300,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  formatText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  authorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: '#555',
  },
  priceContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  priceText: {
    fontSize: 18,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discountPrice: {
    fontWeight: 'bold',
    color: '#E63946',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  star: {
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
  },
  reviewsText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#1D3557',
    textDecorationLine: 'underline',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: 'justify',
  },
  grabCopyContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  grabCopyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  purchaseButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  phoneInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  paymentOption: {
    width: '100%',
    backgroundColor: '#1D3557',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkStatusButton: {
    width: '100%',
    backgroundColor: '#457B9D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentOptionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  successModal: {
    padding: 30,
    maxWidth: 350,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  successDetails: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  successText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  successDownloadButton: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
    marginBottom: 10,
  },
  myPurchasesButton: {
    backgroundColor: '#2196F3',
    marginBottom: 10,
  },
  myPurchasesButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeSuccessButton: {
    marginTop: 10,
  },
  closeSuccessButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});