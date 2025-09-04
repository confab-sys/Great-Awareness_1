import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import googleSheetService from '../services/googleSheetService';
import googleSheetWriter from '../services/googleSheetWriter';
import ipService from '../services/ipService';
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
  const [isChecking, setIsChecking] = useState(false);
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [autoCheckInterval, setAutoCheckInterval] = useState<number | null>(null);
  const [isAutoChecking, setIsAutoChecking] = useState(false);
  const [lastPaymentAttempt, setLastPaymentAttempt] = useState<{
    phoneNumber: string;
    productTitle: string;
    amount: number;
    timestamp: number;
  } | null>(null);
  const { width } = useWindowDimensions();
  const isNarrow = width < 480;

  const DOWNLOAD_LINKS: Record<string, string> = {
    'Unlocking the Primal Brain': 'https://drive.google.com/file/d/1_wIIkiGz6yDPdMupfqUmTbM2cYm_u7AJ/view?usp=drive_link',
    'The Confidence Map': 'https://drive.google.com/file/d/1m8VHhQzvVBhzIKMfFQRFQwvKRoO9Xtr4/view?usp=drive_link',
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      Alert.alert('Empty Phone Number', 'Please enter any phone number');
      return;
    }

    setIsProcessing(true);
    setDownloadLink(null);
    console.log('Starting payment process with phone number:', phoneNumber);
    
    try {
      // Use paymentService with PesaFlux provider
      const amount = selectedProduct?.price ?? 400;
      const productTitle = selectedProduct?.title ?? 'Unknown Product';
      console.log('Calling paymentService.sendSTKPush with:', phoneNumber, amount, 'pesaflux', productTitle);
      const result = await paymentService.sendSTKPush(phoneNumber, amount, 'pesaflux', productTitle);
      console.log('Payment API response:', result);
      
             if (result && result.success) {
         console.log('Payment request successful, transaction ID:', (result as any).transactionId);
         // Store transaction id for status check
         if ((result as any).transactionId) {
           setPendingTransactionId((result as any).transactionId);
         }
         
         // Store payment attempt details for background checking
         setLastPaymentAttempt({
           phoneNumber: phoneNumber,
           productTitle: selectedProduct?.title || activeProduct?.title || '',
           amount: selectedProduct?.price || activeProduct?.price || 0,
           timestamp: Date.now()
         });
         
         Alert.alert(
           'Payment Request Sent!', 
           'Approve the M-Pesa prompt on your phone. We will automatically check for payment confirmation every 5 seconds.',
           [{ text: 'OK' }]
         );
         
         // Start automatic payment checking after 5 seconds
         setTimeout(() => {
           startAutoCheck();
         }, 5000);
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

  const handleCheckPaymentStatus = async () => {
    try {
      if (!pendingTransactionId) {
        Alert.alert('No Transaction', 'There is no pending transaction to check.');
        return false;
      }
      
      setIsChecking(true);
      console.log('🔍 Checking PesaFlux transaction status for ID:', pendingTransactionId);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
      });
      
      // Check transaction status using PesaFlux API
      const statusPromise = paymentService.checkTransactionStatus(pendingTransactionId);
      const statusResult = await Promise.race([statusPromise, timeoutPromise]) as any;
      
      console.log('📊 PesaFlux transaction status result:', statusResult);
      
      if (statusResult.success) {
        console.log('✅ Transaction found in PesaFlux:', statusResult);
        
        // Check if the transaction status indicates success
        // PesaFlux uses different status codes, typically "200" means success
        const status = (statusResult as any).status || (statusResult as any).transactionCode || 'Unknown';
        const resultCode = (statusResult as any).ResultCode || 'Unknown';
        const transactionStatus = (statusResult as any).TransactionStatus || 'Unknown';
        
        console.log('🔍 Checking payment status:', { 
          status, 
          resultCode, 
          transactionStatus,
          fullResponse: statusResult 
        });
        
        // Check multiple success indicators - be more flexible with status codes
        const isSuccess = status === 'SUCCESS' || status === 'COMPLETED' || status === '200' || 
            resultCode === '200' || resultCode === 200 || 
            transactionStatus === 'SUCCESS' ||
            status === '0' || resultCode === '0' || // Some providers use 0 for success
            status === '1' || resultCode === '1' || // Some providers use 1 for success
            transactionStatus === 'COMPLETED' || // Add this for PesaFlux
            status.toUpperCase() === 'COMPLETED'; // Case-insensitive check for "Completed"
        
        console.log('✅ Success check result:', isSuccess);
        
        if (isSuccess) {
          console.log('🎉 Payment confirmed via PesaFlux for product:', selectedProduct?.title || activeProduct?.title);
          
          const productTitle = selectedProduct?.title || activeProduct?.title || '';
          const expectedAmount = selectedProduct?.price || activeProduct?.price || 0;
          const actualAmount = Number((statusResult as any).amount) || Number((statusResult as any).TransactionAmount) || 0;
          
          console.log('💰 Amount comparison:', { 
            expectedAmount, 
            actualAmount, 
            productTitle,
            rawAmount: (statusResult as any).amount,
            rawTransactionAmount: (statusResult as any).TransactionAmount
          });
          
          // Check if the amount matches the expected amount for the product
          // Allow for small differences due to type conversion
          if (Math.abs(actualAmount - expectedAmount) > 0.01) {
            console.log('⚠️ Amount mismatch! Expected:', expectedAmount, 'Actual:', actualAmount);
            Alert.alert('Amount Mismatch', `Payment amount (KSH ${actualAmount}) doesn't match expected amount (KSH ${expectedAmount}) for ${productTitle}`);
            return false;
          }
          
          // Log ALL successful transactions to Google Sheet (not just Confidence Map)
          try {
            console.log('📝 Attempting to log transaction to Google Sheet for product:', productTitle);
            googleSheetWriter.logSuccessfulTransaction({
              transactionId: (statusResult as any).transactionId || pendingTransactionId || 'unknown',
              amount: (statusResult as any).amount || expectedAmount.toString() || 'unknown',
              phoneNumber: phoneNumber || 'unknown',
              product: productTitle,
              status: 'CONFIRMED',
              receipt: (statusResult as any).transactionReceipt || (statusResult as any).receipt || 'unknown'
            }).then(() => {
              console.log('✅ Successfully logged transaction to Google Sheet');
            }).catch(error => {
              console.error('❌ Error logging transaction to Google Sheet:', error);
            });
          } catch (error) {
            console.error('❌ Error setting up Google Sheet logging:', error);
          }
          
          // Special handling for "The Confidence Map" - automatic download with IP tracking
          if (productTitle === 'The Confidence Map') {
            try {
              // Get user's IP address
              const ipInfo = await ipService.getDetailedIPInfo();
              console.log('📍 User IP Info:', ipInfo);
              
              // Log the successful purchase with IP and phone number
              console.log('✅ Confidence Map purchase confirmed:', {
                product: productTitle,
                phoneNumber: phoneNumber,
                ipAddress: ipInfo.ip,
                location: `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`,
                transactionId: (statusResult as any).transactionId || 'unknown',
                amount: (statusResult as any).amount || 'unknown',
                receipt: (statusResult as any).transactionReceipt || 'unknown'
              });
              
              // Log transaction to Google Sheet
              try {
                console.log('📝 Attempting to log Confidence Map transaction to Google Sheet');
                await googleSheetWriter.logSuccessfulTransaction({
                  transactionId: (statusResult as any).transactionId || pendingTransactionId || 'unknown',
                  amount: (statusResult as any).amount || expectedAmount.toString() || 'unknown',
                  phoneNumber: phoneNumber || 'unknown',
                  product: productTitle,
                  status: 'CONFIRMED',
                  receipt: (statusResult as any).transactionReceipt || (statusResult as any).receipt || 'unknown'
                });
                console.log('✅ Successfully logged Confidence Map transaction to Google Sheet');
              } catch (error) {
                console.error('❌ Error directly logging Confidence Map to Google Sheet:', error);
              }
              
              // Set download link and automatically trigger download
              const url = DOWNLOAD_LINKS[productTitle];
              console.log('🔗 Download URL for The Confidence Map:', url);
              
              if (url) {
                setDownloadLink(url);
                console.log('📥 Download link set for The Confidence Map');
                
                // Automatically open the download link
                 console.log('🚀 Attempting to open download link automatically...');
                 
                 // Try to open the URL immediately
                 Linking.canOpenURL(url).then((supported) => {
                   console.log('🔗 Can open URL:', supported);
                   if (supported) {
                     return Linking.openURL(url);
                   } else {
                     console.log('❌ URL not supported, trying alternative approach');
                     // Try alternative URL format
                     const alternativeUrl = url.replace('drive.google.com/uc?export=download', 'drive.google.com/file/d') + '/view?usp=sharing';
                     console.log('🔗 Trying alternative URL:', alternativeUrl);
                     return Linking.openURL(alternativeUrl);
                   }
                 }).then(() => {
                   console.log('✅ Download link opened successfully');
                 }).catch((error) => {
                   console.error('❌ Error opening download link:', error);
                   // Try one more time with a different approach
                setTimeout(() => {
                     console.log('🔄 Retrying download link...');
                     Linking.openURL(url).catch((retryError) => {
                       console.error('❌ Retry failed:', retryError);
                     });
                   }, 2000);
                 });
                
                Alert.alert(
                  'Purchase Successful! 🎉', 
                  `Your download is starting automatically.\n\nPurchase Details:\n• Product: ${productTitle}\n• Phone: ${phoneNumber}\n• Amount: KSH ${(statusResult as any).amount || 'unknown'}\n• Receipt: ${(statusResult as any).transactionReceipt || 'unknown'}\n• IP: ${ipInfo.ip}\n• Location: ${ipInfo.city || 'Unknown'}, ${ipInfo.country || 'Unknown'}`,
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('Error handling Confidence Map download:', error);
              // Fallback to normal download link display
              const url = DOWNLOAD_LINKS[productTitle];
              if (url) {
                setDownloadLink(url);
                console.log('📥 Download link set for The Confidence Map (fallback)');
              }
            }
          }
          // Show download link for other products with downloads
          else if (productTitle === 'Unlocking the Primal Brain') {
            const url = DOWNLOAD_LINKS[productTitle];
            if (url) {
              setDownloadLink(url);
              console.log(`📥 Download link set for ${productTitle}`);
               
               // Automatically open the download link
               console.log('🚀 Attempting to open download link automatically...');
               Linking.openURL(url).then(() => {
                 console.log('✅ Download link opened successfully');
               }).catch((error) => {
                 console.error('❌ Error opening download link:', error);
               });
            }
          } else {
            Alert.alert('Payment Confirmed', `Payment confirmed successfully.\n\nReceipt: ${(statusResult as any).transactionReceipt || 'unknown'}\nAmount: KSH ${(statusResult as any).amount || 'unknown'}`);
          }
          
          // Stop auto-checking since payment is confirmed
          stopAutoCheck();
          return true; // Return true to indicate successful confirmation
        } else {
          console.log('⏳ Payment found but not confirmed yet. Status:', status);
          if (!isAutoChecking) {
            Alert.alert('Payment Pending', `Payment found but status is: ${status}. Please wait for confirmation.`);
          }
          return false; // Return false to indicate not yet confirmed
        }
      } else {
        console.log('❌ Transaction not found or failed:', statusResult.message);
        if (!isAutoChecking) {
          Alert.alert('Payment Not Found', `No payment found for this transaction. ${statusResult.message || 'Please ensure payment was completed and try again.'}`);
        }
        return false; // Return false to indicate not found
      }
    } catch (err) {
      console.error('❌ Status check error:', err);
      if (!isAutoChecking) {
        Alert.alert('Error', 'Failed to check payment status. Please try again.');
      }
      return false; // Return false to indicate error
    } finally {
      setIsChecking(false);
    }
  };

  // Function to start automatic payment checking
  const startAutoCheck = () => {
    if (autoCheckInterval) {
      clearInterval(autoCheckInterval);
    }
    
    setIsAutoChecking(true);
    console.log('🔄 Starting automatic payment check every 5 seconds...');
    
    const interval = setInterval(async () => {
      console.log('🔄 Auto-checking payment status...');
      const isConfirmed = await handleCheckPaymentStatus();
      
      if (isConfirmed) {
        console.log('✅ Payment confirmed via auto-check, stopping auto-check');
        stopAutoCheck();
      }
    }, 5000); // Check every 5 seconds
    
    setAutoCheckInterval(interval);
  };

  // Background payment detection that runs independently of the modal - DISABLED
  const checkForRecentPayments = async () => {
    // This function is now disabled - transactions will be pushed directly when confirmed
    console.log('⏸️ Google Sheet polling disabled - transactions will be pushed when confirmed');
    return;
  };

  // Handle successful payment detection
  const handleSuccessfulPayment = async (paymentResult: any, productTitle: string) => {
    console.log('🎉 Payment confirmed for product:', productTitle);
    console.log('📊 Payment result:', paymentResult);
    
    // Extract transaction details (works with both PesaFlux API and Google Sheet data)
    const transactionId = (paymentResult as any).transactionId || (paymentResult as any).transaction?.transaction_id || 'unknown';
    const amount = (paymentResult as any).amount || (paymentResult as any).transaction?.amount || 'unknown';
    const receipt = (paymentResult as any).transactionReceipt || (paymentResult as any).receipt || (paymentResult as any).transaction?.receipt || 'unknown';
    const phoneNumber = paymentResult.phoneNumber || lastPaymentAttempt?.phoneNumber || 'unknown';
    
    // Log successful transaction to Google Sheet
    try {
      console.log('📊 Logging transaction to Google Sheet with:', {
        transactionId, amount, phoneNumber, productTitle, receipt
      });
      
      // Call logSuccessfulTransaction with an object containing all parameters
      await googleSheetWriter.logSuccessfulTransaction({
        transactionId,
        amount,
        phoneNumber,
        product: productTitle,
        status: 'CONFIRMED',
        receipt
      });
      console.log('✅ Successfully logged transaction to Google Sheet');
    } catch (error) {
      console.error('❌ Error logging to Google Sheet:', error);
    }
    
    // Special handling for "The Confidence Map" - automatic download with IP tracking
    if (productTitle === 'The Confidence Map') {
      try {
        // Get user's IP address
        const ipInfo = await ipService.getDetailedIPInfo();
        console.log('📍 User IP Info:', ipInfo);
        
        // Log the successful purchase with IP and phone number
        console.log('✅ Confidence Map purchase confirmed:', {
          product: productTitle,
          phoneNumber: phoneNumber,
          ipAddress: ipInfo.ip,
          location: `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`,
          transactionId: transactionId,
          amount: amount,
          receipt: receipt,
          source: paymentResult.transaction ? 'Google Sheet' : 'PesaFlux API'
        });
        
        // Set download link and automatically trigger download
        const url = DOWNLOAD_LINKS[productTitle];
        if (url) {
          setDownloadLink(url);
          console.log('📥 Download link set for The Confidence Map');
          
          // Automatically open the download link
          console.log('🚀 Attempting to open download link automatically...');
          setTimeout(() => {
            Linking.openURL(url).then(() => {
              console.log('✅ Download link opened successfully');
            }).catch((error) => {
              console.error('❌ Error opening download link:', error);
            });
          }, 1000);
          
          Alert.alert(
            'Purchase Successful! 🎉', 
            `Your download is starting automatically.\n\nPurchase Details:\n• Product: ${productTitle}\n• Phone: ${phoneNumber}\n• Amount: KSH ${amount}\n• Receipt: ${receipt}\n• IP: ${ipInfo.ip}\n• Location: ${ipInfo.city || 'Unknown'}, ${ipInfo.country || 'Unknown'}\n• Source: ${paymentResult.transaction ? 'Google Sheet' : 'PesaFlux API'}`,
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error handling Confidence Map download:', error);
        // Fallback to normal download link display
        const url = DOWNLOAD_LINKS[productTitle];
        if (url) {
          setDownloadLink(url);
          console.log('📥 Download link set for The Confidence Map (fallback)');
        }
      }
    }
    // Show download link for other products with downloads
    else if (productTitle === 'Unlocking the Primal Brain') {
      const url = DOWNLOAD_LINKS[productTitle];
      if (url) {
        setDownloadLink(url);
        console.log(`📥 Download link set for ${productTitle}`);
      }
    } else {
      Alert.alert('Payment Confirmed', `Payment confirmed successfully.\n\nReceipt: ${receipt}\nAmount: KSH ${amount}`);
    }
    
    // Stop auto-checking and clear payment attempt
    stopAutoCheck();
    setLastPaymentAttempt(null);
    setPendingTransactionId(null);
  };

  // Function to stop automatic payment checking
  const stopAutoCheck = () => {
    if (autoCheckInterval) {
      clearInterval(autoCheckInterval);
      setAutoCheckInterval(null);
    }
    setIsAutoChecking(false);
    console.log('🛑 Stopped automatic payment checking');
  };

    

  // Background payment detection interval - DISABLED to prevent pulling from Google Sheet
  useEffect(() => {
    let backgroundInterval: number | null = null;
    
    // Background checking is now disabled - only push transactions when confirmed
    console.log('⏸️ Background payment detection disabled - will only push transactions when confirmed');
    
    // Cleanup on unmount
    return () => {
      if (autoCheckInterval) {
        clearInterval(autoCheckInterval);
      }
      if (backgroundInterval) {
        clearInterval(backgroundInterval);
      }
    };
  }, [lastPaymentAttempt, autoCheckInterval]);





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
                  price: 1,
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
                    <Text style={styles.finalPrice}>1</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.buyButton}
                    onPress={() => {
                      setActiveProduct({
                        title: 'The Confidence Map',
                        price: 1,
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
                  image: require('../assets/icons/The Power Within.png'),
                  description:
                    'The Power Within: The Secret Behind Emotions You Didn’t Know unravels the hidden origins of emotions and how they continue to shape our lives today. Emotions evolved as powerful mechanisms to help us navigate challenges, make decisions, and survive. This book shows how understanding these roots gives you greater control over your life and growth.'
                });
                setShowProductModal(true);
              }}
            >
              <View style={styles.bookContainer}>
                <View style={styles.bookImageContainer}>
                  <Image 
                    source={require('../assets/icons/The Power Within.png')}
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
                        image: require('../assets/icons/The Power Within.png'),
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
                  setPendingTransactionId(null);
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

                         {/* Status Check Button */}
             <View style={[styles.modalButtons, { marginTop: 12 }]}>
                 <TouchableOpacity 
                   style={[styles.modalButton, { backgroundColor: pendingTransactionId ? '#0d6efd' : '#CCCCCC' }]}
                   onPress={handleCheckPaymentStatus}
                   disabled={!pendingTransactionId || isChecking || isAutoChecking}
                 >
                   <Text style={[styles.confirmButtonText, { color: '#FFFFFF' }]}>
                     {isChecking ? 'Checking...' : isAutoChecking ? 'Auto-Checking...' : 'Check Payment Status'}
                   </Text>
                 </TouchableOpacity>
             </View>
              
              

             

                           {/* Auto-Checking Status */}
              {isAutoChecking && (
                <View style={styles.autoCheckingContainer}>
                  <Text style={styles.autoCheckingText}>🔄 Automatically checking payment status...</Text>
                  <Text style={styles.autoCheckingSubtext}>Please wait while we verify your payment</Text>
                </View>
              )}

                             

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
   autoCheckingContainer: {
     alignItems: 'center',
     marginTop: 16,
     padding: 16,
     backgroundColor: '#E3F2FD',
     borderRadius: 8,
     borderWidth: 1,
     borderColor: '#2196F3',
   },
   autoCheckingText: {
     fontSize: 16,
     fontFamily: 'PublicSans_700Bold',
     color: '#1976D2',
     marginBottom: 4,
   },
       autoCheckingSubtext: {
      fontSize: 14,
      color: '#666',
    },
    backgroundPaymentStatus: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#FFF3CD',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FFEAA7',
    },
    backgroundPaymentText: {
      fontSize: 14,
      fontFamily: 'PublicSans_700Bold',
      color: '#856404',
      textAlign: 'center',
      marginBottom: 4,
    },
         backgroundPaymentSubtext: {
       fontSize: 12,
       color: '#856404',
       textAlign: 'center',
     },
     
  });
