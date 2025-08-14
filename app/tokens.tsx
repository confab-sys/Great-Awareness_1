import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useRouter } from 'expo-router';

export default function TokensPage() {
  const router = useRouter();
  
  const tokenLogoSvg = `<svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.226 11V2.8775H0.290996V1.64C0.910996 1.64 1.411 1.5825 1.791 1.4675C2.176 1.3475 2.4635 1.1775 2.6535 0.957499C2.8435 0.732499 2.956 0.464999 2.991 0.154999H4.446V11H2.226ZM10.907 11.165C9.59201 11.165 8.56451 10.6875 7.82451 9.7325C7.08951 8.7775 6.72201 7.4025 6.72201 5.6075C6.72201 4.4075 6.89201 3.39 7.23201 2.555C7.57201 1.72 8.05451 1.0875 8.67951 0.657499C9.30451 0.222499 10.047 0.0049994 10.907 0.0049994C12.197 0.0049994 13.2145 0.4875 13.9595 1.4525C14.7045 2.4125 15.077 3.795 15.077 5.6C15.077 7.395 14.7095 8.7725 13.9745 9.7325C13.2395 10.6875 12.217 11.165 10.907 11.165ZM10.907 9.3725C11.552 9.3725 12.0245 9.085 12.3245 8.51C12.6245 7.93 12.7745 6.9625 12.7745 5.6075C12.7745 4.2225 12.622 3.23 12.317 2.63C12.012 2.03 11.5395 1.73 10.8995 1.73C10.2595 1.73 9.78201 2.0325 9.46701 2.6375C9.15701 3.2425 9.00201 4.2325 9.00201 5.6075C9.00201 6.9575 9.15701 7.9225 9.46701 8.5025C9.77701 9.0825 10.257 9.3725 10.907 9.3725ZM20.531 11.165C19.216 11.165 18.1885 10.6875 17.4485 9.7325C16.7135 8.7775 16.346 7.4025 16.346 5.6075C16.346 4.4075 16.516 3.39 16.856 2.555C17.196 1.72 17.6785 1.0875 18.3035 0.657499C18.9285 0.222499 19.671 0.0049994 20.531 0.0049994C21.821 0.0049994 22.8385 0.4875 23.5835 1.4525C24.3285 2.4125 24.701 3.795 24.701 5.6C24.701 7.395 24.3335 8.7725 23.5985 9.7325C22.8635 10.6875 21.841 11.165 20.531 11.165ZM20.531 9.3725C21.176 9.3725 21.6485 9.085 21.9485 8.51C22.2485 7.93 22.3985 6.9625 22.3985 5.6075C22.3985 4.2225 22.246 3.23 21.941 2.63C21.636 2.03 21.1635 1.73 20.5235 1.73C19.8835 1.73 19.406 2.0325 19.091 2.6375C18.781 3.2425 18.626 4.2325 18.626 5.6075C18.626 6.9575 18.781 7.9225 19.091 8.5025C19.401 9.0825 19.881 9.3725 20.531 9.3725Z" fill="#E42F45"/></svg>`;
  
  const tokenIconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#E42F45"/><path d="M7 12L10 15L17 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  
  const greenSquareSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="4" fill="#E42F45"/></svg>`;

  const tokens = [
    { id: '1', name: 'CONSCIOUS', symbol: 'CON', price: '$0.25', change: '+12.5%', owned: '1,250 CON' },
    { id: '2', name: 'AWARENESS', symbol: 'AWE', price: '$0.18', change: '+8.3%', owned: '850 AWE' },
    { id: '3', name: 'GREATNESS', symbol: 'GRE', price: '$0.42', change: '+15.7%', owned: '500 GRE' },
  ];

  const transactions = [
    { id: '1', type: 'BUY', token: 'CON', amount: '500 CON', price: '$0.24', date: '2024-01-15' },
    { id: '2', type: 'SELL', token: 'AWE', amount: '200 AWE', price: '$0.19', date: '2024-01-14' },
    { id: '3', type: 'BUY', token: 'GRE', amount: '100 GRE', price: '$0.40', date: '2024-01-13' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Token Management</Text>
          <Text style={styles.subtitle}>Manage your digital assets</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Tokens</Text>
          {tokens.map((token) => (
            <View key={token.id} style={styles.tokenCard}>
              <View style={styles.tokenInfo}>
                <SvgXml xml={tokenIconSvg} width={32} height={32} />
                <View style={styles.tokenDetails}>
                  <Text style={styles.tokenName}>{token.name} ({token.symbol})</Text>
                  <Text style={styles.tokenPrice}>{token.price}</Text>
                  <Text style={styles.tokenChange}>{token.change}</Text>
                </View>
              </View>
              <View style={styles.tokenActions}>
                <Text style={styles.tokenOwned}>{token.owned}</Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>BUY</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={styles.transactionType}>
                <Text style={[styles.transactionTypeText, { color: tx.type === 'BUY' ? '#E42F45' : '#E42F45' }]}>
                  {tx.type}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionToken}>{tx.amount} {tx.token}</Text>
                <Text style={styles.transactionPrice}>{tx.price}</Text>
              </View>
              <Text style={styles.transactionDate}>{tx.date}</Text>
            </View>
          ))}
        </View>

        <View style={styles.emptyState}>
          <SvgXml xml={greenSquareSvg} width={60} height={60} />
          <Text style={styles.emptyText}>No more transactions</Text>
          <Text style={styles.emptySubtext}>Your transaction history appears here</Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/hello_conscious_one')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E42F4520',
  },
  title: {
    fontSize: 32,
    fontFamily: 'PublicSans_700Bold',
    color: '#E42F45',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PublicSans_700Bold',
    color: '#E42F45',
    marginBottom: 15,
  },
  tokenCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E42F4530',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenDetails: {
    marginLeft: 12,
  },
  tokenName: {
    fontSize: 16,
    fontFamily: 'PublicSans_700Bold',
    color: '#FFFFFF',
  },
  tokenPrice: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  tokenChange: {
    fontSize: 12,
    color: '#E42F45',
    marginTop: 2,
  },
  tokenActions: {
    alignItems: 'flex-end',
  },
  tokenOwned: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#E42F45',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'PublicSans_700Bold',
    fontSize: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  transactionType: {
    width: 50,
  },
  transactionTypeText: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 14,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 15,
  },
  transactionToken: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'PublicSans_700Bold',
  },
  transactionPrice: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#E42F45',
    marginTop: 10,
    fontFamily: 'PublicSans_700Bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 5,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#E42F45',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    elevation: 3,
  },
  backButtonText: {
    fontFamily: 'PublicSans_700Bold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});