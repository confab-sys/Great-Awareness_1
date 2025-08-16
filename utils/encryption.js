import { Buffer } from 'buffer';

// Generate password for Daraja API
export const generatePassword = (shortcode, passkey, timestamp) => {
  const str = shortcode + passkey + timestamp;
  const buffer = Buffer.from(str, 'utf8');
  return buffer.toString('base64');
};

// Generate timestamp in Daraja format (YYYYMMDDHHmmss)
export const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Generate unique transaction reference
export const generateTransactionReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `GA_${timestamp}_${random}`.toUpperCase();
};

// Format phone number to 254 format
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If it starts with +, remove it
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // If it's 11 digits and starts with 254, return as is
  if (cleaned.length === 11 && cleaned.startsWith('254')) {
    return cleaned;
  }
  
  // If it's 9 digits, add 254 prefix
  if (cleaned.length === 9) {
    return '254' + cleaned;
  }
  
  return cleaned;
};
