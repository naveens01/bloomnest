const twilio = require('twilio');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let twilioClient = null;

// Only initialize if credentials are provided
if (accountSid && authToken && twilioPhone) {
  twilioClient = twilio(accountSid, authToken);
}

/**
 * Send OTP via SMS using Twilio
 * @param {string} phone - Phone number with country code (e.g., +919876543210)
 * @param {string} otp - OTP code to send
 * @returns {Promise<object>} - Twilio message response
 */
const sendOTP = async (phone, otp) => {
  try {
    // If Twilio is not configured, log OTP to console (development mode)
    if (!twilioClient) {
      console.log(`📱 OTP for ${phone}: ${otp}`);
      console.log('⚠️  Twilio not configured. OTP logged to console for development.');
      return {
        success: true,
        message: 'OTP sent successfully (development mode)',
        sid: 'dev-mode-' + Date.now()
      };
    }

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: `Your BloomNest verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
      from: twilioPhone,
      to: phone
    });

    console.log(`✅ OTP sent to ${phone} via Twilio. SID: ${message.sid}`);
    
    return {
      success: true,
      message: 'OTP sent successfully',
      sid: message.sid
    };
  } catch (error) {
    console.error('❌ Twilio SMS error:', error);
    
    // In development, still log OTP even if Twilio fails
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${phone}: ${otp} (Twilio failed, showing for dev)`);
      return {
        success: true,
        message: 'OTP sent successfully (development fallback)',
        sid: 'dev-fallback-' + Date.now()
      };
    }
    
    throw new Error('Failed to send OTP. Please try again.');
  }
};

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Format phone number to E.164 format (+919876543210)
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 91 (India) and has 12 digits, add +
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return '+' + cleaned;
  }
  
  // If it has 10 digits, assume India and add +91
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  
  // If it already has +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Default: add + if not present
  return '+' + cleaned;
};

module.exports = {
  sendOTP,
  generateOTP,
  formatPhoneNumber
};

// Made with Bob
