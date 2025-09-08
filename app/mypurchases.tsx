import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking, TextInput } from 'react-native';
import { supabaseService } from '../services/supabaseService';

export default function MyPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (phoneNumber && isAuthenticated) {
      loadPurchases();
    }
  }, [phoneNumber, isAuthenticated]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const purchasesData = await supabaseService.getAllPurchasesWithDownloadUrls(phoneNumber);
      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error loading purchases:', error);
      Alert.alert('Error', 'Failed to load your purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberSubmit = async (number: string) => {
    if (!number || number.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    const formattedNumber = number.startsWith('0') ? `+254${number.slice(1)}` : number;
    setPhoneNumber(formattedNumber);
    setIsAuthenticated(true);
  };

  const handleDownload = async (purchase: any) => {
    if (!purchase.download_url) {
      try {
        const newUrl = await supabaseService.generateTempDownloadUrl(purchase.book_id);
        if (newUrl) {
          Linking.openURL(newUrl);
        } else {
          Alert.alert('Error', 'Could not generate download link');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to generate download link');
      }
    } else {
      Linking.openURL(purchase.download_url);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhoneNumber = (number: string) => {
    return number.replace(/^\+254/, '0');
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>My Purchases</Text>
          <Text style={styles.subtitle}>Enter your phone number to access your purchased products</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number (e.g., 0712345678)"
              keyboardType="phone-pad"
              onChangeText={setPhoneNumber}
              value={phoneNumber}
            />
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={() => handlePhoneNumberSubmit(phoneNumber)}
            >
              <Text style={styles.authButtonText}>Access My Products</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your purchases...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Purchases</Text>
        <Text style={styles.phoneText}>Phone: {formatPhoneNumber(phoneNumber)}</Text>
        <TouchableOpacity onPress={() => setIsAuthenticated(false)}>
          <Text style={styles.changePhoneText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>

      {purchases.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No purchases found</Text>
          <Text style={styles.emptySubtext}>You haven't made any purchases yet</Text>
        </View>
      ) : (
        <View style={styles.purchasesList}>
          {purchases.map((purchase) => (
            <View key={purchase.id} style={styles.purchaseCard}>
              <View style={styles.purchaseInfo}>
                <Text style={styles.productName}>{purchase.book_id}</Text>
                <Text style={styles.purchaseDate}>{formatDate(purchase.purchase_date)}</Text>
                <Text style={styles.purchaseAmount}>KES {purchase.amount}</Text>
                <Text style={styles.transactionId}>Transaction: {purchase.transaction_id}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownload(purchase)}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={loadPurchases}>
        <Text style={styles.refreshButtonText}>Refresh Purchases</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  phoneText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  changePhoneText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  authButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  purchasesList: {
    padding: 15,
  },
  purchaseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchaseInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  purchaseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  purchaseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 3,
  },
  transactionId: {
    fontSize: 12,
    color: '#999',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});