import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface OrderData {
  orderId: string;
  amount: number;
  shippingAddress: any;
  items: any[];
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state as OrderData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  useEffect(() => {
    // Redirect if no order data
    if (!orderData || !orderData.orderId) {
      navigate('/checkout');
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [orderData, navigate]);

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user token
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Create Razorpay order
      const response = await fetch('API_ENDPOINTS.createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: orderData.amount,
          currency: 'INR',
          orderId: orderData.orderId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      // Initialize Razorpay checkout
      const options = {
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'BloomNest',
        description: 'Eco-Friendly Products',
        image: '/logo.png',
        order_id: data.data.orderId,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
          qr: true,
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['qr', 'collect', 'intent']
                  }
                ]
              },
              card: {
                name: 'Credit/Debit Card',
                instruments: [
                  {
                    method: 'card'
                  }
                ]
              },
              other: {
                name: 'Other Payment Methods',
                instruments: [
                  {
                    method: 'netbanking'
                  },
                  {
                    method: 'wallet'
                  }
                ]
              }
            },
            sequence: ['block.utib', 'block.card', 'block.other'],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('API_ENDPOINTS.verifyPayment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment successful
              navigate('/order-confirmation', {
                state: {
                  orderId: orderData.orderId,
                  paymentId: response.razorpay_payment_id,
                },
              });
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: orderData.shippingAddress?.fullName || '',
          email: orderData.shippingAddress?.email || '',
          contact: orderData.shippingAddress?.phone || '',
        },
        notes: {
          orderId: orderData.orderId,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled. Please try again.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Update order to COD
      const response = await fetch(`API_ENDPOINTS.orders/${orderData.orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: 'cod',
          orderStatus: 'processing',
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/order-confirmation', {
          state: {
            orderId: orderData.orderId,
            paymentMethod: 'cod',
          },
        });
      } else {
        throw new Error(data.message || 'Failed to process COD order');
      }
    } catch (err: any) {
      console.error('COD error:', err);
      setError(err.message || 'Failed to process order. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
          <p className="mt-2 text-gray-600">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Security Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                    <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Payment Method</h2>

                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'razorpay'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-gray-700" />
                        <h3 className="font-semibold text-gray-900">Credit/Debit Card, UPI, Net Banking</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Pay securely using Razorpay - supports all major payment methods
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                          Visa
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                          Mastercard
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                          UPI
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                          Net Banking
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                          Wallets
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COD Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'cod'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {paymentMethod === 'cod' && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600">
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      {paymentMethod === 'razorpay' ? 'Pay Securely' : 'Place Order'}
                    </span>
                  )}
                </button>

                {/* Security Info */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-4">
                  <Lock className="w-4 h-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {orderData.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{orderData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{orderData.amount.toFixed(2)}</span>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                <p className="text-sm text-gray-600">
                  {orderData.shippingAddress?.fullName}<br />
                  {orderData.shippingAddress?.address}<br />
                  {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.pincode}<br />
                  Phone: {orderData.shippingAddress?.phone}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Easy Returns & Refunds</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

// Made with Bob
