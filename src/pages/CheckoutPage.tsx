import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem } from '../types';
import { CreditCard, MapPin, Package, ArrowLeft, Check, Truck, Lock } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  onClearCart: () => void;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onClearCart }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }

    // Fetch user data and pre-populate address
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.status === 'success' && data.data.user) {
          const user = data.data.user;
          
          // Pre-populate with user's default address
          setShippingAddress({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            street: user.defaultAddress?.street || '',
            city: user.defaultAddress?.city || '',
            state: user.defaultAddress?.state || '',
            zipCode: user.defaultAddress?.pincode || '',
            country: user.defaultAddress?.country || 'India'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [cart, navigate]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 15.99 : shippingMethod === 'overnight' ? 29.99 : subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Get user token
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Generate order number
      const orderNumber = `BN${Date.now()}`;

      // Create order on backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderNumber: orderNumber,
          items: cart.map(item => ({
            product: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress: {
            fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.zipCode,
            country: shippingAddress.country,
          },
          totalAmount: total,
          payment: {
            method: 'pending',
          },
          shipping: {
            method: shippingMethod,
            cost: shippingCost,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to payment page with order data
        navigate('/payment', {
          state: {
            orderId: data.data._id,
            orderNumber: orderNumber,
            amount: total,
            shippingAddress: {
              fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
              email: shippingAddress.email,
              phone: shippingAddress.phone,
              address: shippingAddress.street,
              city: shippingAddress.city,
              state: shippingAddress.state,
              pincode: shippingAddress.zipCode,
            },
            items: cart,
          },
        });
      } else {
        alert(data.message || 'Failed to create order');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
      setProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: MapPin },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: Package }
  ];

  if (cart.length === 0) {
    return null;
  }

  return (
    <main className="min-h-screen bg-eco-pattern pt-20 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-eco-700 hover:text-eco-900 mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Shopping</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-eco">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-eco-500 to-nature-500 text-white shadow-eco-glow'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-eco-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-eco-500 to-nature-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl shadow-eco-glow p-6 sm:p-8 border border-eco-200 animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-eco-100 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-eco-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-eco-900">Shipping Address</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eco-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eco-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eco-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">State *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-eco-700 mb-3">Shipping Method</label>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', name: 'Standard Shipping', time: '5-7 business days', cost: subtotal > 50 ? 0 : 9.99 },
                        { id: 'express', name: 'Express Shipping', time: '2-3 business days', cost: 15.99 },
                        { id: 'overnight', name: 'Overnight Shipping', time: '1 business day', cost: 29.99 }
                      ].map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            shippingMethod === method.id
                              ? 'border-eco-500 bg-eco-50'
                              : 'border-eco-200 hover:border-eco-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={method.id}
                              checked={shippingMethod === method.id}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="w-5 h-5 text-eco-600"
                            />
                            <div>
                              <p className="font-semibold text-eco-900">{method.name}</p>
                              <p className="text-sm text-eco-600">{method.time}</p>
                            </div>
                          </div>
                          <span className="font-bold text-eco-700">
                            {method.cost === 0 ? 'FREE' : `₹${method.cost.toFixed(2)}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-eco-500 to-nature-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-eco-glow-lg transition-all duration-300 hover:scale-105"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl shadow-eco-glow p-6 sm:p-8 border border-eco-200 animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-eco-100 p-3 rounded-xl">
                    <CreditCard className="h-6 w-6 text-eco-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-eco-900">Payment Information</h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-eco-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setPaymentInfo({ ...paymentInfo, cardNumber: value });
                      }}
                      className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-eco-700 mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={paymentInfo.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setPaymentInfo({ ...paymentInfo, expiryDate: value });
                        }}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-eco-700 mb-2">CVV *</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-3 border-2 border-eco-200 rounded-xl focus:ring-2 focus:ring-eco-400 focus:border-eco-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-eco-50 rounded-xl p-4 flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-eco-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-eco-700">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 border-2 border-eco-200 text-eco-700 py-4 rounded-2xl font-semibold text-lg hover:bg-eco-50 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-eco-500 to-nature-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-eco-glow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing...' : 'Continue to Payment'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-eco-glow p-6 border border-eco-200 sticky top-24">
              <h3 className="text-xl font-bold text-eco-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-eco-900 text-sm line-clamp-2">{item.name}</p>
                      <p className="text-sm text-eco-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-eco-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-eco-200 pt-4 space-y-3">
                <div className="flex justify-between text-eco-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-eco-700">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-eco-700">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-eco-200 pt-3 flex justify-between text-lg font-bold text-eco-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-eco-50 to-nature-50 rounded-xl p-4 border border-eco-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-5 w-5 text-eco-600" />
                  <p className="font-semibold text-eco-900">Free Shipping</p>
                </div>
                <p className="text-sm text-eco-600">
                  {subtotal > 50 ? 'You qualify for free shipping!' : `Add ₹${(50 - subtotal).toFixed(2)} more for free shipping`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;

// Made with Bob
