import { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import paymentService from '../services/paymentService';

export default function NewsletterVideosPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfusionExpanded, setIsConfusionExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Empty Phone Number', 'Please enter any phone number');
      return;
    }

    setIsProcessing(true);
    console.log('Starting payment process with phone number:', phoneNumber);
    
    try {
      // Use paymentService with PesaFlux provider
      console.log('Calling paymentService.sendSTKPush with:', phoneNumber, 400, 'pesaflux');
      const result = await paymentService.sendSTKPush(phoneNumber, 400, 'pesaflux');
      console.log('Payment API response:', result);
      
      if (result.success) {
        console.log('Payment request successful, transaction ID:', result.transactionId);
        Alert.alert(
          'Payment Request Sent!', 
          'Please check your phone for the M-Pesa payment prompt. Enter your PIN to complete the payment.',
          [{ text: 'OK', onPress: () => {
            setShowPaymentModal(false);
            setPhoneNumber('');
          }}]
        );
      } else {
        console.error('Payment failed:', result.message, result);
        
        // Handle specific error types
        if (result.error && result.error.code === 'ERR_NETWORK') {
          Alert.alert(
            'Network Error', 
            'Unable to connect to payment server. Please check your internet connection and try again.'
          );
        } else {
          Alert.alert('Payment Failed', result.message || 'Unknown error occurred');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Books</Text>
        </View>
        
        {/* Products Section */}
        <View style={styles.bookSection}>
          <View style={styles.productsRow}>
            {/* Product 1: Unlocking the Primal Brain */}
            <TouchableOpacity 
              style={styles.productWrapper}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.8}
            >
              <View style={styles.bookContainer}>
                <View style={styles.bookImageContainer}>
                  <Image 
                    source={require('../assets/icons/unlocking the primal brain.png')}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.bookContent}>
                  <Text style={styles.bookTitle}>Unlocking the Primal Brain</Text>
                  {isExpanded && (
                    <Text style={styles.bookDescription}>
                      The Hidden Force Shaping Your Thoughts & Emotions{'\n\n'}
                      Why do we procrastinate, overthink, or get trapped in destructive habits—even when we know better?{'\n\n'}
                      The answer lies deep within your primal brain, the ancient part of your mind that has been silently controlling your emotions, desires, and decisions since the dawn of time.{'\n\n'}
                      In this groundbreaking book, Ashwa Aashard unravels the secret mechanisms behind fear, addiction, motivation, and emotional reactions, showing you how to break free from unconscious patterns and take full control of your life.{'\n\n'}
                      Why do you react emotionally before you even think?{'\n'}
                      How does dopamine trick you into addiction, bad habits, and social media loops?{'\n'}
                      Why is your brain wired for fear, anger, and impulsive decisions—and how can you override it?{'\n'}
                      What practical steps can you take to break free from self-sabotage and master your emotions?{'\n\n'}
                      Combining neuroscience, psychology, and real-world insights, this book will teach you how to rewire your mind, master your emotions, and take charge of your future.{'\n\n'}
                      💡 If you've ever felt like your brain is working against you, this book is the key to unlocking its full power.
                    </Text>
                  )}
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>was kes 1000</Text>
                    <Text style={styles.discountPrice}> and now ksh </Text>
                    <Text style={styles.finalPrice}>400</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowPaymentModal(true);
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                  <Text style={styles.tapHint}>
                    {isExpanded ? 'Tap to collapse' : 'Tap to read more'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Product 2: No More Confusion */}
            <TouchableOpacity 
              style={styles.productWrapper}
              activeOpacity={0.8}
              onPress={() => setIsConfusionExpanded(!isConfusionExpanded)}
            >
              <View style={styles.bookContainer}>
                <View style={styles.bookImageContainer}>
                  <Image 
                    source={require('../assets/icons/No more confusion.png')}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.bookContent}>
                  <Text style={styles.bookTitle}>No More Confusion</Text>
                  {isConfusionExpanded && (
                    <Text style={styles.bookDescription}>
                      No More Confusion is the ultimate guide to uncovering your true calling and breaking
                      free from the mental fog that holds you back. If you’ve ever felt lost, stuck, or unsure
                      about your purpose, this book will help you understand why—and more importantly, how to
                      change it. By diving deep into the psychology of decision-making, self-actualization, and the
                      hidden forces shaping your path, you’ll finally gain the clarity you need to step into your
                      true potential. The answers have been in front of you all along—it’s time to see.
                    </Text>
                  )}
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>was kes 1000</Text>
                    <Text style={styles.discountPrice}> and now ksh </Text>
                    <Text style={styles.finalPrice}>400</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={() => setShowPaymentModal(true)}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                  <Text style={styles.tapHint}>
                    {isConfusionExpanded ? 'Tap to collapse' : 'Tap to read more'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* M-Pesa Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* M-Pesa Header */}
            <View style={styles.mpesaHeader}>
              <Text style={styles.mpesaTitle}>M-PESA</Text>
              <Text style={styles.mpesaSubtitle}>Enter your phone number to receive payment prompt</Text>
            </View>

            {/* Payment Details */}
            <View style={styles.paymentDetails}>
              <Text style={styles.amountText}>Amount: KSH 400</Text>
              <Text style={styles.recipientText}>Recipient: Great Awareness</Text>
              <Text style={styles.referenceText}>Reference: Book Purchase</Text>
            </View>

            {/* Phone Number Input */}
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneLabel}>Enter Phone Number:</Text>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter any phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPaymentModal(false);
                  setPhoneNumber('');
                }}
                disabled={isProcessing}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, isProcessing && styles.disabledButton]}
                onPress={handlePayment}
                disabled={isProcessing}
              >
                <Text style={styles.confirmButtonText}>
                  {isProcessing ? 'Processing...' : 'Send Payment Request'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Processing Indicator */}
            {isProcessing && (
              <View style={styles.processingContainer}>
                <Text style={styles.processingText}>Sending payment request...</Text>
                <Text style={styles.processingSubtext}>Please wait</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3E4DE',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#D3E4DE',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'PublicSans_700Bold',
    color: '#000',
    textAlign: 'center',
  },
  bookSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  bookContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bookImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  bookContent: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 24,
    fontFamily: 'PublicSans_700Bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  bookDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 16,
    color: '#666',
  },
  finalPrice: {
    fontSize: 18,
    fontFamily: 'PublicSans_700Bold',
    color: '#28A745',
  },
  buyButton: {
    backgroundColor: '#E42F45',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PublicSans_700Bold',
  },
  tapHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  productsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  productWrapper: {
    flex: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mpesaHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mpesaTitle: {
    fontSize: 28,
    fontFamily: 'PublicSans_700Bold',
    color: '#00A651',
    marginBottom: 8,
  },
  mpesaSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  paymentDetails: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'PublicSans_700Bold',
    color: '#000',
    marginBottom: 8,
  },
  recipientText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 14,
    color: '#666',
  },
  phoneContainer: {
    marginBottom: 24,
  },
  phoneLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  phoneInput: {
    borderWidth: 2,
    borderColor: '#00A651',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontFamily: 'PublicSans_700Bold',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  confirmButton: {
    backgroundColor: '#00A651',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'PublicSans_700Bold',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'PublicSans_700Bold',
    color: '#FFFFFF',
  },
  processingContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  processingText: {
    fontSize: 16,
    fontFamily: 'PublicSans_700Bold',
    color: '#00A651',
    marginBottom: 4,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
  },
});
