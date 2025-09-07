import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ArrowBackLeftIcon from '../assets/icons/arrow back left.svg';
import paymentService from '../services/paymentService';
import supabaseService from '../services/supabaseService';

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

  const handlePurchase = () => {
    setPaymentModalVisible(true);
  };
  
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
      const result = await paymentService.sendSTKPush(phoneNumber, amount, 'pesaflux', productTitle);
      
      if (result && result.success) {
        if (result.transactionId) {
          setPendingTransactionId(result.transactionId);
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
      const statusResult = await paymentService.checkTransactionStatus(pendingTransactionId);
      
      if (statusResult.success) {
        Alert.alert('Payment Successful', 'Thank you for your purchase!');
        setPaymentModalVisible(false);
      } else {
        Alert.alert('Payment Pending', 'Your payment is still being processed. Please try checking again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check payment status. Please try again.');
    } finally {
      setIsChecking(false);
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
                onPress={handlePayment}
                disabled={isProcessing}
              >
                <Text style={styles.paymentOptionText}>
                  {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
                </Text>
              </TouchableOpacity>
              
              {pendingTransactionId && (
                <TouchableOpacity 
                  style={styles.checkStatusButton}
                  onPress={handleCheckPaymentStatus}
                  disabled={isChecking}
                >
                  <Text style={styles.paymentOptionText}>
                    {isChecking ? 'Checking...' : 'Check Payment Status'}
                  </Text>
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
});