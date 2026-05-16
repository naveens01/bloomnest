const nodemailer = require('nodemailer');

/**
 * Email utility for sending emails via nodemailer
 * Supports both production (real SMTP) and development (console logging) modes
 */

// Create transporter based on environment
const createTransporter = () => {
  // Check if email credentials are configured
  const isConfigured = process.env.EMAIL_HOST && 
                       process.env.EMAIL_PORT && 
                       process.env.EMAIL_USER && 
                       process.env.EMAIL_PASS;

  if (!isConfigured) {
    console.log('📧 Email service running in DEVELOPMENT mode (emails will be logged to console)');
    return null;
  }

  // Production mode - use real SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

/**
 * Send welcome email to new user
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Email send result
 */
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'BloomNest <noreply@bloomnest.com>',
    to: email,
    subject: 'Welcome to BloomNest! 🌱',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 Welcome to BloomNest!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}! 👋</h2>
            <p>Thank you for joining BloomNest - your destination for eco-friendly and sustainable products.</p>
            <p>Your account has been successfully created and you can now:</p>
            <ul>
              <li>Browse our curated collection of sustainable products</li>
              <li>Add items to your wishlist</li>
              <li>Place orders with secure payment</li>
              <li>Track your orders in real-time</li>
            </ul>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Start Shopping</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy shopping! 🛍️</p>
          </div>
          <div class="footer">
            <p>© 2024 BloomNest. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to BloomNest!
      
      Hello ${name}!
      
      Thank you for joining BloomNest - your destination for eco-friendly and sustainable products.
      
      Your account has been successfully created and you can now:
      - Browse our curated collection of sustainable products
      - Add items to your wishlist
      - Place orders with secure payment
      - Track your orders in real-time
      
      Visit us at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
      
      If you have any questions, feel free to reach out to our support team.
      
      Happy shopping!
      
      © 2024 BloomNest. All rights reserved.
    `,
  };

  // Development mode - log to console
  if (!transporter) {
    console.log('\n📧 ===== EMAIL (DEVELOPMENT MODE) =====');
    console.log('To:', email);
    console.log('Subject:', mailOptions.subject);
    console.log('Content:', mailOptions.text);
    console.log('=====================================\n');
    return { success: true, mode: 'development' };
  }

  // Production mode - send actual email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
    return { success: true, messageId: info.messageId, mode: 'production' };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send order confirmation email
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {Object} order - Order details
 * @returns {Promise<Object>} - Email send result
 */
const sendOrderConfirmationEmail = async (email, name, order) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'BloomNest <noreply@bloomnest.com>',
    to: email,
    subject: `Order Confirmation - ${order.orderNumber} 📦`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you, ${name}! 🎉</h2>
            <p>Your order has been successfully placed and is being processed.</p>
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
              <p><strong>Items:</strong> ${order.items.length} item(s)</p>
            </div>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" class="button">Track Your Order</a>
            </p>
            <p>We'll send you another email when your order ships.</p>
          </div>
          <div class="footer">
            <p>© 2024 BloomNest. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Development mode - log to console
  if (!transporter) {
    console.log('\n📧 ===== ORDER CONFIRMATION EMAIL (DEVELOPMENT MODE) =====');
    console.log('To:', email);
    console.log('Subject:', mailOptions.subject);
    console.log('Order Number:', order.orderNumber);
    console.log('Total Amount: ₹', order.totalAmount);
    console.log('=========================================================\n');
    return { success: true, mode: 'development' };
  }

  // Production mode - send actual email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', email);
    return { success: true, messageId: info.messageId, mode: 'production' };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
};

// Made with Bob
