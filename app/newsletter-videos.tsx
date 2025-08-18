import { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import paymentService from '../services/paymentService';

export default function NewsletterVideosPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfusionExpanded, setIsConfusionExpanded] = useState(false);
  const [isPowerWithinExpanded, setIsPowerWithinExpanded] = useState(false);
  const [isConfidenceExpanded, setIsConfidenceExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ title: string; price: number } | null>(null);
  const [activeProduct, setActiveProduct] = useState<{
    title: string;
    price: number;
    originalPrice: number;
    image: any;
    description: string;
  } | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { width } = useWindowDimensions();
  const isNarrow = width < 480;

  const handlePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Empty Phone Number', 'Please enter any phone number');
      return;
    }

    setIsProcessing(true);
    console.log('Starting payment process with phone number:', phoneNumber);
    
    try {
      // Use paymentService with PesaFlux provider
      const amount = selectedProduct?.price ?? 400;
      console.log('Calling paymentService.sendSTKPush with:', phoneNumber, amount, 'pesaflux');
      const result = await paymentService.sendSTKPush(phoneNumber, amount, 'pesaflux');
      console.log('Payment API response:', result);
      
      if (result && result.success) {
        console.log('Payment request successful, transaction ID:', result.transactionId);
        Alert.alert(
          'Payment Request Sent!', 
          'Please check your phone for the M-Pesa payment prompt. Enter your PIN to complete the payment.',
          [{ text: 'OK', onPress: () => {
            setShowPaymentModal(false);
            setPhoneNumber('');
            setSelectedProduct(null);
          }}]
        );
      } else {
        console.error('Payment failed:', result?.message, result);
        
        // Handle specific error types
        if (result && (result as any).error?.code === 'ERR_NETWORK') {
          Alert.alert(
            'Network Error', 
            'Unable to connect to payment server. Please check your internet connection and try again.'
          );
        } else {
          Alert.alert('Payment Failed', (result && result.message) || 'Unknown error occurred');
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
              style={[styles.productWrapper, isNarrow && { flexBasis: '100%' }]}
              activeOpacity={0.8}
              onPress={() => {
                setActiveProduct({
                  title: 'Unlocking the Primal Brain',
                  price: 400,
                  originalPrice: 1000,
                  image: require('../assets/icons/unlocking the primal brain.png'),
                  description:
                    'The Hidden Force Shaping Your Thoughts & Emotions. Why do we procrastinate, overthink, or get trapped in destructive habits—even when we know better? The answer lies deep within your primal brain, the ancient part of your mind that has been silently controlling your emotions, desires, and decisions since the dawn of time. In this groundbreaking book, Ashwa Aashard unravels the secret mechanisms behind fear, addiction, motivation, and emotional reactions, showing you how to break free from unconscious patterns and take full control of your life.'
                });
                setShowProductModal(true);
              }}
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
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>was kes 1000</Text>
                    <Text style={styles.discountPrice}> and now ksh </Text>
                    <Text style={styles.finalPrice}>400</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      setActiveProduct({
                        title: 'Unlocking the Primal Brain',
                        price: 400,
                        originalPrice: 1000,
                        image: require('../assets/icons/unlocking the primal brain.png'),
                        description:
                          'The Hidden Force Shaping Your Thoughts & Emotions. Why do we procrastinate, overthink, or get trapped in destructive habits—even when we know better? The answer lies deep within your primal brain, the ancient part of your mind that has been silently controlling your emotions, desires, and decisions since the dawn of time. In this groundbreaking book, Ashwa Aashard unravels the secret mechanisms behind fear, addiction, motivation, and emotional reactions, showing you how to break free from unconscious patterns and take full control of your life.'
                      });
                      setShowProductModal(true);
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Product 2: The Confidence Map */}
            <TouchableOpacity 
              style={[styles.productWrapper, isNarrow && { flexBasis: '100%' }]}
              activeOpacity={0.8}
              onPress={() => {
                setActiveProduct({
                  title: 'The Confidence Map',
                  price: 250,
                  originalPrice: 500,
                  image: require('../assets/icons/The Confidence Map.png'),
                  description:
                    'Confidence: Rewiring the Primal Brain to Lead with Power, Not Fear is a comprehensive guide by Ashwa Aashard that explores the concept of confidence as a nervous system state rather than a personality trait. The book delves into how the primal brain often hijacks our confidence through fear and hesitation, and shows how to retrain your system through small, consistent actions to lead authentically in public speaking, business, relationships, and more.'
                });
                setShowProductModal(true);
              }}
            >
              <View style={styles.bookContainer}>
                <View style={styles.bookImageContainer}>
                  <Image 
                    source={require('../assets/icons/The Confidence Map.png')}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.bookContent}>
                  <Text style={styles.bookTitle}>The Confidence Map</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>was kes 500</Text>
                    <Text style={styles.discountPrice}> and now ksh </Text>
                    <Text style={styles.finalPrice}>250</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={() => {
                      setActiveProduct({
                        title: 'The Confidence Map',
                        price: 250,
                        originalPrice: 500,
                        image: require('../assets/icons/The Confidence Map.png'),
                        description:
                          'Confidence: Rewiring the Primal Brain to Lead with Power, Not Fear is a comprehensive guide by Ashwa Aashard that explores the concept of confidence as a nervous system state rather than a personality trait. The book delves into how the primal brain often hijacks our confidence through fear and hesitation, and shows how to retrain your system through small, consistent actions to lead authentically in public speaking, business, relationships, and more.'
                      });
                      setShowProductModal(true);
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Second Row: The Power Within + No More Confusion */}
          <View style={[styles.productsRow, { marginTop: 16 }]}>
            {/* The Power Within (moved to row 2) */}
            <TouchableOpacity 
              style={[styles.productWrapper, isNarrow && { flexBasis: '100%' }]}
              activeOpacity={0.8}
              onPress={() => {
                setActiveProduct({
                  title: 'The Power Within',
                  price: 500,
                  originalPrice: 1200,
                  image: require('../assets/icons/The power within.png'),
                  description:
                    'The Power Within: The Secret Behind Emotions You Didn’t Know unravels the hidden origins of emotions and how they continue to shape our lives today. Emotions evolved as powerful mechanisms to help us navigate challenges, make decisions, and survive. This book shows how understanding these roots gives you greater control over your life and growth.'
                });
                setShowProductModal(true);
              }}
            >
              <View style={styles.bookContainer}>
                <View style={styles.bookImageContainer}>
                  <Image 
                    source={require('../assets/icons/The power within.png')}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.bookContent}>
                  <Text style={styles.bookTitle}>The Power Within</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>was kes 1200</Text>
                    <Text style={styles.discountPrice}> and now ksh </Text>
                    <Text style={styles.finalPrice}>500</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={() => {
                      setActiveProduct({
                        title: 'The Power Within',
                        price: 500,
                        originalPrice: 1200,
                        image: require('../assets/icons/The power within.png'),
                        description:
                          'The Power Within: The Secret Behind Emotions You Didn’t Know unravels the hidden origins of emotions and how they continue to shape our lives today. Emotions evolved as powerful mechanisms to help us navigate challenges, make decisions, and survive. This book shows how understanding these roots gives you greater control over your life and growth.'
                      });
                      setShowProductModal(true);
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.productWrapper, isNarrow && { flexBasis: '100%' }]}
              activeOpacity={0.8}
              onPress={() => {
                setActiveProduct({
                  title: 'No More Confusion',
                  price: 400,
                  originalPrice: 1000,
                  image: require('../assets/icons/No more confusion.png'),
                  description:
                    'No More Confusion is a guide to uncovering your true calling and breaking free from mental fog. By understanding the psychology of decision-making and the hidden forces shaping your path, you’ll gain clarity and step into your true potential.'
                });
                setShowProductModal(true);
              }}
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
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>was kes 1000</Text>
                    <Text style={styles.discountPrice}> and now ksh </Text>
                    <Text style={styles.finalPrice}>400</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={() => {
                      setActiveProduct({
                        title: 'No More Confusion',
                        price: 400,
                        originalPrice: 1000,
                        image: require('../assets/icons/No more confusion.png'),
                        description:
                          'No More Confusion is a guide to uncovering your true calling and breaking free from mental fog. By understanding the psychology of decision-making and the hidden forces shaping your path, you’ll gain clarity and step into your true potential.'
                      });
                      setShowProductModal(true);
                    }}
                  >
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
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
              <Text style={styles.amountText}>Amount: KSH {(selectedProduct?.price ?? 400).toString()}</Text>
              <Text style={styles.recipientText}>Recipient: Great Awareness</Text>
              <Text style={styles.referenceText}>Reference: {selectedProduct?.title ?? 'Book Purchase'}</Text>
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
                  setSelectedProduct(null);
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

      {/* Product Details Modal */}
      <Modal
        visible={showProductModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeProduct && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <Image source={activeProduct.image} style={{ width: 120, height: 160, borderRadius: 8 }} resizeMode="contain" />
                </View>
                <Text style={[styles.headerTitle, { fontSize: 22, marginBottom: 8 }]}>{activeProduct.title}</Text>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 16 }}>{activeProduct.description}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.originalPrice}>was kes {activeProduct.originalPrice}</Text>
                  <Text style={styles.discountPrice}> and now ksh </Text>
                  <Text style={styles.finalPrice}>{activeProduct.price}</Text>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowProductModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => {
                      setSelectedProduct({ title: activeProduct.title, price: activeProduct.price });
                      setShowProductModal(false);
                      setShowPaymentModal(true);
                    }}
                  >
                    <Text style={styles.confirmButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </>
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
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  productWrapper: {
    flexGrow: 1,
    flexBasis: '48%',
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
