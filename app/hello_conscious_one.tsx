import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

export default function HelloConsciousOne() {
  const router = useRouter();
  const tokenLogoSvg = `<svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.226 11V2.8775H0.290996V1.64C0.910996 1.64 1.411 1.5825 1.791 1.4675C2.176 1.3475 2.4635 1.1775 2.6535 0.957499C2.8435 0.732499 2.956 0.464999 2.991 0.154999H4.446V11H2.226ZM10.907 11.165C9.59201 11.165 8.56451 10.6875 7.82451 9.7325C7.08951 8.7775 6.72201 7.4025 6.72201 5.6075C6.72201 4.4075 6.89201 3.39 7.23201 2.555C7.57201 1.72 8.05451 1.0875 8.67951 0.657499C9.30451 0.222499 10.047 0.0049994 10.907 0.0049994C12.197 0.0049994 13.2145 0.4875 13.9595 1.4525C14.7045 2.4125 15.077 3.795 15.077 5.6C15.077 7.395 14.7095 8.7725 13.9745 9.7325C13.2395 10.6875 12.217 11.165 10.907 11.165ZM10.907 9.3725C11.552 9.3725 12.0245 9.085 12.3245 8.51C12.6245 7.93 12.7745 6.9625 12.7745 5.6075C12.7745 4.2225 12.622 3.23 12.317 2.63C12.012 2.03 11.5395 1.73 10.8995 1.73C10.2595 1.73 9.78201 2.0325 9.46701 2.6375C9.15701 3.2425 9.00201 4.2325 9.00201 5.6075C9.00201 6.9575 9.15701 7.9225 9.46701 8.5025C9.77701 9.0825 10.257 9.3725 10.907 9.3725ZM20.531 11.165C19.216 11.165 18.1885 10.6875 17.4485 9.7325C16.7135 8.7775 16.346 7.4025 16.346 5.6075C16.346 4.4075 16.516 3.39 16.856 2.555C17.196 1.72 17.6785 1.0875 18.3035 0.657499C18.9285 0.222499 19.671 0.0049994 20.531 0.0049994C21.821 0.0049994 22.8385 0.4875 23.5835 1.4525C24.3285 2.4125 24.701 3.795 24.701 5.6C24.701 7.395 24.3335 8.7725 23.5985 9.7325C22.8635 10.6875 21.841 11.165 20.531 11.165ZM20.531 9.3725C21.176 9.3725 21.6485 9.085 21.9485 8.51C22.2485 7.93 22.3985 6.9625 22.3985 5.6075C22.3985 4.2225 22.246 3.23 21.941 2.63C21.636 2.03 21.1635 1.73 20.5235 1.73C19.8835 1.73 19.406 2.0325 19.091 2.6375C18.781 3.2425 18.626 4.2325 18.626 5.6075C18.626 6.9575 18.781 7.9225 19.091 8.5025C19.401 9.0825 19.881 9.3725 20.531 9.3725Z" fill="#E42F45"/></svg>`;
  const redSquareSvg = `<svg width="147" height="162" viewBox="0 0 147 162" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="147" height="162" rx="16" fill="#E42F45"/></svg>`;
  
  const callIconSvg = `<svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10"/><path d="M18.5 9C18.5 8.4 18.03 7.48 17.33 6.73C16.69 6.04 15.84 5.5 15 5.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 9C22 5.13 18.87 2 15 2" stroke="black" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  
  const messageIconSvg = `<svg width="50" height="50" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M53.125 28.125C53.125 40.2187 42.625 50 29.6875 50L26.7813 53.5L25.0625 55.5626C23.5938 57.3126 20.7812 56.9375 19.8125 54.8437L15.625 45.6249C9.9375 41.6249 6.25 35.2812 6.25 28.125C6.25 16.0313 16.75 6.25 29.6875 6.25C39.125 6.25 47.2813 11.4688 50.9375 18.9688C52.3438 21.75 53.125 24.8438 53.125 28.125Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M68.75 40.1874C68.75 47.3437 65.0625 53.6875 59.375 57.6875L55.1875 66.9061C54.2188 68.9999 51.4062 69.4063 49.9375 67.625L45.3125 62.0624C37.75 62.0624 31 58.7187 26.7813 53.5L29.6875 50C42.625 50 53.125 40.2187 53.125 28.125C53.125 24.8437 52.3438 21.75 50.9375 18.9688C61.1563 21.3125 68.75 29.9374 68.75 40.1874Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.875 28.125H37.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  
  const videoIconSvg = `<svg width="50" height="50" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M68.75 46.875V28.125C68.75 12.5 62.5 6.25 46.875 6.25H28.125C12.5 6.25 6.25 12.5 6.25 28.125V46.875C6.25 62.5 12.5 68.75 28.125 68.75H46.875C62.5 68.75 68.75 62.5 68.75 46.875Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.875 22.2188H67.125" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M26.625 6.59375V21.7812" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M48.375 6.59375V20.375" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.4688 45.1564V41.4064C30.4688 36.5939 33.875 34.6251 38.0313 37.0314L41.2813 38.9064L44.5312 40.7814C48.6875 43.1876 48.6875 47.1251 44.5312 49.5314L41.2813 51.4064L38.0313 53.2814C33.875 55.6876 30.4688 53.7189 30.4688 48.9064V45.1564V45.1564Z" stroke="black" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  
  const tokenIconSvg = `<svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M16.19 2.33002H7.82001C4.18001 2.33002 2.01001 4.50002 2.01001 8.14002V16.51C2.01001 20.15 4.18001 22.32 7.82001 22.32H16.19C19.83 22.32 22 20.15 22 16.51V8.15002C22 4.51002 19.83 2.33002 16.19 2.33002Z" fill="black"/><path d="M16.4 8.21002L12.64 6.18002C12.24 5.97002 11.77 5.97002 11.37 6.18002L7.60999 8.21002C7.33999 8.36002 7.17001 8.65002 7.17001 8.98002C7.17001 9.31002 7.33999 9.60002 7.60999 9.75002L11.37 11.78C11.57 11.89 11.79 11.94 12.01 11.94C12.23 11.94 12.45 11.89 12.65 11.78L16.41 9.75002C16.68 9.60002 16.85 9.31002 16.85 8.98002C16.84 8.65002 16.67 8.36002 16.4 8.21002Z" fill="black"/><path d="M10.74 12.47L7.23999 10.72C6.96999 10.59 6.65999 10.6 6.39999 10.76C6.13999 10.92 5.98999 11.19 5.98999 11.49V14.8C5.98999 15.37 6.31001 15.89 6.82001 16.14L10.32 17.89C10.44 17.95 10.57 17.98 10.71 17.98C10.87 17.98 11.02 17.94 11.16 17.85C11.42 17.69 11.57 17.42 11.57 17.12V13.81C11.57 13.24 11.26 12.73 10.74 12.47Z" fill="black"/><path d="M17.59 10.76C17.33 10.6 17.02 10.59 16.75 10.72L13.25 12.47C12.74 12.73 12.42 13.24 12.42 13.81V17.12C12.42 17.42 12.57 17.69 12.83 17.85C12.97 17.94 13.12 17.98 13.28 17.98C13.41 17.98 13.54 17.95 13.67 17.89L17.17 16.14C17.68 15.88 18 15.37 18 14.8V11.49C18 11.19 17.85 10.92 17.59 10.76Z" fill="black"/></svg>`;


  

  
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.greatAwarenessTopLeft}>Great Awareness</Text>
        <View style={styles.textContainer}>
          <Text style={styles.helloText}>Hello Conscious One</Text>
        </View>
        <View style={styles.iconGrid}>
          <View style={styles.iconRow}>
            <View style={styles.iconContainer}>
              <SvgXml xml={redSquareSvg} style={styles.redSquareIcon} />
              <View style={styles.iconOverlay}>
                <SvgXml xml={callIconSvg} />
                <Text style={styles.iconText}>Reach out Great Awareness</Text>
              </View>
            </View>
                         <TouchableOpacity 
               style={styles.iconContainer}
               onPress={() => Linking.openURL('https://chat.whatsapp.com/K2l97vmql8YDRIaIE9A4vq?mode=ac_t')}
             >
               <SvgXml xml={redSquareSvg} style={styles.redSquareIcon} />
               <View style={styles.iconOverlay}>
                 <SvgXml xml={messageIconSvg} />
                 <Text style={styles.iconText}>join Our Community</Text>
               </View>
             </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
                         <TouchableOpacity 
               style={styles.iconContainer}
               onPress={() => router.push('/newsletter-videos')}
             >
               <SvgXml xml={redSquareSvg} style={styles.redSquareIcon} />
               <View style={styles.iconOverlay}>
                 <SvgXml xml={videoIconSvg} />
                 <Text style={styles.iconText}>News Letter & Video</Text>
               </View>
             </TouchableOpacity>
                         <TouchableOpacity 
               style={styles.iconContainer}
               onPress={() => router.push('/tokens')}
             >
               <SvgXml xml={redSquareSvg} style={styles.redSquareIcon} />
               <View style={styles.iconOverlay}>
                 <SvgXml xml={tokenIconSvg} />
                 <Text style={[styles.iconText, {bottom: 30, fontSize: 12}]}>Recharge</Text>
                 <Text style={[styles.iconText, {bottom: 10, fontSize: 12}]}>tokens</Text>
               </View>
             </TouchableOpacity>
          </View>
        </View>
        <SvgXml xml={tokenLogoSvg} style={styles.tokenLogo} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3E4DE',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  textCol: {
    gap: 8,
  },
  title: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 28,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 18,
    color: '#000',
  },
  words: {
    alignItems: 'flex-start',
    gap: 0,
    marginTop: 32,
  },
  wordHuge: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 45,
    lineHeight: 45,
    color: '#000',
  },
  tokenLogo: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 25,
    height: 12,
  },
  greatAwarenessTopLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontFamily: 'PublicSans_700Bold',
    fontSize: 20,
    zIndex: 10,
  },
  textContainer: {
    marginTop: 80,
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  helloText: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 45,
    lineHeight: 45,
    color: '#000',
    fontWeight: 'bold',
  },
  iconGrid: {
    marginTop: 40,
    marginBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
    width: '90%',
  },
  iconContainer: {
    position: 'relative',
    width: 120,
    height: 132,
  },
  redSquareIcon: {
    width: 120,
    height: 132,
  },
  iconOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconText: {
    position: 'absolute',
    bottom: 10,
    fontFamily: 'PublicSans_700Bold',
    color: 'black',
    fontSize: 13,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
});


