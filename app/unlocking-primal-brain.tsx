import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ArrowBackLeftIcon from '../assets/icons/arrow back left.svg';
import paymentService from '../services/paymentService';
import sheetStatusService from '../services/sheetStatusService';

import BlankStarIcon from '../assets/icons/blank star.svg';
import FullStarIcon from '../assets/icons/full star.svg';
import HeartCircleIcon from '../assets/icons/heart-circle.svg';


export default function UnlockingPrimalBrainPage() {
  const router = useRouter();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingTransactionId, setPendingTransactionId] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

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
      const amount = 400; // Price for the book
      const productTitle = 'Unlocking the Primal Brain';
      const result = await paymentService.sendSTKPush(phoneNumber, amount, 'pesaflux', productTitle);
      
      if (result && result.success) {
        if ('transactionId' in result && result.transactionId) {
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
      Alert.alert('No Transaction', 'No pending transaction to check');
      return;
    }
    
    setIsChecking(true);
    try {
      const status = await sheetStatusService.checkTransactionStatus(pendingTransactionId);
      
      if (status && status.success) {
        if (status.downloadUrl) {
          setDownloadUrl(status.downloadUrl as SetStateAction<null>);
          Alert.alert(
            'Payment Successful!', 
            'Your download is ready. Click Download to get your PDF.',
            [
              { 
                text: 'Download Now', 
                onPress: () => handleDownload(status.downloadUrl)
              },
              { text: 'Later' }
            ]
          );
        } else {
          Alert.alert('Payment Confirmed', 'Your payment was successful! The download link will be available shortly.');
        }
        setPaymentModalVisible(false);
      } else if (status && status.status === 'PENDING') {
        Alert.alert('Payment Pending', 'Your payment is still being processed. Please check again in a moment.');
      } else {
        Alert.alert('Payment Not Found', 'We couldn\'t find your payment. If you completed the payment, please try checking again in a few moments.');
      }
    } catch (error) {
      console.error('Check status error:', error);
      Alert.alert('Error', 'Failed to check payment status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleDownload = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open download URL');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to open download link');
    }
  };
  
  // The handleCheckPaymentStatus function is already defined above
  
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
        onPress={() => router.push('/(tabs)/favorites' as any)}
      >
        <HeartCircleIcon width={24} height={24} />
      </TouchableOpacity>
      
      <Image 
        source={require('../assets/icons/Unlocking the Primal Brain.png')} 
        style={styles.centerIcon} 
      />
      
      <Text style={styles.title}>Unlocking The primal Brain: The Hidden Force Shaping Your Thoughts & Emotions <Text style={styles.formatText}>(pdf.epub)</Text></Text>
      <Text style={styles.authorText}>by Ashwa Aashard</Text>
      <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            was <Text style={styles.originalPrice}>800</Text> now <Text style={styles.discountPrice}>400ksh</Text>
          </Text>
        </View>
        <View style={styles.starsContainer}>
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <FullStarIcon width={24} height={24} style={styles.star} />
          <BlankStarIcon width={24} height={24} style={styles.star} />
          <Text style={styles.ratingText}>4.6</Text>
        </View>
        <Text style={styles.reviewsText}>Reviews</Text>
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          Why do we procrastinate, overthink, or get trapped in destructive habits—even when we know better? 
          The answer lies deep within your primal brain, the ancient part of your mind that has been silently controlling your emotions, desires, and decisions since the dawn of time. 
          In this groundbreaking book, Ashwa Aashard unravels the secret mechanisms behind fear, addiction, motivation, and emotional reactions, showing you how to break free from unconscious patterns and take full control of your life. 
          Why do you react emotionally before you even think? 
          How does dopamine trick you into addiction, bad habits, and social media loops? 
          Why is your brain wired for fear, anger, and impulsive decisions—and how can you override it? 
          What practical steps can you take to break free from self-sabotage and master your emotions? 
          Combining neuroscience, psychology, and real-world insights, this book will teach you how to rewire your mind, master your emotions, and take charge of your future. 
          If you've ever felt like your brain is working against you, this book is the key to unlocking its full power. 
          Get your copy now and start taking control of your mind today!
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
              
              {downloadUrl && (
                <TouchableOpacity 
                  style={styles.downloadButton}
                  onPress={() => handleDownload(downloadUrl)}
                >
                  <Text style={styles.paymentOptionText}>
                    Download PDF
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
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    padding: 10,
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  centerIcon: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    marginTop: 80,
    resizeMode: 'contain',
  },
  title: {
    color: '#FF0000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
  },
  formatText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  authorText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 8,
  },
  priceContainer: {
    marginTop: 16,
    marginLeft: 20,
  },
  priceText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  discountPrice: {
    color: '#00AA00',
    fontSize: 28,
    fontWeight: 'bold',
  },
  originalPrice: {
    color: '#FF0000',
    textDecorationLine: 'line-through',
    fontSize: 16,
    fontWeight: 'normal',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 20,
  },

  star: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  ratingText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    alignSelf: 'center',
  },
  reviewsText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'normal',
    marginLeft: 20,
    marginTop: 8,
  },
  descriptionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
  },
  descriptionText: {
      fontSize: 14,
      color: '#333333',
      lineHeight: 20,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      textAlign: 'left',
    },
    grabCopyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000',
      marginLeft: 20,
      marginTop: 20,
      textAlign: 'left',
      flex: 1,
    },
    grabCopyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      marginTop: 10,
    },
    purchaseButton: {
      backgroundColor: 'rgb(255, 23, 50)', // E42F45 with 46% opacity
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginRight: 20,
    },
    purchaseButtonText: {
      color: '#D3E4DE', // White color for text
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
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
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: '100%',
  },
  paymentOption: {
    backgroundColor: 'rgb(41, 255, 13)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  paymentOptionText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkStatusButton: {
    backgroundColor: 'rgb(21, 248, 21)',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});